const express = require("express");

const app = express();

app.use(express.json());

// This is where you would import and use your MinIO client to interact with MinIO.
// require("../../tests/minio.test");

// Importing routes for version 1 of the API
app.use("/api/v1", require("./v1/routes"));

module.exports = app;
