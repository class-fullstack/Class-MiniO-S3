const express = require("express");

const MediaController = require("../../controllers/media.controller");
const MulterUpload = require("../../../../utils/multer.util");

const router = express.Router();

// Route for uploading a single file
router.post(
  "/upload/single",
  MulterUpload.single("file"),
  MediaController.uploadSingleFile
);

// Route for uploading multiple files
router.post(
  "/upload/multiple",
  MulterUpload.array("files"),
  MediaController.uploadMultipleFiles
);

module.exports = router;
