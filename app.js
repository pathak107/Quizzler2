require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('./Database/database.db',(err)=>{
    if(err) console.log(err);
    console.log("Connected to database");
})

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

//Session initialiazation
app.use(session({
    secret: "itsasecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


var numQues;
db.get('select count(*) as numQues from question;',(err,row)=>{
    if(err) throw err;
    numQues = row.numQues;
    console.log(numQues);
})
// connection.query('Select count(*) as numQues from question;', (error, results) => {
//     if (error) throw error;
//     numQues = results[0].numQues;
//     console.log(numQues);
// });

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
        var query1 = 'select user_id,userPassword from user where userName =?;';
        db.get(query1, [req.body.userName], (error, results) => {
            if (results == undefined)
                res.render('login.ejs', { loginStatus: "Wrong Email or Password. Try Again! " });

            else if(error) throw error;

            else {
                bcrypt.compare(req.body.password, results.userPassword, function (err, result) {
                    // result == true
                    if (result == true) {
                        console.log('Authenticated successfully');
                        console.log(results.user_id);
                        req.session.user_id = results.user_id;
                        res.redirect('/Gameplay');
                    }
                    else {
                        res.render('login.ejs', { loginStatus: "Wrong Email or Password. Try Again! " });
                    }
                });
            }



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
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            // Store hash in your password DB.
            if (err) throw err;
            var query1 = 'insert into user (userName,userPassword) values (?,?);';
            db.run(query1, [req.body.userName, hash], (error) => {
                if (error) throw error;
                console.log('Value inserted successfuly');
            });
            db.get('SELECT count(*) as uid from user', function (error, results) {
                if (error) throw error;
                req.session.user_id = results.uid;
                console.log("User id is " + req.session.user_id);
                res.redirect('/Gameplay');
            });
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
            db.get(query2, [req.session.user_id], (error, results) => {
                if (error) throw error;
                console.log("Score is" + (results.userLevel-1) * 10);
                res.render('gameplay.ejs', { Score: ((results.userLevel - 1) * 10), Question: results.question });  //Rendering question and score

            });
        }
    })
    .post((req, res) => {
        var query1 = 'select answer,userLevel from user natural join question where userLevel=qid and user_id =?;';    //selects correct answer
        db.get(query1, [req.session.user_id], (error, results1) => {
            if (error) throw error;
            console.log(results1);
            if (results1.answer === req.body.answer && results1.userLevel < numQues) {
                var query3 = 'UPDATE user SET userLevel=userLevel+1 WHERE user_id=?;';
                db.run(query3, [req.session.user_id], (error) => {     //if answer is correct it updates score and level
                    if (error) console.log(error);
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
            db.get(query1, [req.session.user_id], (err, row) => {
                userScore = (row.userLevel -1) * 10;
            });

            var query2 = 'select userName,userLevel from user;';
            db.all(query2, (err, results) => {
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