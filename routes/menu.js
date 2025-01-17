const express = require('express');
const MenuController = require('../controllers/menu');
const md_auth = require('../middlewares/autheticated');

const api = express.Router();

api.post('/add-menu', [md_auth.ensureAuth], MenuController.addMenu);
api.get('/get-menus', MenuController.getMenus);
api.put('/update-menu/:id', [md_auth.ensureAuth], MenuController.updateMenu);

module.exports = api;
