export const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    if (!roles.includes(req.session.user.role)) {
      return res.status(403).send('Accès refusé');
    }
    next();
  };
};

export const optionalAuth = (req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
};
