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

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token non valido' });

    req.user = user; // lo user (username, ruolo...) che avevi messo nel token
    next();
  });
}

export { verificaToken };

