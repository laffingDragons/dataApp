var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//calling mongoose module
var mongoose = require('mongoose');

app.use(bodyParser.json({limit: '10mb',extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb',extended: true}));

var dbPath = "mongodb://localhost/myblogapp";
//command to connect with database
db = mongoose.connect(dbPath);

mongoose.connection.once('open', function () {
    
    console.log("Database Connection open successfully");
});

//include the model file

var Blog = require('./blogModel.js');

var blogModel = mongoose.model('Blog');
//ends include

//here are the routes
app.get('/', function (req, res) {
    res.send('This is a BLog Application')
});

////// lets write code here for the routes//////

//start route to GEt allblogs
app.get('/blogs', function (req, res) {

    blogModel.find(function (err, result) {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
        }
    }); // end user model find
});

//to get single blog
app.get('/blogs/:id', function (req, res) {
    blogModel.findOne({
        '_id': req.params.id
    }, function (err, result) {
        if (err) {
            console.log("some Error");
            res.send(err);
        } else {
            res.send(result);
        }
    }); //end user model find
}); // end route to get a particular blog

//to create a blog
app.post('/blog/create', function (req, res) {
    var newBlog = new blogModel({
        title: req.body.title,
        subTitle: req.body.subTitle,
        blogBody: req.body.blogBody
    }); //end newBlog

    //lets set the date of creation
    var today = Date.now();
    newBlog.created = today;

    //lets set the tags into array
    var allTags = (req.body.allTags != undefined && req.body.allTags != null) ? req.body.allTags.split(',') : '';
    newBlog.tags = allTags;

    //lets set the author information
    var authorInfo = {
        fullName: req.body.authorFullName,
        email: req.body.authorEmail
    };
    newBlog.authorInfo = authorInfo;

    // now lets save the file
    newBlog.save(function (error) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            res.send(error);
        }
    }); //end new blog save

}); // 

//start route to edit a blog using _id

app.put('/blogs/:id/edit', function(req, res) {

    var update = req.body;

    blogModel.findOneAndUpdate({'_id': req.params.id}, update, function (err, result) {

        if (err) {
            console.log("some Error");
            res.send(err);
        } else {
            res.send(result);
        }
    }); //end user model find
});

//start the route to delete a blog
app.post('/blogs/:id/delete',function(req, res){
    
    blogModel.remove({'_id':req.params.id},function(err, result){
        if(err){
           console.log("some Error");
           res.send(err);
       }
       else{
           res.send(result);
       }
    });//end user model find
});

//
app.listen(3000, function(){
    console.log('Listening on Port 3000');
});