import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { User } from './db/db.js';
import { generateToken, signupSchema } from './utils.js';

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT || 5000;

app.post('/api/v1/signup', async (req, res) => {
  const body = req.body; // get request body

  // Validate input using zod
  const parsedBody = signupSchema.safeParse(body);
  if (!parsedBody.success) {
    return res.status(400).json({
      message: 'Invalid input',
      errors: parsedBody.error,
    });
  }

  try {
    const newUser = new User({
      userName: body.userName,
      email: body.email,
      password: generateToken({ password: body.password }), //hashing password for security
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error registering user',
      error,
    });
  }
});

app.post('/api/v1/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = generateToken({ id: user._id, email: user.email });

    res.status(200).json({
      message: 'Signin successful',
      token,
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error signing in',
      error,
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
