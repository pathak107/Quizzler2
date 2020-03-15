const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const connection = require('./Database/connection.js');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

//Session initialiazation
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


//Home Route
app.get('/', (req, res) => {
    res.render('index.ejs');
});



//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//Login Route
app.route('/Login')
    .get((req, res) => {
        res.render('login.ejs', { loginStatus: "Enter to Authenticate" });
    })
    .post((req, res) => {
        var query1 = 'select user_id from user where userName =? And userPassword =?;';
        connection.query(query1, [req.body.userName, req.body.password], (error, results, fields) => {
            if (results[0] == undefined)
                res.render('login.ejs', { loginStatus: "Wrong Email or Password. Try Again! " });

            else if (results[0].user_id) {
                console.log('Authenticated successfully');
                console.log(results[0].user_id);
                req.session.user_id = results[0].user_id;
                res.redirect('/Gameplay');
            }
            else throw error;

        });
    });
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//Register Route
app.route('/Register')
    .get((req, res) => {
        res.render('register.ejs');
    })
    .post((req, res) => {
        var query1 = 'insert into user (userName,userPassword) values (?,?);';
        connection.query(query1, [req.body.userName, req.body.password], (error, results, fields) => {
            if (error) throw error;
            console.log('Value inserted successfuly');
        });
        connection.query('SELECT count(*) as uid from user', function (error, results, fields) {
            if (error) throw error;
            req.session.user_id = results[0].uid;
            console.log("User id is " + req.session.user_id);
            res.redirect('/Gameplay');
        });
    });
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//Gameplay Route
app.route('/Gameplay')
    .get((req, res) => {
        if (req.session.user_id == null)
            res.redirect('/Login');
        else {

            var query1 = 'select userName from user where user_id =? AND userLevel >(select count(*) from question);';
            connection.query(query1, [req.session.user_id], (error, results, fields) => {
                if (error) throw error;
                else if (results[0]) {
                    console.log(results[0]);
                    res.redirect('/Gameover');
                }
                else {
                    var query2 = 'select question,userScore from user natural join question where userLevel=qid and user_id =?;';
                    connection.query(query2, [req.session.user_id], (error, results, fields) => {
                        if (error) throw error;
                        console.log("Score is" + results[0].userScore);
                        res.render('gameplay.ejs', { Score: results[0].userScore, Question: results[0].question });

                    });
                }

            });




        }
    })
    .post((req, res) => {
        var query1 = 'select answer from user natural join question where userLevel=qid and user_id =?;';
        connection.query(query1, [req.session.user_id], (error, results, fields) => {
            if (error) throw error;
            if (results[0].answer === req.body.answer) {
                var query2 = 'UPDATE user SET userScore = userScore+1, userLevel=userLevel+1 WHERE user_id=?;';
                connection.query(query2, [req.session.user_id], (error, results, fields) => {
                    if (error) throw error;
                });
                res.redirect('/Gameplay');
            }
            else
                res.redirect('/Gameover');



        });
    });


//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx








//Listening to port
var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server started at port " + port);
});