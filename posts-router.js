const express = require('express');

const Actions = require('./data/db.js');

const router = express.Router();

router.use(express.json());

router.post('/', (req, res) => {
  const { title, contents } = req.body; 
  if (!title || !contents) {
    res.status(400).json({
      success: false,
      errorMessage: 'Please provide title and contents for the post.'
    })
    } else {
      Actions.insert(req.body) 
      .then(result => {
        res.status(201).json({
          success: true, 
          post: req.body
        });
      })
      .catch(error => {
        res.status(500).json({
          success: false,
          error: error
        });
      })
  }
})

router.post('/:id/comments', (req, res) => {
  const comment = {'post_id': req.params.id, 'text': req.body.text}
  if (!req.body.text) {
    res.status(400).json({
      success: false,
      errorMessage: 'Please provide text for the comment.'
    });
  } else {
    Actions.insertComment(comment)
      .then(result => {
        comment.comment_id = result.id;
        res.status(201).json({
          success: true,
          result: comment
        });
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({
          success: false,
          error: error
        });
      });
  }
})

router.get('/', async (req, res) => {
  try {
    const posts = await Actions.find();
    res.status(200).json({
      success: true,
      posts: posts
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: 'The posts information could not be retrieved.'
    });
  }
});

router.get('/:id', async (req, res) => {
  Actions.findById(req.params.id)
  .then(post => {
    if (post && post.length) {
      res.status(200).json({
        success: true, 
        post: post
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'The post with the specified ID does not exist.'
      });
    }
  }) .catch(error => {
    console.log(error);
    res.status(500).json({
      success: false,
      error: 'The post information could not be retrieved'
    });
  })
});

router.get('/:id/comments', async (req, res) => {
  Actions.findPostComments(req.params.id)
  .then(comments => {
    if (comments && comments.length) {
      res.status(200).json({
        success: true,
        comments: comments
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'The post with the specified ID does not exist.'
      });
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      success: false,
      error: 'The comments information could not be retrieved',
    });
  })
});

router.delete('/:id', async (req, res) => {
  Actions.findById(req.params.id)
  .then(post => {
    if (!post && !post.length) {
      res.status(404).json({ 
        success: false, 
        message: 'The post with the specified ID does not exist.' 
      });
      return;
    }
    Actions.remove(req.params.id)
    .then(count => {
      console.log(post, count)
      res.status(200).json({ 
        success: true, 
        post: post, 
        message: 'The post has been deleted.' 
      });
    }) .catch(error => {
        console.log(error);
        res.status(500).json({
          success: false,
          message: 'The post could not be removed',
        });
  })
})
})

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const post  = req.body;

  if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      success: false,
      errorMessage: 'Please provide title and contents for the post.'
    });
  } else {
      Actions.update(id, post)
      .then(count => {
        if (count === 0) {
          res.status(404).json({ 
            success: false, 
            message: 'The post with the specified ID does not exist.' 
          });
        }
        res.status(200).json({
          success: true, 
          post: post
        });
      })
      .catch(error => {
        console.log(error)
        res.status(500).json(error);
      })
    }
})

module.exports = router;