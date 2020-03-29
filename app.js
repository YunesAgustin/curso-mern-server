const express = require('express');
const bodyPaser = require('body-parser');

const app = express();

const { API_VERSION } = require('./config');

// LOAD ROUTINGS...
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const menuRoutes = require('./routes/menu');

app.use(bodyPaser.urlencoded({ extended: false }));
app.use(bodyPaser.json());

// Configure Header HTTP
// Con esta configuracion no hace falta que se utilize la extension de CORS en el chrome
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// routes basic...
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, menuRoutes);

module.exports = app;
