// authRoutes.js
const express = require('express')
const router = express.Router()
const { authenticate } = require('../middleware/authMiddleware')


router.get('/dashboard', authenticate, (req, res) => {
    res.render('dashboard', {
        layout: 'main',
        pageTitle: 'Dashboard',
        user: req.user
    });
});

module.exports = router;