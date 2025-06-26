const path = require("path");
const {
  getFileTypeFromMime,
  getFolderByFileType,
  generateObjectId,
} = require("./generateObjectId.util");

const buildObjectName = (originalName, mimeType) => {
  const extension = path.extname(originalName);
  const fileType = getFileTypeFromMime(mimeType);
  const folderName = getFolderByFileType(fileType);
  const objectId = generateObjectId({
    company: "class",
    type: fileType.toUpperCase(),
    randomLength: 10,
  });
  const envFolder = process.env.NODE_ENV === "production" ? "prod" : "dev";
  const objectName = `${envFolder}/${folderName}/${objectId}${extension}`;

  return {
    objectName,
    objectId,
    folderName,
    fileType,
    extension,
    envFolder,
  };
};

module.exports = {
  buildObjectName,
};
