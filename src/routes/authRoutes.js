// authRoutes.js
const express = require('express')
const router = express.Router()
const { authenticate } = require('../middleware/authMiddleware')


router.get('/dashboard', authenticate, (req, res) => {
    console.log(req.session.user_id)
    res.render('dashboard', {
        layout: 'main',
        pageTitle: 'Dashboard',
        user: req.session.user_id
    });
});

module.exports = router;