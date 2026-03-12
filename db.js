const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String 
});

const assignmentSchema = new mongoose.Schema({
  title: String,
  course: String,
  due_date: String,
  description: String
});

const submissionSchema = new mongoose.Schema({
  student_name: String,
  assignment_title: String,
  answer: String,
  submission_date: String,
  status: String,
  marks: { type: Number, default: null }
});

const User = mongoose.model('User', userSchema);
const Assignment = mongoose.model('Assignment', assignmentSchema);
const Submission = mongoose.model('Submission', submissionSchema);

module.exports = { User, Assignment, Submission };