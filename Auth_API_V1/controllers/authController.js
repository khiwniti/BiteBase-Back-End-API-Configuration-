import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createClient } from 'redis';
import User from '../models/User.js';

const redisClient = createClient();
redisClient.connect();

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await redisClient.set(user._id.toString(), token, 'EX', 3600);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
};

export const googleAuth = (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  redisClient.set(req.user._id.toString(), token, 'EX', 3600);
  res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
};

export const facebookAuth = (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  redisClient.set(req.user._id.toString(), token, 'EX', 3600);
  res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
};

