const express  =require('express');
const path = require('path');
// const moment = require('moment');
const fs = require('fs');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

// const request = require('request-promise');


const userModel = require('./models/user.js');

const app = express(); // express initialization
app.use(express.urlencoded( {extended : true}));
app.use(express.json());  //middleware for json payload parsing


require('dotenv').config();


app.engine('handlebars', exphbs());//add a new template/view engine to the app(express object),default layout is set to main(act as  a wrapper for other layouts)
app.set('view engine', 'handlebars');//set template engine to handlebars for rendering files ending with .handlebars


mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser : true,useUnifiedTopology: true})
    .then(() => console.log('Mongo DB connected'))
    .catch((err) => console.log(err));

app.get('/home',(req,res) => {
    res.render('index');
});
app.get('/product',(req,res) => {
    res.render('product');
});
// app.get('/single',(req,res) => {
//     res.render('single');
// });
app.get('/about',(req,res) => {
    res.render('about');
});
app.get('/contact',(req,res) => {
    res.render('contact');
});
app.get('/services',(req,res) => {
    res.render('services');
});
app.get('/profile',async (req,res) => {
    const user = await userModel.findOne({username : 'vipin'});
    res.render('profile',{username:user.username, myntraCoin:user.myntraCoin});
});
app.get('/recycle',(req,res) => {
    res.render('recycle');
});
// app.post('/submitImage', (req,res) => {
//     console.log(req.body);

    // const options = {
    //     uri : `https://hotel--backend.herokuapp.com/check-room-available?roomType=${roomType}&startDate=${Date.parse(d1)}&endDate=${Date.parse(d2)}&roomNeeded=${roomNeeded}`,
    //     json: true,
    //     resolveWithFullResponse: true,
    //     method: 'GET',
    //     headers : {
    //     }
    // }

    // let response;
    //     try{
    //         response = await request(options)
    //     }
    //     catch(err){
    //         console.log(err);
    //     }
// });
//Note index file of static is not rendered bcz the res.render('index') part is above of static implementation

// using static files
app.use(express.static(path.join(__dirname,"public")));
const PORT = process.env.PORT || 3000;
app.listen(PORT,() => console.log('listening on port '+ PORT));