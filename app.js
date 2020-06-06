var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");
var passport = require("passport");
var localStrategy = require("passport-local");
var methodOverride = require("method-override");
var flash = require("connect-flash");

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

//seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(require("express-session")({
	secret: "SHINING LIKE A STAR",
	resave: false,
	saveUninitialized: false
}));
app.use(flash());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(methodOverride("_method"));


app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// Campground.create({
// 	name: "Granite Hill",
// 	image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
// 	description: "No bathroom, No water, Beautiful granite",
// }, function(err, campground){
// 	if(err){
// 		console.log(err);
// 	} else{
// 		console.log("Campground Created");
// 		console.log(campground);
// 	}
// });

// var campgrounds = [
// 	{name: "Hello", image: "https://www.tripsavvy.com/thmb/CyXuQJWabjrBCRBCVmP4TbBAOmA=/950x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/sunrise-camping--676019412-5b873a5a46e0fb0050f2b7e0.jpg"},
// 	{name: "Hi", image: "https://www.tripsavvy.com/thmb/CyXuQJWabjrBCRBCVmP4TbBAOmA=/950x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/sunrise-camping--676019412-5b873a5a46e0fb0050f2b7e0.jpg"},
// 	{name: "Hey", image: "https://www.tripsavvy.com/thmb/CyXuQJWabjrBCRBCVmP4TbBAOmA=/950x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/sunrise-camping--676019412-5b873a5a46e0fb0050f2b7e0.jpg"},
// ]




app.listen(3000, function(){
	console.log("YelpCamp has started");
});