const mongoose = require('mongoose');
// Connect to the database
mongoose.connect('mongodb://localhost:27017/fb-api', {
   useNewUrlParser: true
});

// const db = mongoose.connection;

mongoose.connection.once('open', () => {
   console.log('Database has been connected successfully.');
});
