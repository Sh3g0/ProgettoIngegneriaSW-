import jwt from 'jsonwebtoken';

const SECRET = 'supersegreto'; // cambia con una variabile d’ambiente seria

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token mancante' });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token non valido' });

    req.user = user; // Salviamo l'oggetto decodificato (es. { user: 5, ruolo: 'admin' })
    next();
  });
}
