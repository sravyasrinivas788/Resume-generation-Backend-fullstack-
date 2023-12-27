// const express = require('express');
// const User = require('../models/Usermodel');
// const Res = require('../models/Resumemodel');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const router = express.Router();
// const keywordExtractor = require('keyword-extractor');
// const app = express.Router();
// app.use(express.json());
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './uploads');
    
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + '.pdf');
//   },
// });
// const upload = multer({ storage });
// app.post('/save-pdf', upload.single('resume'), async (req, res) => {
//   try {
//     const { filename, originalname, mimetype, size,buffer: pdfData } = req.file;
//     const { RollNumber, skills } = req.body;
//     ///const pdfData = req.file.buffer;
//     const savedResume = {
//       filename,
//       originalname,
//       mimetype,
//       size,
//       RollNumber,
//       skills,
//       pdfData,
      
//       // You can include additional fields or metadata about the saved resume
//     };

//     // Save the saved resume details to the database
//     const newSavedResume = new Res(savedResume);
//     await newSavedResume.save();

//     res.json({ message: 'Resume saved successfully' });
//   } catch (error) {
//     console.error('Error saving resume:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
// app.post('/search-by-intrested', async (req, res) => {
//   try {
//     const { skills } = req.body;
    
//     // Search resumes based on intrested field
//     const matchingResumes = await Res.find({ skills: { $regex: skills, $options: 'i' } });
//     //const matchingResumes = await Res.find({ skills: { $in: skills } });
//     res.json(matchingResumes);
//   } catch (error) {
//     console.error('Error searching by intrested field:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
// // In your backend
// const resumesDirectory = path.join(__dirname, './uploads');
// app.use('/uploads', express.static(resumesDirectory));





// router.get('/view-pdf/:filename', async (req, res) => {
//   const { filename } = req.params;
  

//   try {
//     // Assuming you have a Resume model with a field 'filename'
//     const resume = await Res.findOne({ filename: filename  });

//     if (!resume) {
//       console.error('Error fetching resume: Resume not found');
//       res.status(404).json({ error: 'Resume not found' });
//       return;
//     }

//     // const resumePath = path.join(resumesDirectory, resume.filename);
//     res.setHeader('Content-Disposition', `inline; filename="${resume.filename}"`);
//     res.setHeader('Content-Type', 'application/pdf');
//     res.send(resume.pdfData);
    

    
//     // res.send(resume.pdfData);

    
//     res.sendFile(resumePath);
//   } catch (error) {
//     console.error('Error fetching resume:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });



// app.post('/login', async (req, res) => {
//   try {
//     console.log('entered');
//     const result = await User.findOne({ name: req.body.name, roll: req.body.roll });
//     console.log(result);

//     if (result) {
//       console.log('got result');
//       res.send(result);
//     } else {
//       res.status(400).json('Login Failed');
//     }
//   } catch (error) {
//     res.status(400).json(error);
//   }
// });

// app.post('/register', async (req, res) => {
//   try {
//     const newuser = new User(req.body);
//     await newuser.save();
//     res.send('reg ok');
//   } catch (error) {
//     res.status(400).json(error);
//   }
// });

// app.post('/update', async (req, res) => {
//   try {
//     console.log('entered update');

//     // If there's a base64Image in the request, update the profileImage field

//     await User.findOneAndUpdate({ _id: req.body._id }, req.body);
//     const user = await User.findOne({ _id: req.body._id });
//     res.send('Registration successful');
//     console.log(user);
//   } catch (error) {
//     res.status(400).json(error);
//   }
// });

