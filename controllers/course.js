const Course = require('../models/course');

function addCourse(req, res) {
  const body = req.body;
  const course = new Course(body); // Le paso todo los datos del body
  course.order = 0;

  course.save((err, courseStored) => {
    if (err) {
      res.status(400).send({ code: 400, message: 'El curso ya existe.' });
    } else {
      if (!courseStored) {
        res
          .status(400)
          .send({ code: 400, message: 'No se ha podido crear el curso.' });
      } else {
        res
          .status(200)
          .send({ code: 200, message: 'Curso creado correctamente.' });
      }
    }
  });
}

function getCourses(req, res) {
  Course.find({ logicDelete: null })
    .sort({ order: 'asc' })
    .exec((err, courses) => {
      if (err) {
        res.status(500).send({ code: 500, message: 'Error del servidor.' });
      } else {
        if (!courses) {
          res
            .status(404)
            .send({ code: 404, message: 'No se han encontrado cursos' });
        } else {
          res.status(200).send({ code: 200, courses: courses });
        }
      }
    });
}

function updateCourse(req, res) {
  let courseData = req.body;
  const id = req.params.id;

  Course.findByIdAndUpdate(id, courseData, (err, courseUpdate) => {
    if (err) {
      res.status(500).send({ code: 500, message: 'Error del servidor.' });
    } else {
      if (!courseUpdate) {
        res
          .status(404)
          .send({ code: 404, message: 'No se ha encontrado el curso' });
      } else {
        res.status(200).send({
          code: 200,
          message: 'Curso actualizado correctamente.'
        });
      }
    }
  });
}

module.exports = {
  addCourse,
  getCourses,
  updateCourse
};
