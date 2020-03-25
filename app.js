const express = require('express');
const bodyPaser = require('body-parser');

const app = express();

const { API_VERSION } = require('./config');

// LOAD RUTINGS...
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.use(bodyPaser.urlencoded({ extended: false }));
app.use(bodyPaser.json());

// configure head http

// routes basic...
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);

module.exports = app;
