const express = require('express');
const router = new express.Router();
const PostModel = require('../models/Post');

// Get requests
router.get('/posts', async (req, res) => {
   try {
      const allPosts = await PostModel.find({}).sort({ createdAt: -1 });

      res.send({
         posts: allPosts
      });
   } catch (e) {
      res.status(500).send({
         error: e
      });
   }
});

// Post requests
router.post('/addPost', async (req, res) => {
   try {
      const newPost = await PostModel.create(req.body);

      res.send({
         newPost,
         message: 'Post has been added successfully.'
      });
   } catch (e) {
      res.status(500).send({
         error: e,
         message: 'error adding the user to the database'
      });
   }
});

router.delete('/deletePost', async (req, res) => {
   try {
      const deletedPost = await PostModel.deleteOne({
         _id: req.body.postId
      });

      res.send({
         message: 'Post has been deleted successfully.'
      });
   } catch (e) {
      console.log(e);
      res.status(500).send({
         error: e,
         message: 'error adding the user to the database'
      });
   }
});

router.post('/likeAPost', async (req, res) => {
   try {
      const updatedPost = await PostModel.updateOne(
         {
            _id: req.body.updatedPost._id
         },
         req.body.updatedPost
      );

      res.send({
         message: 'Post has been liked successfully.'
      });
   } catch (e) {
      res.status(500).send({
         error: e,
         message: 'error adding the user to the database'
      });
   }
});

module.exports = router;
