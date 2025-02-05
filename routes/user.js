const express = require('express');
const UserController = require('../controllers/user');
const multipart = require('connect-multiparty');
const md_auth = require('../middlewares/autheticated'); // Cuando lo uso autorizo esas pags solo para usuarios logueados
const md_upload_avatar = multipart({ uploadDir: './uploads/avatar' }); // Guardoo los avatars en esta direccion?
const api = express.Router();

// Si hacen un apeticion diferente pueden usar la misma url,
// no haria falta que una peticion post, get o put usen una url
// diferente c/u.
api.post('/sign-up', UserController.signUp);
api.post('/sign-in', UserController.signIn);
api.get('/users', [md_auth.ensureAuth], UserController.getUsers);
api.get('/users-active', [md_auth.ensureAuth], UserController.getUsersActive);
api.put(
  '/upload-avatar/:id',
  [md_auth.ensureAuth, md_upload_avatar],
  UserController.uploadAvatar
); // Los :id es lo q paso por parametro
api.get('/get-avatar/:avatarName', UserController.getAvatar);
api.put('/update-user/:id', [md_auth.ensureAuth], UserController.updateUser);
api.put(
  '/activate-user/:id',
  [md_auth.ensureAuth],
  UserController.activateUser
);
api.delete('/delete-user/:id', [md_auth.ensureAuth], UserController.deleteUser);
api.post('/sign-up-admin', [md_auth.ensureAuth], UserController.signUpAdmin);

module.exports = api; // Exporta todas las rutas definidas en api
