const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('home', {
        pageTitle: "Home",
        companyTitle: "Company Name",
        companyLogo: "/public/images/logo.png"
    });
});

module.exports = router;
