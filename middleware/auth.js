// middleware/auth.js
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

// -------------------------------------------------------
// Middleware 1 : Protection des routes FRONTEND (session)
// -------------------------------------------------------
export const isLogged = (req, res, next) => {
  if (req.session && req.session.user) {
    return next()
  }
  res.redirect('/login')
}

// -------------------------------------------------------
// Middleware 2 : Protection des routes API (JWT)
// -------------------------------------------------------
export const authentification = (req, res, next) => {
  // Le token doit être dans le header : Authorization: Bearer <token>
  const authHeader = req.headers['authorization']

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Accès refusé. Aucun token fourni. Connectez-vous d\'abord via POST /api/auth/login'
    })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.utilisateur = decoded // { id, email, roleId }
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré.' })
  }
}
