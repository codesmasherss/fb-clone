class Model {
   constructor() {
      this.posts = [];

      //   User credentials
      this.user = {
         userId: 'user1'
      };
   }

   get getUserData() {
      return this.user;
   }

   async loadAllPosts() {
      const response = await fetch('/posts', {
         method: 'GET',
         headers: {
            'content-type': 'application/json'
         }
      });

      let data = await response.json();

      this.posts = data.posts;
   }

   async addPost(post) {
      const thePost = {
         _id: Date.now().toString(),
         text: post.text,
         image: post.image,
         likes: [],
         date: new Date()
      };

      // Add the post to the Database
      await fetch('/addPost', {
         method: 'POST',
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify(thePost)
      });

      // Add the post to the POSTs
      this.posts.unshift(thePost);
   }

   async deletePost(postId) {
      // Let's send a delete request to the server
      await fetch('/deletePost', {
         method: 'DELETE',
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify({ postId })
      });

      await this.loadAllPosts();
   }

   async likeAPost(postId) {
      const userData = this.getUserData;

      let updatedPost = this.posts.filter((post) => {
         if (post._id === postId) {
            // Check if liked
            let likeIndex = post.likes.findIndex((userId) => userId == userData.userId);

            if (likeIndex === -1) {
               // Add the like
               post.likes.push(userData.userId);
            } else {
               // Remove the like
               post.likes.splice(likeIndex, 1);
            }

            return post;
         }
      });

      const updateThePost = await fetch('/likeAPost', {
         method: 'POST',
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify({ updatedPost: updatedPost[0] })
      });

      await this.loadAllPosts();
   }
}

class View {
   constructor() {
      this.postsList = document.querySelector('#posts-list');
      this.postForm = document.querySelector('#create-post-form');
      this.postFormText = document.querySelector('#post-form-text');
      this.postFormImage = document.querySelector('#post-form-image');
      this.postFormImageInput = document.querySelector('#post-form-image-input');
      this.postFormImageContainer = document.querySelector('#image-input-container');
   }

   generatePost(data, userData) {
      const thePost = `
        <div class="post" id="${data._id}">
            <div class="post-top">
                <div class="dp">
                    <img src="./src/images/dp.jpg" alt="">
                </div>
                <div class="post-info">
                    <p class="name">Khalil Ahmad</p>
                    <span class="time">${this.timeSince(data.date)}</span>
                </div>
                <i class="fas fa-trash delete" style="color: darkred" id="delete-${data._id}"></i>
            </div>

            <div class="post-content">
                ${data.text}
                ${data.image ? '<img src="' + data.image + '">' : ''}
            </div>
            
            <div class="post-bottom">
                <div class="action" id="like-${data._id}" style="background: ${
         data.likes.includes(userData.userId) ? '#eee' : 'transparent'
      }">
                    <i class="far fa-thumbs-up"></i>
                    <span>${data.likes.includes(userData.userId) ? 'Liked' : 'Like'}</span>
                </div>
                <div class="action">
                    <i class="far fa-comment"></i>
                    <span>Comment</span>
                </div>
                <div class="action">
                    <i class="fa fa-share"></i>
                    <span>Share</span>
                </div>
            </div>
        </div>`;

      return thePost;
   }

   displayPosts(posts, userData) {
      // Let's delete all the nodes that a posts container has
      if (this.postsList.children !== 0) {
         this.postsList.innerHTML = '';
      }

      if (posts.length === 0) {
         this.postsList.innerHTML = '<p>No Posts to show</p>';
      } else {
         let allPosts = ``;

         posts.forEach((post) => {
            let thePost = this.generatePost(post, userData);

            allPosts = allPosts + thePost;
         });
         this.postsList.innerHTML = allPosts;
      }

      //   Debugging:
      console.log(posts);
   }

   get _postFormText() {
      return this.postFormText.value;
   }

   get _postFormImageSrc() {
      return this.postFormImage.getAttribute('src');
   }

