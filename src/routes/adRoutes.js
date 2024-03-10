const express = require('express')
const router = express.Router()
const Ad = require('../models/ad')

router.get('/adAdd', (req, res) => {
    res.render('adSubmission', {
        pageTitle: 'Add an ad',
    });
});

router.post('/api/addAd', async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const newAd = Ad.create({
            title,
            description,
            category
        });

        res.status(200).send("Ad added successfully");
        console.log('Status 200');
    } catch (error) {
        console.log('Error adding ad to database', error.message);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
