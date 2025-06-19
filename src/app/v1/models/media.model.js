const minioClient = require("../../../dbs/init.minio");

class MediaModel {
  static async uploadObject({ bucketName, objectName, fileBuffer, mimeType }) {
    console.log(bucketName, objectName, fileBuffer, mimeType);
    try {
      await minioClient.putObject(
        bucketName,
        objectName,
        fileBuffer,
        fileBuffer.length,
        {
          "Content-Type": mimeType, // Set the correct MIME type
        }
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
}

module.exports = MediaModel;
