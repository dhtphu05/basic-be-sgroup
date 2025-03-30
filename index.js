const express = require('express')
const req = require('express/lib/request')
const bodyParser = require('body-parser')
const fs = require('fs');
const path = require('path');
const app = express()
const port = 3005
app.use(bodyParser.json());
app.use(express.json());
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
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  res.send(user);
});
// Thêm người dùng mới
app.post('/users', (req, res) => {
  const { name} = req.body;
  const newUser = { id: users.length + 1, name};
  users.push(newUser);
  writeUsers(users); 
  res.send(newUser);
});

app.put('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  const { name } = req.body;
  if (name) user.name = name;
  writeUsers(users);
  res.send(user);
});

app.delete('/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  users.splice(userIndex, 1);
  writeUsers(users);
  res.send(users);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  console.log('Heeeeeeeeeeee');
})