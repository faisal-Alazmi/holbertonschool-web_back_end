const express = require('express');
const fs = require('fs');

const app = express();

const countStudents = (path) => new Promise((resolve, reject) => {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      reject(new Error('Cannot load the database'));
      return;
    }

    const lines = data.split('\n').filter((line) => line.trim() !== '');
    const students = lines.slice(1);

    let output = `Number of students: ${students.length}\n`;

    const fields = {};
    students.forEach((line) => {
      const [firstname, , , field] = line.split(',');
      if (!fields[field]) fields[field] = [];
      fields[field].push(firstname);
    });

    for (const [field, names] of Object.entries(fields)) {
      output += `Number of students in ${field}: ${names.length}. List: ${names.join(', ')}\n`;
    }

    resolve(output.trim());
  });
});

app.get('/', (req, res) => {
  res.send('Hello Holberton School!');
});

app.get('/students', (req, res) => {
  const dbPath = process.argv[2];
  countStudents(dbPath)
    .then((result) => {
      res.send(`This is the list of our students\n${result}`);
    })
    .catch((error) => {
      res.send(`This is the list of our students\n${error.message}`);
    });
});

app.listen(1245);

module.exports = app;
