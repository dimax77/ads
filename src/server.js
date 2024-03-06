const express = require('express');
const exphbs = require('express-handlebars')
const session = require('express-session')
const path = require('path')
const { sequelize } = require('./database/connection');
const Ad = require('./models/ad');
const app = express();
const PORT = 3000;

// const hbs = exphbs.create({
//   partialsDir: __dirname + '/views/partials'

// })
const hbs = exphbs.create({
  extname: 'hbs',
  // defaultLayout: 'base',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: [
    //  path to your partials
    path.join(__dirname, 'views/partials'),
  ]
});
console.log(hbs)
console.log(hbs.content)
console.log(hbs.layoutsDir)
console.log(hbs.hbs)
// hbs.registerPartials(__dirname + '/views/partials');
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

app.get('/', (req, res) => {
  console.log("Root route preccessing")
  res.render('home', {
    pageTitle: 'Home',
    companyTitle: 'Your Company',
    companyLogo: '/path/to/logo.png',
    userControls: '<a href="/login">Login</a> | <a href="/signup">Sign Up</a>',
        content: 'Content for home page...'
  });
});

function authenticate(req, res, next) {
  if (req.session && req.session.user) {
    // User is authenticated, proceed to the next middleware or route handler
    return next();
  } else {
    // User is not authenticated, redirect to login page
    res.redirect('/login');
  }
}

// Apply the authenticate middleware to routes that require authentication
app.get('/dashboard', authenticate, (req, res) => {
  res.render('dashboard', {
    pageTitle: 'Dashboard',
    // Other dashboard content...
  });
});

// Example login route
app.post('/login', (req, res) => {
  // Authenticate user (check username/password)
  const user = { username: 'exampleUser' };

  // Store user information in the session
  req.session.user = user;

  res.redirect('/dashboard');
});

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

// app.listen(PORT, async () => {
//   console.log(`Server running on http://localhost:${PORT}`);
//   try {
//     await sequelize.authenticate();
//     console.log('Connection to the database has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error.message);
//   }
// });
