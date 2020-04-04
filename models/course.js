const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = Schema({
  idCourse: Number,
  link: String,
  coupon: String,
  price: Number,
  order: Number,
  logicDelete: Boolean
});

module.exports = mongoose.model('Course', CourseSchema);
