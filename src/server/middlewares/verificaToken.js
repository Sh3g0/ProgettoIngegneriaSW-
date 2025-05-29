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

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({ message: 'Token non valido' });
    }
    req.utente = payload;  
    next();
  });
}

export { verificaToken };
