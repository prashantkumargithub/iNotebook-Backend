require('dotenv').config();
const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors');


connectToMongo();

const app = express();
const port =  process.env.PORT || 5000;

const Welcome =`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to iNotebook</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #282c34, #3c3f41);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .welcome-container {
            background-color: #000;
            border-radius: 15px;
            box-shadow: 0 10px 20px rgba(225, 225, 225, 0.2);
            text-align: center;
            padding: 40px 20px;
            max-width: 500px;
            width: 80%;
            /* margin-top: ; Adjust this value if you want more space from the navbar */
        }

        .welcome-container h1 {
            margin: 0;
            font-size: 2.5em;
            color: #4CAF50;
        }

        .welcome-container p {
            font-size: 1.2em;
            color: #555;
            margin: 20px 0;
        }

        .welcome-container a {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s;
        }

        .welcome-container a:hover {
            background-color: #388E3C;
        }
    </style>
</head>
<body>
    <div class="welcome-container">
        <h1>Welcome!</h1>
        <p>Welcome to iNotebook. You notes secured on the cloud</p>
        <a href="https://mynote01.vercel.app/">Visit website</a>
    </div>
</body>
</html>`;

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
