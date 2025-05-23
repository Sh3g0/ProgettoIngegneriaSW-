import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.JWT_SECRET; // La stessa usata quando crei il token
//import { useRouter } from 'next/navigation';

function verificaToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  //const router = useRouter();

  console.log(token);
  console.log(SECRET_KEY);
  if (!token) {
    //router.push('\login');
    return res.status(403).json({ message: 'Token mancante' });
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

