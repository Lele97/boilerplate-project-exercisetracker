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

class Exercize extends User {
    constructor(description, duration, date) {
        super();
        this.description = description;
        this.duration = duration;
        this.date = date
    }
}

class Log extends Exercize{
  constructor(count){
    super()
    this.count = count
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
    const user = users.find(user => user._id === id)
    
    if(!user)
      return res.status(404).send("User Not Found")

    const username = user.username
    
    if (!date) {
        date = new Date().toISOString().split('T')[0];
    }

    const exercise = new Exercize(description, duration, date)

    if (!user.exercises) {
        user.exercises = [];
    }

    user.exercises.push(exercise)


    res.json({  
      username: username,
      description: description,
      duration: duration,
      date: date,
    _id:id})
})

app.get("/api/users/:_id/logs",(req,res)=>{
  const id = req.params._id;

  const user = users.find(user => user._id === id)

  if(!user)
    return res.status(404).send("User Not Found")
       
  const count = user.exercises.length
  console.log("OK")
})

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})