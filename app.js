require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();
mongoose.set("strictQuery", false);

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
   secret: "Our little secret.",
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/blogsDB");

const articleSchema = new mongoose.Schema({
   title: String,
   content: String
});
const Article = mongoose.model("Article", articleSchema);

const userSchema = new mongoose.Schema({
   email: String,
   password: String,
   posts: articleSchema,
   googleId: String
});
userSchema.plugin(findOrCreate);
const User = mongoose.model("User", userSchema);

passport.serializeUser(function(user, done) {
   done(null, user.id); 
});

passport.deserializeUser(function(id, done) {
   User.findById(id, function(err, user) {
      done(err, user);
   });
});

passport.use(new GoogleStrategy({
   clientID: process.env.CLIENT_ID,
   clientSecret: process.env.CLIENT_SECRET,
   callbackURL: process.env.CALLBACK_URL
 },
 function(accessToken, refreshToken, profile, cb) {
   User.findOrCreate({ googleId: profile.id }, function (err, user) {
     return cb(err, user);
   });
 }
));

app.get("/", function(req, res) {
   res.send("Welcome!!");
});

app.get("/auth/google", passport.authenticate("google", {scope: ["profile"]}));

app.get("/auth/google/" + process.env.CALLBACK_ROUTE, passport.authenticate('google', { failureRedirect: '/fail' }), function(req, res) {
   res.redirect("/articles");
});

app.get("/fail", function(req, res) {
   res.sendStatus(401);
});

app.route("/articles")
   .get(function(req, res) {
      Article.find({}, function(err, foundArticles) {
         if (err) {
            res.send(err);
         }
         else {
            res.send(foundArticles);
         }
      });
   })
   .post(function(req, res) {
      const article = new Article({
         title: req.body.title,
         content: req.body.content
      });
      article.save(function(err) {
         if (err) {
            res.send(err);
         }
         else {
            res.send("Article added successfully!");
         }
      });
   })
   .delete(function(req, res) {
      Article.deleteMany({}, function(err) {
         if (err) {
            res.send(err);
         }
         else {
            res.send("All the articles have been deleted successfully!");
         }
      });
   });

app.route("/articles/:articleTitle")
   .get(function(req, res) {
      Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
         if (err) {
            res.send(err);
         }
         else {
            if (foundArticle) {
                  res.send(foundArticle);
            }
            else {
               res.send("No article with the given title was found!");
            }
         }
      });
   })
   .put(function(req, res) {
      Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
         if (err) {
            res.send(err);
         }
         else {
            if (foundArticle) {
                  Article.replaceOne(
                     {title: req.params.articleTitle},
                     {
                        title: req.body.title,
                        content: req.body.content
                     },
                     function(err, response) {
                        if (err) {
                           res.send(err);
                        }
                        else {
                           res.send("Article has been updated successfully!");
                        }
                     });
            }
            else {
               res.send("No article with the given title was found!");
            }
         }
      });
   })
   .patch(function(req, res) {
      Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
         if (err) {
            res.send(err);
         }
         else {
            if (foundArticle) {
                  Article.updateOne(
                     {title: req.params.articleTitle},
                     {$set: req.body},
                     function(err, result) {
                        if (err) {
                           res.send(err);
                        }
                        else {
                           res.send("Article has been updated successfully!");
                        }
                     }
                  );
            }
            else {
               res.send("No article with the given title was found!");
            }
         }
      });
   })
   .delete(function(req, res) {
      Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
         if (err) {
            res.send(err);
         }
         else {
            if (foundArticle) {
                  Article.deleteOne({title: req.params.articleTitle}, function(err) {
                     if (err) {
                        res.send(err);
                     }
                     else {
                        res.send("article has been deleted successfully!");
                     }
                  });
            }
            else {
               res.send("No article with the given title was found!");
            }
         }
      });
   });

app.listen(3000, function() {
   console.log("Server has started at port 3000.");
});