const express = require('express');
const AuthController = require('../controllers/auth');

const api = express.Router();

api.post('/refresh-access-token', AuthController.refreshAccesToken);

module.exports = api;
