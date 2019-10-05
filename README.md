# Kicks Scraper



I created this for a homework assignment for my Coding bootcamp at Georgia Tech.  It utilizes JavaSript, jQuery, Bootstrap, MongoDB, Handlebars, Cheerio and Axios.  The App reaches out via an URL and scrapes the site for specific data points and then inserts them to the Mongo DB.  Once the data is in the database it will render the scraped kicks to the home page.  If you click on the saved button it will save the kicks so you can view them later.  It also give you the ability to add notes to the Kicks by clicking on the name.

[Live DEMO hosted on Heroku](https://arcane-mesa-12871.herokuapp.com/ "Live DEMO")  


![IMG1](https://github.com/doingway2much/Bootstrap-Portfolio/blob/master/assets/img/KS.jpg?raw=true)

Techknowlogies:
* JavaScript
* jQuery
* Mongo DB
* Node.js
* Handlebars
* Express
* Cheerios
* Axios


Usage:

"Scrape Kicks!!!!" button:
This will reach out to a site via API and pull down Kicks if they are already not in the DB.  It checks to make sure there aren’t duplicate names.

"View Scraped kicks" button: 
This will look at all the items in the DB that have a value of one for the saved class.  It will them only render the Kicks that you have saved.  

"Kicks Name": 
If you click on any of the Kicks names it will pop up a Modal that you can add notes on each sneaker and save them to the DB.
 
