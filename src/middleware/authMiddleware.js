// authMiddleware.js
function authenticate(req, res, next) {
    if (req.path == '/login') return next();
    if (req.session && req.session.user_id) {
        return next();
    } else {
        res.redirect('/login')
    }
}

module.exports = {
    authenticate
}