const { Client } = require("minio");

const minioClient = new Client({
  endPoint: process.env.ENDPOINT,
  port: process.env.MINIO_PORT,
  accessKey: process.env.ACCESS_KEY,
  secretKey: process.env.SECRET_KEY,
  useSSL: false,
});

// Export the client directly
module.exports = minioClient;
