const express = require('express'); //ok
const mongoose = require('mongoose'); //ok
const cookieSession = require('cookie-session');
// cookieSession(no navegador) vs express-session(no servidor)
const passport = require('passport');
//Passport -> é um middleware que faz a implementação de autenticação.
//(OAuth) de outros serviços (google, facebook, twitter)
const bodyParser = require('body-parser'); //ok
const keys = require('./config/keys');

require('./models/User');
require('./models/Blog');
require('./services/passport');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });

const app = express();

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/blogRoutes')(app);

if (['production'].includes(process.env.NODE_ENV)) {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port`, PORT);
});
