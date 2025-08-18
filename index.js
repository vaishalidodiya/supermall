require("dotenv").config();
const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const session = require("express-session");
const morgan = require('morgan');

require("./config/database");

app.use(morgan('combined'));
app.use(
  session({
    secret: "secretpassword",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.set("Surrogate-Control", "no-store");
  next();
});

app.set("view engine", "hbs");

const template_path = path.join(__dirname, "./views");
const partials_path = path.join(__dirname, "./views/partials");

app.set("views", template_path);
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(partials_path);



const routes = require("./routes");
app.use("/", routes);

const port = 5100;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log("Views directory:", app.get("views"));
});
