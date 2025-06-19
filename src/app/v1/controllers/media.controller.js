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
}

module.exports = new MediaController();
