const express = require("express");
const router = require('../router/index');
const app = express();

app.use(router)

module.exports = app;