import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { User } from './db/db.js';
import { signupSchema, generateToken, decodeToken } from './utils.js';
import { authMiddleware } from './middlware.js';


dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.post('/api/v1/signup', async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid input' });

  try {
    const existing = await User.findOne({ email: parsed.data.email });
    if (existing) return res.status(409).json({ message: 'User already exists' });

    const passwordToken = generateToken({ password: parsed.data.password });

    const newUser = new User({
      userName: parsed.data.userName,
      email: parsed.data.email,
      password: passwordToken,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser._id, userName: newUser.userName, email: newUser.email },
    });
  } catch {
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/api/v1/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const decoded = decodeToken(user.password);
    if (decoded.password !== password) return res.status(401).json({ message: 'Incorrect password' });

    const token = generateToken({ id: user._id, email: user.email });

    res.status(200).json({
      message: 'Signin successful',
      token,
      user: { id: user._id, userName: user.userName, email: user.email },
    });
  } catch {
    res.status(500).json({ message: 'Error signing in' });
  }
});
app.get('/api/v1/getallusers', authMiddleware, (req, res) => {
  //getting all the users except the logged in user

  const loggedInUser = (req as any).user;

  User.find({ _id: { $ne: loggedInUser.id } })
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch(() => {
      res.status(500).json({ message: 'Error fetching users' });
    });

});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
