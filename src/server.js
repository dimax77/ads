const express = require('express');
const exphbs = require('express-handlebars')
const session = require('express-session')
const { sequelize } = require('./database/connection');
const Ad = require('./models/ad');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const hbs = exphbs.create()

app.engine('handlebrs', hbs.engine)
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
  res.render('home', {
    pgaeTtile: 'Title',
    companyName: 'Company Name',
    companyLogo: 'path/to/logo.png',
    userControls: 'Login | Sign Up',
    content: 'Content for home page'
  })
})

app.post('/api/addAd', async (req, res) => {
  try {
    const { title, description, category } = req.body;

    console.log(req.body);

    // Create a new Ad using Sequelize model
    const newAd = await Ad.create({
      title,
      description,
      category,
      // Add more fields as needed
    });

    // Perform additional operations here

    // Respond with a success message
    res.status(200).send('Ad submitted successfully');
    console.log('status 200');
  } catch (error) {
    console.error('Error adding ad to the database:', error.message);
    res.status(500).send('Internal Server Error');
  }
});


const initializeApp = async () => {
  try {
    let retries = 5;
    while (retries) {
      try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
        await sequelize.sync(); // Sync models with the database
        break; // If successful, break out of the retry loop
      } catch (error) {
        console.error('Error connecting to the database:', error.message);
        retries -= 1;
        console.log(`Retrying in 5 seconds... (${retries} retries left)`);
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds
      }
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the application:', error.message);
    process.exit(1); // Terminate the application if an error occurs
  }
};

initializeApp();
