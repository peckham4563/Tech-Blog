const router = require("express").Router();
const { User, Post } = require("../models");
const auth = require('../utils/auth');

// Route for displaying a single post
router.get('/post/:id', async (req, res) => {
  try {
    // Retrieve the post with the specified ID from the database
    const postData = await Post.findByPk(req.params.id);

    // Render the single-post template with the post data
    res.render('single-post', {
      postData: postData.get({ plain: true })
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/", (req, res) => {
  Post.findAll({
    include: [User]
  }).then((postData) => {
    const posts = postData.map((post) => post.get({ plain: true }));
    res.render("homepage", {
      posts,
      logged_in: req.session.logged_in,
    });
  });
});
// Login route
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.logged_in = true;
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const userData = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.logged_in = true;
      res.json({ user: userData, message: 'You are now signed up and logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});


module.exports = router;
