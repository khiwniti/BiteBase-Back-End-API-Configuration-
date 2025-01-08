import jwt from 'jsonwebtoken';
import { createClient } from 'redis';

const redisClient = createClient();
redisClient.connect();

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const cachedToken = await redisClient.get(decoded.id);

    if (cachedToken !== token) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

