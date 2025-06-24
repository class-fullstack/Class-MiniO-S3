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

// Route for fetching a file
router.get("/:bucketName/:objectName", MediaController.downLoadObject);

// Route for fetching URL of a file
router.get("/:bucketName/:objectName/url", MediaController.getObjectUrl);

// Route for getting information about a file
router.get("/:bucketName/:objectName/info", MediaController.getObjectInfo);

// Route for deleting multiple files
router.delete("/multiple", MediaController.deleteObjects);

// Route for deleting a file
router.delete("/:bucketName/:objectName", MediaController.deleteObject);

module.exports = router;
