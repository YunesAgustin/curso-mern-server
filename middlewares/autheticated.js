const jwt = require('jwt-simple');
const moment = require('moment');

const SECRET_KEY = '2Yu783Her8cHac47';

exports.ensureAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: 'La peticion no tiene cabecera de autenticacion.' });
  }

  const token = req.headers.authorization.replace(/['"]+/g, ''); // Cambia lo primero por cadena vacia (limpia el token)

  try {
    var payload = jwt.decode(token, SECRET_KEY);

    if (payload.exp >= moment.unix()) {
      return res.status(404).send({ message: 'El token ha expirado.' });
    }
  } catch (err) {
    return res.status(404).send({ message: 'Token invalido.' });
  }

  req.user = payload;
  next(); // Lo autoriza a hacer la siguiente funcion en el routes/user, o sea hace getUsers
};
