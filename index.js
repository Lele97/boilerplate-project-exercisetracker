const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

let users = [];

class User {
    constructor(_id, username) {
        this._id = _id;
        this.username = username;
        this.exercises = [];
    }
}

class Exercise {
    constructor(description, duration, date) {
        this.description = description;
        this.duration = new Number(duration);
        this.date = date ? new Date(date).toDateString() : new Date().toDateString();
    }
}

class NewExercise extends Exercise {
    constructor(username, description, duration, date, _id) {
        super(description, duration, date);
        this.username = username;
        this._id = _id;
    }
}

class Log {
    constructor(user, count) {
        this._id = user._id;
        this.username = user.username;
        this.count = count;
        this.log = user.exercises;
    }
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.post("/api/users", (req, res) => {

    const username = req.body.username;
    const _id = uuidv4();
    const user = new User(_id, username);

    users.push(user);

    res.json(user);
});

app.get("/api/users", (req, res) => {
    res.json(users);
});

app.post("/api/users/:_id/exercises", (req, res) => {

    const id = req.params._id;
    const { description, duration, date } = req.body;
    const user = users.find(user => user._id === id);

    if (!user) {
        return res.status(404).send("User Not Found");
    }

    const exercise = new Exercise(description, duration, date);

    user.exercises.push(exercise);

    const newExercise = new NewExercise(user.username, description, duration, exercise.date, id);

    res.json(newExercise);
});

app.get("/api/users/:_id/logs", (req, res) => {

    let {from , to , limit} = req.query;
    let queryParam = false
    const id = req.params._id;
    const user = users.find(user => user._id === id);

    if (!user) {
        return res.status(404).send("User Not Found");
    }

    let arrayfilter = user.exercises.slice();
   
    if(from){
        arrayfilter = arrayfilter.filter(exercise=> new Date(exercise.date) >= new Date(from))
        queryParam = true
    }
       
    if(to){
        arrayfilter = arrayfilter.filter(exercise=> new Date(exercise.date) <= new Date(to))
        queryParam = true
    }
      
    if(limit){
        arrayfilter = arrayfilter.slice(0,parseInt(limit))
        queryParam = true
    }
    
    let count = arrayfilter.length
    let count_ = user.exercises.length

    if(queryParam){
        const log = {
             _id: user._id,
              username: user.username,
               count: count,
            log: arrayfilter 
            }; 
            res.json(log)
    }
    else{
        const log = new Log(user, count_);
        res.json(log);
    }   
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});
