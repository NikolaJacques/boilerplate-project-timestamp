// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// solution
/* app.get("/api/:date?", (req, res) => {
    try {
      res.json({date: req.params.date})
    }
    catch {
      res.json({error: "No date param"});
    }
}); */
app.get("/api/:date?", 
(req, res, next) => {
  try {
    let date;
    if (!req.params.date) {
      date = new Date();
    } else {
      date = new Date(req.params.date);
      if (isNaN(date.getTime())) date = new Date(parseInt(req.params.date));
    };
    if (isNaN(date.getTime())) throw new Error()
    req.date = date;
    next();
  }
  catch (e) {
    res.json({error: "Invalid Date"});
  }
},
(req, res, next) => {
  try {
    if (isNaN(req.date.getTime())) req.date = new Date(parseInt(req.params.date));
    next();
  }
  catch {
    res.json({error: "Error date string to integer"})
  }
},
(req, res, next) => {
    try{
      req.utc = req.date.toUTCString();
      req.unix = parseInt(req.date.getTime());
      next();
    }
    catch {
      res.json({error: "Date value conversion error"})
    }
},
(req, res) => {
  res.json({
    unix: req.unix,
    utc: req.utc
  })
})