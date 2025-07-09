// backend/middleware/adminMiddleware.js

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // Allow access
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

// Alias export for consistency in different files
export const isAdmin = adminOnly;


