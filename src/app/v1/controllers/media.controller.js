const MediaService = require("../services/media.service");

class MediaController {
  async uploadSingleFile(req, res) {
    try {
      const file = await MediaService.uploadSingleFile(req);
      return res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        data: file,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async uploadMultipleFiles(req, res) {
    try {
      const files = await MediaService.uploadMultipleFiles(req);
      return res.status(200).json({
        success: true,
        message: "Files uploaded successfully",
        data: files,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async downLoadObject(req, res) {
    const { bucketName, objectName } = req.params;
    console.log("Fetching object:", bucketName, objectName);
    try {
      const dataStream = await MediaService.downLoadObject(
        bucketName,
        objectName
      );
      res.set("Content-Type", "application/octet-stream");
      dataStream.pipe(res);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getObjectUrl(req, res) {
    const { bucketName, objectName } = req.params;
    try {
      const url = await MediaService.getObjectUrl(bucketName, objectName);
      return res.status(200).json({
        success: true,
        message: "Object URL fetched successfully",
        data: url,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getObjectInfo(req, res) {
    const { bucketName, objectName } = req.params;
    try {
      const info = await MediaService.getObjectInfo(bucketName, objectName);
      return res.status(200).json({
        success: true,
        message: "Object info fetched successfully",
        data: info,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new MediaController();
