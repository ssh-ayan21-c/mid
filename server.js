const express = require('express');
const cors = require('cors');
const { User, Assignment, Submission } = require('./db');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/login', async (req, res) => {
  const { username, password, role } = req.body;
  let user = await User.findOne({ username });
  if (user) {
    if (user.password !== password) return res.json({ success: false, message: 'Wrong password' });
  } else {
    user = await User.create({ username, password, role: role || 'student' });
  }
  res.json({ success: true, role: user.role, username: user.username });
});

app.post('/assignment/create', async (req, res) => {
  const { title, course, due_date, description } = req.body;
  await Assignment.create({ title, course, due_date, description });
  res.json({ success: true, message: 'Assignment created!' });
});

app.get('/assignments', async (req, res) => {
  const data = await Assignment.find();
  res.json(data);
});

app.post('/submit', async (req, res) => {
  const { student_name, assignment_title, answer } = req.body;
  await Submission.create({
    student_name,
    assignment_title,
    answer,
    submission_date: new Date().toISOString().split('T')[0],
    status: 'Submitted'
  });
  res.json({ success: true, message: 'Submitted successfully!' });
});

app.put('/submission/marks', async (req, res) => {
  const { id, marks } = req.body;
  await Submission.findByIdAndUpdate(id, { marks });
  res.json({ success: true, message: 'Marks assigned!' });
});

app.get('/submissions', async (req, res) => {
  const data = await Submission.find();
  res.json(data);
});

app.listen(3000, async ()=>{
    await mongoose.connect('mongodb://localhost:27017/exam')
    console.log('Server running on http://localhost:3000');
})