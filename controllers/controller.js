var express = require("express");
var router = express.Router();
// var scraperApp = require("../public/app.js");

router.get("/", function(req, res) {
    // burger.all(function(data) {
    //     var burgersData = {
    //     burgers: data
    // };
    // console.log(burgersData);
    res.render("index");
    });
// });

module.exports = router;