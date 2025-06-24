const { nanoid } = require("nanoid");
const dayjs = require("dayjs");

const generateObjectId = ({
  company = "class",
  type = "FILE",
  randomLength = 8,
} = {}) => {
  const date = dayjs().format("YYYYMMDD");
  const randomId = nanoid(randomLength);
  return `${company}-${type}-${date}-${randomId}`;
};

const getFileTypeFromMime = (mimeType = "") => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";

  if (mimeType === "application/pdf") return "pdf";
  if (
    [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(mimeType)
  )
    return "doc";

  if (
    [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ].includes(mimeType)
  )
    return "excel";

  if (
    [
      "application/zip",
      "application/x-rar-compressed",
      "application/x-7z-compressed",
    ].includes(mimeType)
  )
    return "zip";

  if (mimeType.startsWith("text/")) return "text";

  return "unknown";
};
module.exports = {
  generateObjectId,
  getFileTypeFromMime,
};
