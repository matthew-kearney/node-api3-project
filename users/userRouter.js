const express = require('express');

const router = express.Router();

const User = require('./userDb');
 const Post = require('../posts/postDb');


 //validate user
router.post('/', validateUser, (req, res) => {
  User.insert(req.body)
  .then(users => {
    res.status(201).json(users)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: 'Error adding the user.' })
  })
});


//validate post
router.post('/:id/posts', validatePost, (req, res) => {
  Post.insert(req.body)
  .then(userPost => {
    res.status(201).json(userPost)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: 'Error adding the post.' })
  })
});

//users
router.get('/', (req, res) => {
  User.get()
  .then(users => {
    res.status(200).json(users)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: 'Error retrieving the users.' })
  })
});


//validate users from id
router.get('/:id', validateUserId, (req, res) => {
  User.getById(req.params.id)
  .then(user => {
    res.status(200).json(user)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: 'Error retrieving the user.' })
  })
});


//get post by id
router.get('/:id/posts', (req, res) => {
  Post.getById(req.params.id)
   .then(posts => {
     res.status(200).json(posts)
   })
   .catch(err => {
     console.log(err);
     res.status(500).json({ message: 'Error retrieving the posts.' })
   })
});



//delete by id
router.delete('/:id', validateUserId, (req, res) => {
  User.remove(req.params.id)
   .then(count => {
     if (count > 0) {
       res.status(200).json({ message: 'The user has been nuked' });
     } else {
       res.status(404).json({ message: 'The user could not be found' });
     }
   })
   .catch(error => {
     console.log(error);
     res.status(500).json({
       message: 'Error removing the user',
     });
   });
});



//update by id
router.put("/:id", validateUserId, validateUser, (req, res) => {
  User.update(req.params.id, req.body)
    .then(user => {
      console.log(req);
      if (req.user.name !== req.body.name) {
        res.status(200).json({
          status: `Users' name ${
            req.user.name ? req.user.name : req.body.name
          } was updated to ${req.body.name}`,
          oldName: req.user.name,
          newName: req.body.name
        });
      } else {
        res.status(200).json({
          status: `Users' name ${req.user.name} was unchanged`,
          oldName: req.user.name,
          newName: req.body.name
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "Error updating user" });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  User.getById(req.params.id)
     .then(user => {
       if (user) {
         req.user = user;
         next();
       } else {
         res.status(400).json({ message: "invalid user id" });
       }
     })
     .catch(err => {
       console.log(err);
       res.status(500).json({ message: "There was an error" });
     });
}

function validateUser(req, res, next) {
  if (req.body) {
    if (req.body.name) {
      next();
    } else {
      res.status(400).json({ message: "Missing name" });
    }
  } else {
    res.status(400).json({ message: "Missing user data" });
  }
}

function validatePost(req, res, next) {
  if (req.body) {
    if (req.body.text) {
      next();
    } else {
      res.status(400).json({ message: "Missing required text field" });
    }
  } else {
    res.status(400).json({ message: "Missing post data" });
    
  }
}

module.exports = router;
