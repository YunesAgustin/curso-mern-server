const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const saltRounds = 10; // Es para poder usar el bcrypt
const jwt = require('../services/jwt');
const User = require('../models/user');

// Aqui van  los end point de user

function signUp(req, res) {
  const user = new User();

  const { name, lastName, email, password, repeatPassword } = req.body;
  user.name = name;
  user.lastName = lastName;
  user.email = email.toLowerCase();
  user.role = 'admin';
  user.active = false;

  // Para generar password encriptadas con bcrypt

  if (!password || !repeatPassword) {
    res.status(404).send({ message: 'Las contrasenñas son obligatorias.' });
  } else {
    if (password !== repeatPassword) {
      res
        .status(404)
        .send({ message: 'Las contrasenñas tienen que ser iguales.' });
    } else {
      bcrypt.hash(password, saltRounds, function(err, hash) {
        if (err) {
          res.status(500).send({ message: 'Error al encriptar la contraseña' });
        } else {
          user.password = hash;

          user.save((err, userStored) => {
            if (err) {
              res.status(500).send({ message: 'El usuario ya existe.' });
            } else {
              if (!userStored) {
                res.status(404).send({ message: 'Error al crear el usuario.' });
              } else {
                res.status(200).send({ user: userStored });
              }
            }
          });
        }
      });
    }
  }
}

function signIn(req, res) {
  const params = req.body;
  const email = params.email.toLowerCase();
  const password = params.password;

  // Busca el user y si lo encuentra lo devuelve en userStored
  // Lo que se manda en el res.send... es lo que se le envia al front
  User.findOne({ email }, (err, userStored) => {
    if (err) {
      res.status(500).send({ message: 'Error del servidor.' });
    } else {
      if (!userStored) {
        res.status(404).send({ message: 'El usuario no existe.' });
      } else {
        bcrypt.compare(password, userStored.password, (err, check) => {
          if (err) {
            res.status(500).send({ message: 'Error del servidor.' });
          } else if (!check) {
            res.status(404).send({ message: 'La contraseña es incorrecta.' });
          } else {
            if (!userStored.active) {
              res
                .status(200)
                .send({ code: 200, message: 'El usuario no se ha activado.' });
            } else {
              res.status(200).send({
                accessToken: jwt.createAccessToken(userStored),
                refreshToken: jwt.createRefreshToken(userStored)
              });
            }
          }
        });
      }
    }
  });
}

function getUsers(req, res) {
  User.find().then(users => {
    if (!users) {
      res.status(404).send({ message: 'No se han encontrado usuarios.' });
    } else {
      res.status(200).send({ users });
    }
  });
}

function getUsersActive(req, res) {
  const query = req.query;
  User.find({ active: query.active }).then(users => {
    if (!users) {
      res.status(404).send({ message: 'No se han encontrado usuarios.' });
    } else {
      res.status(200).send({ users });
    }
  });
}
function uploadAvatar(req, res) {
  // Para subir un avatar al servidor
  const params = req.params;

  User.findById({ _id: params.id }, (err, userData) => {
    if (err) {
      res.status(500).send({ message: 'Error del servidor.' });
    } else {
      if (!userData) {
        res.status(404).send({ message: 'No seha encontrado ningun usuario.' });
      } else {
        // Recuperamos la imagen
        let user = userData;

        if (req.files) {
          let filePath = req.files.avatar.path;
          let fileSplit = filePath.split('/');
          let fileName = fileSplit[2];
          let extSplit = fileName.split('.');
          let fileExt = extSplit[1];

          // Comprobamos si la extension es correcta
          if (fileExt !== 'png' && fileExt !== 'jpg') {
            res.status(400).send({
              message:
                'La extension de la imagen no es valida. (Extensiones permitidas .png y .jpg)'
            });
          } else {
            // Actualizamos
            user.avatar = fileName;
            User.findByIdAndUpdate(
              { _id: params.id },
              user,
              (err, userResult) => {
                if (err) {
                  res.status(500).send({ message: 'Error del servidor.' });
                } else {
                  if (!userResult) {
                    res
                      .status(400)
                      .send({ message: 'No se ha encontrado ningun usuario.' });
                  } else {
                    res.status(200).send({ avatarName: fileName });
                  }
                }
              }
            );
          }
        }
      }
    }
  });
}

function getAvatar(req, res) {
  const avatarName = req.params.avatarName; // De aqui tomo el id que le estoy enviando por parametro
  const filePath = './uploads/avatar/' + avatarName;

  fs.exists(filePath, exists => {
    if (!exists) {
      res.status(404).send({ message: 'El avatar que buscas no existe.' });
    } else {
      res.sendFile(path.resolve(filePath));
    }
  });
}

function updateUser(req, res) {
  const userData = req.body; // Los datos actualizados los mandamos por el body
  const params = req.params;

  // Le paso como segundo parametro el userData q son los datos q actualiza
  User.findByIdAndUpdate({ _id: params.id }, userData, (err, userUpdate) => {
    if (err) {
      res.status(500).send({ message: 'Error del servidor.' });
    } else {
      if (!userUpdate) {
        res
          .status(404)
          .send({ message: 'No se ha encontrado ningun usuario.' });
      } else {
        res.status(200).send({ message: 'Usuario actualizado correctamente.' });
      }
    }
  });
}
module.exports = {
  signUp,
  signIn,
  getUsers,
  getUsersActive,
  uploadAvatar,
  getAvatar,
  updateUser
};
