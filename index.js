const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true}))

let users  = [];
class User {
    constructor(_id, username) {
        this._id = _id;
        this.username = username;
    }}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
   
});

app.post("/api/users", (req, res) => {
    const username = req.body.username;
    const _id = uuidv4();
    const user = new User(_id, username);
    users.push(user);
    console.log(users);
    res.redirect("/")
});

app.get("/api/users", (req,res)=>{
    res.send(users)
})

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})