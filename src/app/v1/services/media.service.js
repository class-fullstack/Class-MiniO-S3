const MediaConstant = require("../../../constants/media.constant");
const MediaModel = require("../models/media.model");

class MediaService {
  static async uploadSingleFile(req) {
    const file = req.file;

    if (!file) {
      throw new Error("No file uploaded");
    }

    const bucketName = MediaConstant.BucketName; // Replace with your bucket name
    const fileName = file.originalname; // You can modify this to change the file name if needed
    const fileBuffer = file.buffer;
    const mineType = file.mimetype;

    const media = await MediaModel.uploadObject({
      bucketName,
      objectName: fileName,
      fileBuffer,
      contentType: mineType,
    });
    return media;
  }

  static async uploadMultipleFiles(req) {
    const files = req.files;

    if (!files || files.length === 0) {
      throw new Error("No files uploaded");
    }

    const bucketName = MediaConstant.BucketName; // Replace with your bucket name

    const objects = files.map((file) => ({
      objectName: file.originalname, // You can modify this to change the file name if needed
      fileBuffer: file.buffer,
      mimeType: file.mimetype,
    }));

    const media = await MediaModel.uploadObjects(bucketName, objects);
    return media;
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

    const url = await MediaModel.getObjectUrl(
      bucketName,
      objectName,
      oneMinute
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
