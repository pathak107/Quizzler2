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


var numQues;
connection.query('Select count(*) as numQues from question;', (error, results) => {
    if (error) throw error;
    numQues = results[0].numQues;
    console.log(numQues);
});

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
            // Render question
            var query2 = 'select question,userLevel from user natural join question where userLevel=qid and user_id =?;';
            connection.query(query2, [req.session.user_id], (error, results, fields) => {
                if (error) throw error;
                console.log("Score is" + results[0].userLevel * 10);
                res.render('gameplay.ejs', { Score: ((results[0].userLevel - 1) * 10), Question: results[0].question });  //Rendering question and score

            });
        }
    })
    .post((req, res) => {
        var query1 = 'select answer,userLevel from user natural join question where userLevel=qid and user_id =?;';    //selects correct answer
        connection.query(query1, [req.session.user_id], (error, results1, fields) => {
            if (error) throw error;
            console.log(results1[0]);
            if (results1[0].answer === req.body.answer && results1[0].userLevel < numQues) {
                var query3 = 'UPDATE user SET userLevel=userLevel+1 WHERE user_id=?;';
                connection.query(query3, [req.session.user_id], (error, results3, fields) => {     //if answer is correct it updates score and level
                    if (error) throw error;
                    res.redirect('/Gameplay');
                });
            }
            else
                res.redirect('/Gameover');     // otherwise it sends to gameover route
        });
    });


//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx

app.route('/Gameover')
    .get((req, res) => {
        if (req.session.user_id == null)
            res.redirect('/Login');
        else {
            var userScore;
            var query1 = 'select userLevel from user where user_id=?';
            connection.query(query1, [req.session.user_id], (err, results) => {
                userScore = results[0].userLevel * 10;
            });

            var query2 = 'select userName,userLevel from user;';
            connection.query(query2, (err, results) => {
                if (err) throw err;
                res.render('gameover.ejs', { userScore: userScore, users: results });
            });
        }

    });






//Listening to port
var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server started at port " + port);
});