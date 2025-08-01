if(process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const reviewRouter = require('./routes/review.js');
const listingRouter = require("./routes/listing.js");
const userRouter = require('./routes/user.js');
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));

const dbUrl = process.env.ATLASDB_URL;
main().then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log(err);
});

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));



const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24 * 3600,
});

store.on("error", function (e) {
  console.log("Session Store Error", e);  
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true,
  }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
})

app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);

//Error Handling Middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message })
})


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
