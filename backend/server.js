import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import authRoutes from './routes/auth.js';
import './config/passport.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

