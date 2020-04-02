const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = Schema({
  idCourse: {
    type: Number,
    unique: true,
    required: true // Para obligar a ingresar este dato sino da err
  },
  link: String,
  coupon: String,
  price: Number,
  order: Number,
  logicDelete: Boolean
});

module.exports = mongoose.model('Course', CourseSchema);
