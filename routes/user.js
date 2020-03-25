const express = require('express');
const UserController = require('../controllers/user');
const md_auth = require('../middlewares/autheticated'); // Cuando lo uso autorizo esas pags solo para usuarios logueados
const api = express.Router();

api.post('/sign-up', UserController.signUp);
api.post('/sign-in', UserController.signIn);
api.get('/users', [md_auth.ensureAuth], UserController.getUsers);
api.get('/users-active', [md_auth.ensureAuth], UserController.getUsersActive);

module.exports = api;