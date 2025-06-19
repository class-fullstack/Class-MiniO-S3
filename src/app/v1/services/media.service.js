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
}

module.exports = MediaService;
