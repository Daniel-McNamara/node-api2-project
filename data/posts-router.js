// imports express to run server
const express = require("express");

// imports Posts from db.js???????????????????????????????????????????????
const Posts = require("./db");

// sets up router
const router = express.Router();

// get list of posts
router.get("/", (req, res) => {
  Posts.find() // <----- How do I know what to put in here????????
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

// get post by id
router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then(post => {
      if (post.length !== 0) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

// get comments of a post
router.get("/:id/comments", (req, res) => {
  Posts.findById(req.params.id)
    .then(post => {
      if (post.length !== 0) {
        Posts.findPostComments(req.params.id)
          .then(comments => {
            res.status(200).json(comments);
          })
          .catch(error => {
            res.status(500).json({
              error: "The comments information could not be retrieved."
            });
          });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json(error);
    });
});

// posts post
router.post("/", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    Posts.insert(req.body)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
      });
  }
});

// post comment to a post
router.post("/:id/comments", (req, res) => {
  const comment = { ...req.body, post_id: req.params.id };
  if (!comment.text) {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  } else {
    Posts.findById(req.params.id)
      .then(post => {
        if (post.length !== 0) {
          Posts.insertComment(comment)
            .then(obj => {
              res.status(201).json({ ...comment, id: obj.id });
            })
            .catch(err => {
              res.status(500).json({
                error:
                  "There was an error while saving the comment to the database"
              });
            });
        } else {
          res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json(error);
      });
  }
});

// delete post
router.delete("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then(post => {
      if (post) {
        Posts.remove(req.params.id)
          .then(count => {
            if (count > 0) {
              res.status(200).json(post);
            } else {
              res.status(404).json({
                message: "The post with the specified ID does not exist."
              });
            }
          })
          .catch(error => {
            console.log(error);
            res.status(500).json({ error: "The post could not be removed" });
          });
      }
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

// edit post
router.put("/:id", (req, res) => {
  const changes = req.body;
  if (!changes.title || !changes.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    Posts.findById(req.params.id)
      .then(post => {
        if (post) {
          Posts.update(req.params.id, changes)
            .then(() => {
              res.status(200).json(changes);
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({
                error: "The post information could not be modified.",
                err
              });
            });
        } else {
          res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
        }
      })
      .catch(error => {
        console.log(error);
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      });
  }
});

// exports router ----- will be used in server.js
module.exports = router;