const minioClient = require("../src/dbs/init.minio");

(async () => {
  try {
    const bucketName = "minio-class"; // This is name bucket
    const objectName = "example.txt"; // This is name object
    const filePath = "./example.txt"; // Path to the file you want to upload

    // Upload a file
    await minioClient.fPutObject(bucketName, objectName, filePath);
    console.log(`✅ File uploaded successfully: ${objectName}`);

    // List objects in a bucket
    const stream = minioClient.listObjects(bucketName, "", true);
    stream.on("data", (obj) => console.log(obj));
    stream.on("end", () => console.log("✅ Finished listing objects."));
    stream.on("error", (error) =>
      console.error("❌ Error listing objects:", error.message)
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
})();
