// Server.js
const express = require('express');
const exphbs = require('express-handlebars');

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize } = require('./database/connection');

const path = require('path');

const adRoutes = require('./routes/adRoutes');
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const loginRoutes = require('./routes/loginRoutes');
const { authenticate } = require('./middleware/authMiddleware');
const { HttpError } = require('./error');

const app = express();
const PORT = 3000;

const hbs = exphbs.create({
  extname: 'hbs',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: [
    path.join(__dirname, 'views/partials'),
  ]
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

// app.use(express.bodyParser());
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
}));


// app.use((req, res, next) => {
//   req.session.numberOfVisists = req.session.numberOfVisists + 1 || 1;
//   res.send("Visits" + req.session.numberOfVisists);
// })

app.use(require('./middleware/sendHttpError'))


app.use('/', adRoutes);
app.use('/', authRoutes);
app.use('/', homeRoutes);
app.use('/', loginRoutes);


app.use((err, req, res, next) => {
  if (typeof err == 'number') {
    err = new HttpError(err)
  }
  if (err instanceof HttpError) {
    res.sendHttpError(err)
  } else {
    if (app.get('env') == 'development') {
      // var errorHandler = express.errorHandler()
      // errorHandler(err, req, res, next)
      res.send(err)
      console.log(err)
    } else {
      res.send(500)
    }
  }
})


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
