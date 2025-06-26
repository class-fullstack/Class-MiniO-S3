const path = require("path");

const MediaConstant = require("../../../constants/media.constant");
const {
  getFileTypeFromMime,
  generateObjectId,
  getFolderByFileType,
} = require("../../../utils/generateObjectId.util");
const MediaModel = require("../models/media.model");

class MediaService {
  static async uploadSingleFile(req) {
    const file = req.file;
    if (!file) throw new Error("No file uploaded");

    const bucketName = MediaConstant.BucketName;
    const { originalname, buffer, mimetype, size } = file;

    const fileType = getFileTypeFromMime(mimetype);
    const extension = path.extname(originalname); // e.g., '.jpg'

    const objectId = generateObjectId({
      company: "class",
      type: fileType.toUpperCase(),
      randomLength: 10,
    });

    const folderName = getFolderByFileType(fileType);
    const objectName = `${folderName}/${objectId}${extension}`;

    const metadata = {
      objectId,
      uploader: "Nguyen Tien Tai", // optional: lấy từ auth
      fileType,
      originalName: originalname,
      mimeType: mimetype,
    };

    await MediaModel.uploadObject({
      bucketName,
      objectName,
      fileBuffer: buffer,
      mimeType: mimetype,
      metaData: metadata,
    });

    return {
      id: objectId,
      path: objectName,
      type: fileType,
      contentType: mimetype,
      size,
      originalName: originalname,
      bucket: bucketName,
      folder: folderName,
    };
  }

  static async uploadMultipleFiles(req) {
    const files = req.files;
    if (!files || files.length === 0) {
      throw new Error("No files uploaded");
    }

    const bucketName = MediaConstant.BucketName;

    const uploadTasks = files.map(async (file) => {
      const { originalname, buffer, mimetype, size } = file;
      const fileType = getFileTypeFromMime(mimetype);
      const extension = path.extname(originalname);

      const objectId = generateObjectId({
        company: "class",
        type: fileType.toUpperCase(),
        randomLength: 10,
      });

      const folderName = getFolderByFileType(fileType);
      const objectName = `${folderName}/${objectId}${extension}`;

      const metadata = {
        objectId,
        uploader: "Nguyen Tien Tai",
        fileType,
        originalName: originalname,
        mimeType: mimetype,
      };

      await MediaModel.uploadObject({
        bucketName,
        objectName,
        fileBuffer: buffer,
        mimeType: mimetype,
        metaData: metadata,
      });

      return {
        id: objectId,
        path: objectName,
        type: fileType,
        contentType: mimetype,
        size,
        originalName: originalname,
        bucket: bucketName,
        folder: folderName,
      };
    });

    const results = await Promise.all(uploadTasks);
    return results;
  }

  static async downLoadObject(bucketName, objectName) {
    if (!bucketName || !objectName) {
      throw new Error("Bucket name and object name are required");
    }

    const dataStream = await MediaModel.downLoadObject(bucketName, objectName);
    return dataStream;
  }

  static async getObjectUrl(bucketName, objectName) {
    if (!bucketName || !objectName) {
      throw new Error("Bucket name and object name are required");
    }

    const oneMinute = 60; // 1 minute in seconds

    const fileInfo = await MediaModel.getObjectInfo(bucketName, objectName);

    const url = await MediaModel.getObjectUrl(
      bucketName,
      objectName,
      oneMinute,
      {
        "response-content-type": fileInfo.metaData.minetype, // hoặc image/jpeg tùy loại file
        "response-content-disposition": "inline",
      }
    );
    return url;
  }

  static async getObjectInfo(bucketName, objectName) {
    if (!bucketName || !objectName) {
      throw new Error("Bucket name and object name are required");
    }

    const objectInfo = await MediaModel.getObjectInfo(bucketName, objectName);
    return objectInfo;
  }

  static async getListObjects(bucketName) {
    if (!bucketName) {
      throw new Error("Bucket name is required");
    }

    const objects = await MediaModel.getListObjects(bucketName);
    return objects;
  }

  static async deleteObject(bucketName, objectName) {
    if (!bucketName || !objectName) {
      throw new Error("Bucket name and object name are required");
    }

    await MediaModel.deleteObject(bucketName, objectName);
    return { success: true, message: "Object deleted successfully" };
  }

  static async deleteObjects(bucketName, objectNames) {
    if (!bucketName || !objectNames || objectNames.length === 0) {
      throw new Error("Bucket name and object names are required");
    }

    await MediaModel.deleteObjects(bucketName, objectNames);
    return { success: true, message: "Objects deleted successfully" };
  }
}

module.exports = MediaService;
