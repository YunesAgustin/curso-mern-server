const Post = require('../models/post');

function addPost(req, res) {
  const body = req.body;
  const post = new Post(body); // Creamos una nueva intancia y le pasamos los datos

  post.save((err, postStored) => {
    if (err) {
      res.status(500).send({
        code: 500,
        message: 'Error del servidor. Este post ya existe.',
      });
    } else {
      if (!postStored) {
        res.status(404).send({
          code: 404,
          message: 'No se ha podido crear el post.',
        });
      } else {
        res
          .status(200)
          .send({ code: 200, message: 'Post creado correctamente.' });
      }
    }
  });
}

function getPosts(req, res) {
  const { page = 1, limit = 10 } = req.query; // req.query es lo que va despues de la url www.udemy.com?....

  const options = {
    page, // page: page, es lo mismo porq se llaman igual
    limit: parseInt(limit),
    sort: { date: 'desc' },
  };

  Post.paginate({}, options, (err, postStored) => {
    if (err) {
      res.status(500).send({ code: 500, message: 'Error del servidor.' });
    } else {
      if (!postStored) {
        res
          .status(404)
          .send({ code: 404, message: 'No se han encontrado posts.' });
      } else {
        res.status(200).send({ code: 200, posts: postStored });
      }
    }
  });
}

function updatePost(req, res) {
  const { id } = req.params;
  const postData = req.body;

  Post.findByIdAndUpdate(id, postData, (err, postUpdate) => {
    if (err) {
      res.status(500).send({ code: 500, message: 'Error del servidor.' });
    } else {
      if (!postUpdate) {
        res
          .status(404)
          .send({ code: 404, message: 'No se han encontrado posts.' });
      } else {
        res.status(200).send({
          code: 200,
          message: 'El post se ha actualizado correctamente.',
        });
      }
    }
  });
}

function deletePost(req, res) {
  const { id } = req.params;

  Post.findByIdAndRemove(id, (err, postDeleted) => {
    if (err) {
      res.status(500).send({ code: 500, message: 'Error del servidor.' });
    } else {
      if (!postDeleted) {
        res
          .status(404)
          .send({ code: 404, message: 'No se ha encontrado el post.' });
      } else {
        res.status(200).send({
          code: 200,
          message: 'El post se ha eliminado.',
        });
      }
    }
  });
}

function getPost(req, res) {
  const { url } = req.params;

  Post.findOne({ url }, (err, postStored) => {
    //Porque que quiero buscar por url y como en al bd tengo ese campo puedo poner asi. Sino seria link: url
    if (err) {
      res.status(500).send({ code: 500, message: 'Error del servidor.' });
    } else {
      if (!postStored) {
        res
          .status(404)
          .send({ code: 404, message: 'No se ha encontrado el post.' });
      } else {
        res.status(200).send({ code: 200, post: postStored });
      }
    }
  });
}

module.exports = {
  addPost,
  getPosts,
  updatePost,
  deletePost,
  getPost,
};
