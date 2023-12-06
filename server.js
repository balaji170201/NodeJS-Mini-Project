const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost/mentoring_app', { useNewUrlParser: true, useUnifiedTopology: true });

//Mongoose models
const Mentor = mongoose.model('Mentor', 
    { name: String }
);
const Student = mongoose.model('Student', 
    { name: String, 
      mentor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Mentor' 
    } 
});

// Middleware to parse JSON
app.use(express.json());

// API to create Mentor
app.post('/api/mentors', async (req, res) => {
  try {
    const mentor = await Mentor.create(req.body);
    res.json(mentor);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API to create Student
app.post('/api/students', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API to assign a student to a mentor
app.put('/api/assignMentor/:mentorId/:studentId', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.studentId, { mentor: req.params.mentorId }, { new: true });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API to get students without a mentor
app.get('/api/studentsWithoutMentor', async (req, res) => {
  try {
    const students = await Student.find({ mentor: null });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API to change mentor for a student
app.put('/api/changeMentor/:studentId/:newMentorId', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.studentId, { mentor: req.params.newMentorId }, { new: true });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API to get all students for a particular mentor
app.get('/api/studentsForMentor/:mentorId', async (req, res) => {
  try {
    const students = await Student.find({ mentor: req.params.mentorId });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API to get the previously assigned mentor for a student
app.get('/api/previousMentor/:studentId', async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    const previousMentor = student ? student.mentor : null;
    res.json({ previousMentor });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port :${PORT}`);
});
