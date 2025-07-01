import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

function verificaToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Token ricevuto:', token);

  if (!token) {
    return res.status(401).json({ message: 'Token mancante' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.utente = decoded; 
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token non valido' });
  }
}

export { verificaToken };