// module.exports = app;
const express = require('express');
const User = require('../models/Usermodel');
const Res = require('../models/Resumemodel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const keywordExtractor = require('keyword-extractor');
const app = express.Router();
const nodemailer = require('nodemailer');



app.use(express.json());
const { v4: uuidv4 } = require('uuid');
const imagesDirectory = path.join(__dirname, './images');
if (!fs.existsSync(imagesDirectory)) {
  fs.mkdirSync(imagesDirectory);
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads');
      
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.pdf');
    },
  });
  const upload = multer({ storage });
  app.post('/save-pdf', upload.single('resume'), async (req, res) => {
    try {
      const { filename, originalname, mimetype, size,buffer: pdfData } = req.file;
      const { RollNumber, skills } = req.body;
      ///const pdfData = req.file.buffer;
      const savedResume = {
        filename,
        originalname,
        mimetype,
        size,
        RollNumber,
        skills,
        pdfData,
        
        // You can include additional fields or metadata about the saved resume
      };
  
      // Save the saved resume details to the database
      const newSavedResume = new Res(savedResume);
      await newSavedResume.save();
  
      res.json({ message: 'Resume saved successfully' });
    } catch (error) {
      console.error('Error saving resume:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



app.post('/search-by-intrested', async (req, res) => {
  try {
    
      const { skills } = req.body;
  
      // Split the entered skills into individual keywords
      const keywords = skills.split(' ');
  
      // Create a regular expression pattern to match any of the individual keywords
      const regexPattern = new RegExp(keywords.join('|'), 'i');
  
      // Search resumes based on the regular expression pattern
      const matchingResumes = await Res.find({ skills: { $regex: regexPattern } });
      
      
   
    res.json(matchingResumes);
  } catch (error) {
    console.error('Error searching by intrested field:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
const resumesDirectory = path.join(__dirname, './uploads');
app.use('/uploads', express.static(resumesDirectory));





router.get('/view-pdf/:filename', async (req, res) => {
  const { filename } = req.params;
  

  try {
    // Assuming you have a Resume model with a field 'filename'
    const resume = await Res.findOne({ filename: filename  });

    if (!resume) {
      console.error('Error fetching resume: Resume not found');
      res.status(404).json({ error: 'Resume not found' });
      return;
    }

    // const resumePath = path.join(resumesDirectory, resume.filename);
    res.setHeader('Content-Disposition', `inline; filename="${resume.filename}"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(resume.pdfData);
    

    
    // res.send(resume.pdfData);

    
    res.sendFile(resumePath);
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/placement/action', async (req, res) => {
  try {
    const { rollNumber, action } = req.body;

    // Find the resume by roll number
    const resume = await Res.findOne({ RollNumber: rollNumber });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Update placement status
    resume.placementStatus = action;
    await resume.save();
    const user = await User.findOne({ roll: rollNumber });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userEmail = user.Email;

    // Send email notification
    const emailSubject = `Placement Status Update for Roll Number ${rollNumber}`;
    const emailBody = `Dear student,\n\nYour placement status has been updated. Status: ${action}\n\nBest regards,\nThe Placement Team`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sravyasri2602@gmail.com', // replace with your Gmail address
        pass: 'iidb eocl dquo kxni ', // replace with your Gmail password or an app-specific password
      },
    });

    const mailOptions = {
      from: 'sravyasri2602@gmai.com', // replace with your Gmail address
      to: userEmail,
      subject: emailSubject,
      text: emailBody,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    // Notify the student (you may have a separate notification system)
    // You can use WebSocket, send an email, or any other method to notify the student.

    res.json({ message: `Resume ${action.toLowerCase()} successfully. Email notification sent.` });
  } catch (error) {
    console.error('Error processing placement action:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/action', async (req, res) => {
  try {
    const { rollNumber, action } = req.body;

    // Implement your logic to update placement status in the database based on rollNumber and action
    // ...

    res.json({ message: `Placement action '${action}' processed successfully` });
  } catch (error) {
    console.error('Error processing placement action:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





app.post('/login', async (req, res) => {
  try {
    console.log('entered');
    const result = await User.findOne({ name: req.body.name, roll: req.body.roll });
    console.log(result);

    if (result) {
      console.log('got result');
      res.send(result);
    } else {
      res.status(400).json('Login Failed');
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

app.post('/register', async (req, res) => {
  try {
    const newuser = new User(req.body);
    await newuser.save();
    res.send('reg ok');
  } catch (error) {
    res.status(400).json(error);
  }
});

app.post('/update', async (req, res) => {
  try {
    console.log('entered update');

    // If there's a base64Image in the request, update the profileImage field

    await User.findOneAndUpdate({ _id: req.body._id }, req.body);
    const user = await User.findOne({ _id: req.body._id });
    res.send('Registration successful');
    console.log(user);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = app;

