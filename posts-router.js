const express = require('express');

const Actions = require('./data/db.js');

const router = express.Router();

router.use(express.json());

router.post('/', (req, res) => {
  const { title, contents } = req.body; 
  if (!title || !contents) {
    res.status(400).json({ errorMessage: 'Please provide title and contents for the post.'})
    } else {
      Actions.insert(req.body) 
      .then(result => {
        res.status(201).json(result);
      })
      .catch(error => {
        res.status(500).json(error);
      })
  }
})

router.post('/:id/comments', (req, res) => {
  const comment = {'post_id': req.params.id, 'text': req.body.text}
  if (!req.body.text) {
    res.status(400).json({ errorMessage: 'Please provide text for the comment.' });
  } else {
    Actions.insertComment(comment)
      .then(result => {
        res.status(201).json(result);
      })
      .catch(error => {
        console.log(error)
        res.status(500).json(error);
      });
  }
})

router.get('/', async (req, res) => {
  try {
    const posts = await Actions.find();
    res.status(200).json(posts);
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: 'The posts information could not be retrieved.',
    });
  }
});

router.get('/:id', async (req, res) => {
  console.log(`hit /:id with ${req.params.id}`);
  Actions.findById(req.params.id)
  .then(post => {
    if (post && post.length) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'The post with the specified ID does not exist.' });
    }
  }) .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: 'The post information could not be retrieved',
    });
  })
});

router.get('/:id/comments', async (req, res) => {
  console.log(`hit /:id with ${req.params.id}`);
  Actions.findPostComments(req.params.id)
  .then(comments => {
    if (comments && comments.length) {
      res.status(200).json(comments);
    } else {
      res.status(404).json({ message: 'The post with the specified ID does not exist.' });
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      error: 'The comments information could not be retrieved',
    });
  })
});

router.delete('/:id', async (req, res) => {
  try {
    const count = await Actions.remove(req.params.id);
    if (count > 0) {
      res.status(200).json({ message: 'The post has been deleted.' });
    } else {
      res.status(404).json({ message: 'The post with the specified ID does not exist.' });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'The post could not be removed',
    });
  }
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const post  = req.body;

  if (!req.body.title || !req.body.contents) {
    res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' });
  } else {
    try{
      const count = Actions.update(id, post);
      console.log(count)

      if (count.id > 0) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ message: 'The post with the specified ID does not exist.' });
      }
    }
    catch (error) {
      res.status(500).json(error);
    }
    
    // .then(post => {
    //   if (count > 0) {
    //     res.status(200).json(post);
    //   } else {
    //     res.status(404).json({ message: 'The post with the specified ID does not exist.' });
    //   }
    // })

  }
})


module.exports = router;

