const express = require('express')
const router = express.Router()
const User = require('../models/user')
const HttpError = require('../error').HttpError

router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Registration Form'
    })
})

router.post('/register', async (req, res, next) => {
    const newUser = req.body.username;
    try {
        const existingUser = await User.findOne({ where: { name: newUser } })
        if (existingUser) {
            return next(new HttpError(409, "User already exists"));
        } else {
            const password = req.body.password;
            const user = await User.create({
                name: newUser,
                password: password
            })
            // req.session.user = user.id;
            res.render('login', {
                title: `User ${username} successfully added`,
                message:'Now you can login'
            });
        }
    } catch (error) {
        next(error)
    }

})

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    req.user = null;
    res.redirect('home');
});

router.post('/login', async (req, res, next) => {
    const user = req.body.username;

    try {
        // const existingUser = await User.findOne({ where: { name: user } });
        const existingUser = await User.findOne({ name: user });

        if (existingUser&&req.body.password == existingUser.password) {
            
            req.session.user_id = existingUser.id;
            req.user = res.locals.user = existingUser
            res.redirect('/dashboard');
        } else {
            res.render('/login', {
                message: 'Incorrect input: User does not exists or wrong password.'
            })
        }
    } catch (error) {
        next(error)
    }

});

// router.get('/signin', (req, res) => {
//     res.render('signin', {
//         pageTitle: 'Sign In'
//     });
// })
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll()
        console.log(req.params)
        res.status(200).json(users)
    } catch (error) {
        console.log('Error fetc hing users', error.message)
        res.status(500).send('Internal server error')
    }
})

router.get('/users/:id', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id)
        if (!user) {
            console.log("User not found");
            return next(new HttpError(404, "User not found"));
        }
        // res.status(200).json(user)
        res.json(user)
    } catch (error) {
        next(error)
    }
})
module.exports = router
