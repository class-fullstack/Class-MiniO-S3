const express = require("express");

const app = express();

app.use(express.json());

// require("../../tests/minio.test");

app.use("/api/v1", require("./v1/routes"));

module.exports = app;
