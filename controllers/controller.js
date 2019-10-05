var express = require("express");
var router = express.Router();
// var article = require("../models/Article.js");
var db = require("../models");

router.get("/", function(req, res) {
db.Article.find({})
    .then(function(dbArticle) {
        
      // If we were able to successfully find Articles, send them back to the client
      console.log(dbArticle);
      res.render("index", {articles: dbArticle});
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

router.get("/saved", function(req, res) {
    db.Article.find({})
        .then(function(dbArticle) {
            
          // If we were able to successfully find Articles, send them back to the client
          console.log(dbArticle);
          res.render("saved", {articles: dbArticle});
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
    });
module.exports = router;