const express  =require('express');
const path = require('path');
// const moment = require('moment');
const fs = require('fs');
const exphbs = require('express-handlebars');

const app = express(); // express initialization

app.engine('handlebars', exphbs());//add a new template/view engine to the app(express object),default layout is set to main(act as  a wrapper for other layouts)
app.set('view engine', 'handlebars');//set template engine to handlebars for rendering files ending with .handlebars
//if html is used as a engine then it will render files engin with .html

//we will use express.json for parsing
app.use(express.json()); // body parser middleware initilization (to parse the body send in request)
app.use(express.urlencoded({extended: false})); // to handle url encoding
 
app.get('/home',(req,res) => {
    res.render('index');
});
app.get('/product',(req,res) => {
    res.render('product');
});
app.get('/single',(req,res) => {
    res.render('single');
});
app.get('/about',(req,res) => {
    res.render('about');
});
app.get('/contact',(req,res) => {
    res.render('contact');
});
app.get('/services',(req,res) => {
    res.render('services');
});
//Note index file of static is not rendered bcz the res.render('index') part is above of static implementation

// //using static files
app.use(express.static(path.join(__dirname,"public")));  //public dir is made static any page can be accessed like localhost:3000/about.html
// // it is used to handle static servers and no app.get if need to be mentioned


//  using ROUTER functionality  (calling backend js files on some routining)
// app.use('/api/members',require('./routes/api/members')); //we will require routes files for using /api/members
// for api/members file members.js wil run on backend side(server side)
// app.use('login',require('./routes/login'));
// app.use('/login',require('./routes/login'));

const PORT = process.env.PORT || 3000;
app.listen(PORT,() => console.log('listening on port '+ PORT));