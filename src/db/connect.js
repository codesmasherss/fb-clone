const mongoose = require('mongoose');
// Connect to the database
mongoose.connect('mongodb://localhost:27017/fb-api', {
   useNewUrlParser: true
});

const db = mongoose.connection;

db.once('open', () => {
   console.log('connected successfully');
});
