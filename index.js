require('dotenv').config();
const connectToMongo = require('./db');
const express = require('express');
const fs = require("fs");
var cors = require('cors');


connectToMongo();

const app = express();
const port =  process.env.PORT || 5000;

const Welcome = fs.readFileSync("./static/welcome.html","utf-8");

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.end(Welcome);
});



//Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`iNotebook backend server app listening on http://localhost:${port}`)
})
