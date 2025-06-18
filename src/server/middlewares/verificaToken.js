import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

function verificaToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token mancante' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    // usa la tua chiave
    req.user = decoded; // ⚠️ Questo deve contenere l'id!
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token non valido' });
  }
}

export { verificaToken };
