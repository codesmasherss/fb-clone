const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
   {
      _id: {
         type: String
      },
      text: {
         type: String,
         required: false
      },
      image: {
         type: String,
         required: false
      },
      likes: {
         type: Array
      },
      date: {
         type: Date
      },
      // We always user the ID of the user, but due to learning purposes we shall use the object here
      userId: {
         type: String
      }
   },
   {
      timestamps: true
   }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
