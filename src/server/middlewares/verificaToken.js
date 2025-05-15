import jwt from 'jsonwebtoken';
const SECRET_KEY = 'chiave_super_segreta'; // La stessa usata quando crei il token

function verificaToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(403).json({ message: 'Token mancante' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token non valido' });

    req.user = user; // lo user (username, ruolo...) che avevi messo nel token
    next();
  });
}

export { verificaToken };

