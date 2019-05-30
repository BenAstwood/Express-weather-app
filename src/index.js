const path = require("path");
const hbs = require("hbs");

const express = require("express");
const app = express();

// Utility functions.
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

// Define paths for Express config.
const publicPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location.
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve.
app.use(express.static(publicPath));

app.get("", (req, res) => {
  res.render("index", { title: "new header" });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.render("weather", {
      title: "Weather",
      address: "",
      error: "Please submit an address"
    });
  }

  geocode(req.query.address, (err, geocodeRes = {}) => {
    if (err) {
      return res.render("weather", {
        title: "Weather",
        address: "Not found",
        error: err
      });
    }

    forecast(geocodeRes.long, geocodeRes.lat, (err, forcastRes = {}) => {
      if (err) {
        return res.render("weather", {
          title: "Weather",
          address: "Not found",
          error: err
        });
      }

      const {
        summary,
        temperature,
        precipProbability
      } = forcastRes.body.currently;

      res.render("weather", {
        title: "Weather",
        address: geocodeRes.location,
        forecast: `Weather is ${summary}. It is currently ${temperature} degrees out. With a ${precipProbability}% chance of rain.`
      });
    });
  });
});

app.get("*", (req, res) => {
  res.render("404", { title: `"${req.params[0]}" not found` });
});

app.listen(3000, () => {
  console.log("server up and running");
});
