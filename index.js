const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const {v4: uuidv4} = require('uuid')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}))

let users = [];

class User {
    constructor(_id, username) {
        this._id = _id;
        this.username = username;
    }
}

class Exercise extends User { 
    constructor(description, duration, date) {
      super();
        this.description = description;
        this.duration = duration;
        this.date = date
    }
}

class NewExercise {
  constructor(username, description, duration, date, _id) {
      this.username = username;
      this.description = description;
      this.duration = duration;
      this.date = date;
      this._id = _id;
  }
}


class Log{
  constructor(user, count) { 
    this._id = user._id; 
    this.username = user.username; 
    this.count = count; 
    this.log = user.exercises
  }
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')

});

app.post("/api/users", (req, res) => {
    const username = req.body.username;
    const _id = uuidv4();
    const user = new User(_id, username);
    users.push(user);
    res.json(user)
});

app.get("/api/users", (req, res) => {
    res.send(users)
})


app.post("/api/users/:_id/exercises", (req, res) => {
  const id = req.params._id;
  const description = req.body.description;
  const duration = req.body.duration;
  let date = req.body.date;
  
  const user = users.find(user => user._id === id);
  
  if (!user) {
      return res.status(404).send("User Not Found");
  }
  
  const username = user.username;
  
  if (!date) {
      date = new Date().toISOString().split('T')[0];
  }
  
  const exercise = new Exercise(description, duration, date);
  
  if (!user.exercises) {
      user.exercises = [];
  }
  
  user.exercises.push(exercise);
  
  const newExercise = new NewExercise(username, description, duration, date, id);
  
  res.json(newExercise);
  
  console.log("Exercise added!");
});


app.post("/api/users/:_id/exercises", (req, res) => {
  const id = req.params._id;
  const { description, duration, date } = req.body;
  
  const user = users.find(user => user._id === id);
  
  if (!user) {
      return res.status(404).send("User Not Found");
  }
  
  const exercise = new Exercise(description, duration, date);
 
  if (!user.logs) { 
    user.logs = []; 
  }

  user.exercises.push(exercise);
  
  res.json({
      _id: user._id,
      username: user.username,
      exercises: user.exercises
  });
  
  console.log("Exercise added!");
});

app.get("/api/users/:_id/logs",(req,res)=>{
  const id = req.params._id;

  const user = users.find(user => user._id === id)

  if(!user)
    return res.status(404).send("User Not Found")
       
  const count = user.exercises.length

  const log = new Log(user , count)
  
  res.json(log)
})

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})