   timeSince(time) {
      switch (typeof time) {
         case 'number':
            break;
         case 'string':
            time = +new Date(time);
            break;
         case 'object':
            if (time.constructor === Date) time = time.getTime();
            break;
         default:
            time = +new Date();
      }
      var time_formats = [
         [60, 'seconds', 1], // 60
         [120, '1 minute ago', '1 minute from now'], // 60*2
         [3600, 'minutes', 60], // 60*60, 60
         [7200, '1 hour ago', '1 hour from now'], // 60*60*2
         [86400, 'hours', 3600], // 60*60*24, 60*60
         [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
         [604800, 'days', 86400], // 60*60*24*7, 60*60*24
         [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
         [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
         [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
         [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
         [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
         [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
         [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
         [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
      ];
      var seconds = (+new Date() - time) / 1000,
         token = 'ago',
         list_choice = 1;

      if (seconds == 0) {
         return 'Just now';
      }
      if (seconds < 0) {
         seconds = Math.abs(seconds);
         token = 'from now';
         list_choice = 2;
      }
      var i = 0,
         format;
      while ((format = time_formats[i++]))
         if (seconds < format[0]) {
            if (typeof format[2] == 'string') return format[list_choice];
            else return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
         }
      return time;
   }

   resetForm() {
      this.postFormText.value = '';
      this.postFormImage.src = '';
      this.postFormImageInput.value = null;
   }

   imageInputContainerHandler() {
      this.postFormImageContainer.addEventListener('click', (e) => {
         // If the container was clicked,
         this.postFormImageInput.click();
      });
   }

   changePostImageHandler() {
      this.postFormImageInput.addEventListener('change', (e) => {
         // If there's a new image uploaded, display it:

         let theImage = e.target.files[0];

         // Convert it to base64
         const reader = new FileReader();
         reader.onloadend = () => {
            // Embed it to the screen:
            this.postFormImage.src = reader.result;
         };

         reader.readAsDataURL(theImage);
      });
   }

   addPostHandler(callBackToModel) {
      this.postForm.addEventListener('submit', (e) => {
         e.preventDefault();

         if (this._postFormText || this._postFormImageSrc) {
            callBackToModel({
               text: this._postFormText,
               image: this._postFormImageSrc
            });

            // Reset the input text
            this.resetForm();
         }
      });
   }

   deletePostHandler(idCB) {
      // Rise an alert:

      this.postsList.addEventListener('click', (e) => {
         let [type, id] = e.target.id.split('-');
         if (type === 'delete') {
            idCB(id);
         }
      });
   }

   likeAPostHandler(postIdCB) {
      this.postsList.addEventListener('click', (e) => {
         let [type, id] = e.target.id.split('-');

         if (!type && !id) {
            // Maybe, it's the child elements are clicked
            [type, id] = e.target.parentElement.id.split('-');
         }

         if (type === 'like') {
            postIdCB(id);
         }
      });
   }
}

class Controller {
   constructor(model, view) {
      this.model = model;
      this.view = view;

      //   Enable and bind these functions
      this.view.addPostHandler(this.addPost);
      this.view.deletePostHandler(this.deletePost);
      this.view.likeAPostHandler(this.likeAPost);
      this.view.changePostImageHandler();
      this.view.imageInputContainerHandler();
   }

   init = async () => {
      // Get data from database
      await this.model.loadAllPosts();

      // Display it on the screen
      this.postsListChanged(this.model.posts, this.model.getUserData);
   };

   postsListChanged = (posts) => {
      this.view.displayPosts(posts, this.model.getUserData);
   };

   addPost = async (post) => {
      await this.model.addPost(post);

      // Also, as there is a change in posts-list, let's call the onPostsListChanged
      this.postsListChanged(this.model.posts);
   };

   deletePost = async (postId) => {
      await this.model.deletePost(postId);

      this.postsListChanged(this.model.posts);
   };

   likeAPost = async (postId) => {
      await this.model.likeAPost(postId);

      this.postsListChanged(this.model.posts);
   };
}

const app = new Controller(new Model(), new View());
app.init();
