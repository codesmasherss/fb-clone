const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
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

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
