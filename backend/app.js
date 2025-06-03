import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';


const app = express();
const PORT = 5000;

// Middleware to parse JSON request body
app.use(bodyParser.json());
app.use(cors());


// Create the database connection
const con = mysql.createConnection({
  host: 'mysql-18cf372e-djmoviestore.l.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_iIvBqi8lVGLqxky47yf',
  database: 'userAuthentication',
  port: 14342
});

// Connect to the database
con.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database as ID ' + con.threadId);
});

// Signup route
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  con.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Database error');
    }

  res.json({ message: 'User signed up successfully!' });

  });
});

//login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  con.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Database error');
    }

    if (results.length === 0) {
      return res.status(401).send({ message: 'User not found' });
    }

    const user = results[0];

    // Check if the password matches
    if (user.password === password) {
      res.send({ message: 'Login successful', user });
    } else {
      res.status(401).send({ message: 'Incorrect password' });
    }
  });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
