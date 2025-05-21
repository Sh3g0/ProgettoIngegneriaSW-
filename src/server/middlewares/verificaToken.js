import jwt from 'jsonwebtoken';
const SECRET_KEY = 'chiave_super_segreta'; // La stessa usata quando crei il token

function verificaToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token mancante' });

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

