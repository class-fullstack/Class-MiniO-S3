class MediaService {
  static async uploadSingleFile(req) {
    console.log("Uploading single file...", req.file);
  }

  static async uploadMultipleFiles(req) {
    console.log("Uploading multiple files...", req.files);
  }
}

module.exports = MediaService;
