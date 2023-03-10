const router = require("express").Router();
const { User, Post } = require("../models");
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
module.exports = router;
