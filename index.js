
import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'
import path from 'path'

import validateUserId from './src/middleware/checkID.middleware.js'
import validateUserExistence from './src/middleware/checkUserExist.middleware.js'
import validateName from './src/middleware/validateName.middleware.js'
import checkFullField from './src/middleware/checkFullField.middleware.js'

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const port = 3002
app.use(bodyParser.json());
const usersFilePath = path.join(__dirname, 'users.json');
function readUsers() {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Lỗi đọc file:', err);
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})
const users= readUsers();
// Lấy danh sách người dùng với sắp xếp theo ID

app.get('/users', (req, res) => {
  const { sort } = req.query;
  let sortedUsers = [...users];
  if (sort === 'asc') {
      sortedUsers.sort((a, b) => a.id - b.id);
  } else if (sort === 'desc') {
      sortedUsers.sort((a, b) => b.id - a.id);
  }
  res.send(sortedUsers);
});
// Lấy thông tin người dùng theo ID



app.get('/users/:id', validateUserId, validateUserExistence, (req, res) => {

  const user = users.find(u => u.id === parseInt(req.params.id));
  
  res.status(200).send(user);
});
// Thêm người dùng mới

app.post('/users', validateUserExistence,validateName, (req, res) => {
  const { name} = req.body;
  const newUser = { id: users.length + 1, name};
  
  users.push(newUser);
  writeUsers(users); 
  res.status(200).send(newUser);
});

app.put('/users/:id',validateUserExistence, validateName, (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  const { name } = req.body;
  
  if (name) user.name = name;
  writeUsers(users);
  res.status(200).send(user);
});

app.delete('/users/:id', validateUserExistence, (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  
  users.splice(userIndex, 1);
  writeUsers(users);
  res.status(200).send(users);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  console.log('Heeeeeeeeeeee');
})