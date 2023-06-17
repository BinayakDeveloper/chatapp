// Account Operations

const { signup } = require("./Account Operations/usersignup");
const { signin } = require("./Account Operations/userlogin");
const {
  forgotPassGenLink,
  tokenValidate,
  updatePass,
} = require("./Account Operations/forgotPass");
const { isLogin, isLogout } = require("./Account Operations/authentication");
const { dashboardAuth } = require("./Account Operations/dashboard");

// Module Exports

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const socket = require("socket.io")(server);
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const cookie = require("cookie-parser");

const publicPath = path.join(__dirname, "public");

// Middlewares
app.use(
  session({
    secret: "secret",
    saveUninitialized: false,
    resave: false,
  })
);
app.use(cookie());
app.use(flash());
app.use(express.json());
app.set("views engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(publicPath + "/EJS"));
app.use(express.static(publicPath + "/CSS"));
app.use(express.static(publicPath + "/JS"));

// Routes

// Get Requests

app.get("/", isLogout, (req, res) => {
  res.render(publicPath + "/EJS/login.ejs", {
    invalidLoginDetails: req.flash("invalidLoginDetails"),
  });
});

app.get("/register", isLogout, (req, res) => {
  res.render(publicPath + "/EJS/register.ejs", {
    sameuser: req.flash("sameuser"),
  });
});

app.get("/forgot", isLogout, (req, res) => {
  res.render(publicPath + "/EJS/forgot.ejs", {
    invalidUser: req.flash("invalidUser"),
  });
});

app.get("/forgot/:id/:token", isLogout, (req, res) => {
  tokenValidate(req, res);
});

app.get("/dashboard", isLogin, (req, res) => {
  res.redirect("/dashboard/:uid/:name");
});

app.get("/dashboard/:uid", isLogin, (req, res) => {
  res.redirect("/dashboard/:uid/:name");
});

app.get("/dashboard/:uid/:name", isLogin, (req, res) => {
  dashboardAuth(req, res);
});

app.get("/logout", isLogin, (req, res) => {
  res.cookie("login", undefined, {
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

app.get("*", isLogin, (req, res) => {
  res.redirect("/dashboard/:uid/:name");
});

// Post Requests

app.post("/login", (req, res) => {
  signin(req, res);
});

app.post("/register", (req, res) => {
  signup(req, res);
});

app.post("/forgotPass", (req, res) => {
  forgotPassGenLink(req, res);
});

app.post("/updatePass/:id/:token", (req, res) => {
  updatePass(req, res);
});
server.listen(500);
