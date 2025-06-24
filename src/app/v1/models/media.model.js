const minioClient = require("../../../dbs/init.minio");
const { getFileTypeFromMime } = require("../../../utils/generateObjectId.util");

class MediaModel {
  static async uploadObject({
    bucketName,
    objectName,
    fileBuffer,
    mimeType,
    metadata,
  }) {
    try {
      const fullMetaData = {
        "Content-Type": mimeType,
        ...metadata,
      };

      await minioClient.putObject(
        bucketName,
        objectName,
        fileBuffer,
        fileBuffer.length,
        fullMetaData
      );

      console.log(`✅ File uploaded successfully: ${objectName}`);
    } catch (error) {
      console.error(`❌ Error uploading file "${objectName}":`, error.message);
      throw error;
    }
  }

  static async uploadObjects(bucketName, objects) {
    try {
      const uploadPromises = objects.map(
        ({ objectName, fileBuffer, mimeType }) =>
          minioClient.putObject(
            bucketName,
            objectName,
            fileBuffer,
            fileBuffer.length,
            {
              "Content-Type": mimeType, // Set the correct MIME type for each file
            }
          )
      );
      await Promise.all(uploadPromises);
      console.log(`✅ All files pushed successfully to bucket: ${bucketName}`);
    } catch (error) {
      console.error(
        `❌ Error pushing files to bucket "${bucketName}":`,
        error.message
      );
      throw error;
    }
  }

  static async downLoadObject(bucketName, objectName) {
    try {
      const dataStream = await minioClient.getObject(bucketName, objectName);
      return dataStream;
    } catch (error) {
      console.error(`❌ Error fetching file "${objectName}":`, error.message);
      throw error;
    }
  }

  static async getObjectUrl(
    bucketName,
    objectName,
    expirySeconds = 3600,
    reqParams = {}
  ) {
    try {
      const url = await minioClient.presignedGetObject(
        bucketName,
        objectName,
        expirySeconds,
        reqParams
      );
      return url;
    } catch (error) {
      console.error(
        `❌ Error generating URL for "${objectName}":`,
        error.message
      );
      throw error;
    }
  }

  static async getObjectInfo(bucketName, objectName) {
    try {
      const info = await minioClient.statObject(bucketName, objectName);
      return info;
    } catch (error) {
      console.error(
        `❌ Error getting info for "${objectName}":`,
        error.message
      );
      throw error;
    }
  }

  static async deleteObject(bucketName, objectName) {
    try {
      await minioClient.removeObject(bucketName, objectName);
      console.log(`✅ Deleted "${objectName}" from "${bucketName}"`);
    } catch (error) {
      console.error(`❌ Error deleting "${objectName}":`, error.message);
      throw error;
    }
  }

  static async deleteObjects(bucketName, objectNames = []) {
    try {
      if (!Array.isArray(objectNames) || objectNames.length === 0) {
        throw new Error("Danh sách object không hợp lệ.");
      }

      const result = await minioClient.removeObjects(bucketName, objectNames);
      console.log(`✅ Deleted objects:`, objectNames);
      return result;
    } catch (error) {
      console.error(`❌ Error deleting multiple objects:`, error.message);
      throw error;
    }
  }

  static async getListObjects(bucketName) {
    // 1️⃣ Chuyển stream listObjectsV2 ➜ mảng tên object
    const objectNames = await new Promise((resolve, reject) => {
      const names = [];
      const stream = minioClient.listObjectsV2(bucketName, "", true);
      stream.on("data", (obj) => names.push(obj.name));
      stream.on("end", () => resolve(names));
      stream.on("error", reject);
    });

    // 2️⃣ Với mỗi object ➜ lấy stat + (nếu là ảnh) tạo presigned URL
    const objects = await Promise.all(
      objectNames.map(async (name) => {
        // Lấy metadata / kích thước / content-type
        const stat = await minioClient.statObject(bucketName, name);

        // Tùy server, content-type có thể nằm trong metaData hoặc trực tiếp trên stat
        const mimeType =
          stat.metaData?.["content-type"] ||
          stat.metaData?.["Content-Type"] ||
          stat.contentType ||
          "";

        const fileType = getFileTypeFromMime(mimeType);

        // Thông tin chung
        const baseInfo = {
          id: name, // objectName == id
          type: fileType,
          contentType: mimeType,
          size: stat.size,
          lastModified: stat.lastModified,
        };

        // Nếu là ảnh → tạo URL xem trực tiếp
        if (fileType === "image") {
          const url = await minioClient.presignedGetObject(
            bucketName,
            name,
            3600, // 1 giờ
            {
              "response-content-type": mimeType,
              "response-content-disposition": "inline",
            }
          );
          return { ...baseInfo, url };
        }

        return baseInfo;
      })
    );

    return objects;
  }
}

module.exports = MediaModel;
