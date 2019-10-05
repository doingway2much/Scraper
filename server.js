var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/nyTimesTech", { useNewUrlParser: true });
mongoose.connect("mongodb://localhost/kicks_DB", { useNewUrlParser: true });

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  // axios.get("https://www.nytimes.com/section/technology").then(function(response) {
    axios.get("https://sneakernews.com/release-dates/").then(function(response) {
    
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $(".releases-box").each(function(i, element) {
      // Save an empty result object
      
      var result = {};
    
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children(".content-box")
        .children("h2")
        .children("a")
        .text();
   
      result.link = $(this)
        .children('.image-box')
        .children("a")
        .attr("href");
  
      result.img = $(this)
        .children('.image-box')
        .children("a")
        .children("img")
        .attr("src");
      
      result.date = $(this)
        .children(".content-box")
        .children(".release-date-and-rating")
        .children(".release-date")
        .text().trim();
      
      console.log(result);
    

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.delete("/notes/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.deleteOne(req.body)
    .then(function(dbNote) {
      return db.Article.findByIdAndRemove({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.delete("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Article.deleteOne(req.body)
    .then(function(dbArticle) {
      return db.Article.findByIdAndRemove({ _id: dbArticle._id });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.put("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Article.update(req.body)
    .then(function(dbArticle) {
      console.log(dbArticle);
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Import routes and give the server access to them.
var routes = require("./controllers/controller.js");

app.use(routes);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
