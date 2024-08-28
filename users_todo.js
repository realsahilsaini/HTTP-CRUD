const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

const todosJSON = 'users_todo.json';


function loadTodos(){
  if(fs.existsSync(todosJSON)){
    const data = fs.readFileSync(todosJSON, 'utf-8');
    if(data){
      return JSON.parse(data);
    }
  }
  return [];
}

function saveTodos(todos){
  fs.writeFileSync(todosJSON, JSON.stringify(todos));
}

// const todos = loadTodos();
// console.log(todos);

// console.log(todos['user1'][1]); 
// console.log(Object.keys(todos)); 


//Get todos for all users
app.get('/todos', (req, res) => {
  const todos = loadTodos();
  res.json(todos);
});

//Get todos for a specific user
app.get('/todos/:user', (req, res) => {
  const todos = loadTodos();
  const userTodos = todos[req.params.user];
  res.json(userTodos);
});


//Post a new todo for a specific user
app.post('/todos/:user', (req, res) => {
  const todos = loadTodos();
  const userTodos = todos[req.params.user];
  if(!userTodos){
    return res.status(404).send('User not found');
  }
  const newTodo = {
    id: userTodos.length + 1,
    title: req.body.title,
  };
  userTodos.push(newTodo);
  saveTodos(todos);
  res.status(201).json(todos);
})


//POST a new user
app.post('/todos/newuser/:username', (req, res) => {
  const todos = loadTodos();
  const newUser = req.params.username;
  todos[newUser] = [];
  saveTodos(todos);
  res.status(201).json(todos);
})


//Delete a todo for a specific user
app.delete('/todos/:user/:id', (req, res) => {
  const todos = loadTodos();
  const userTodos = todos[req.params.user];
  if(!userTodos){
    return [];
  }
  const todoIndex = userTodos.findIndex(todo => todo.id === parseInt(req.params.id));
  if(todoIndex === -1 || !userTodos[todoIndex]){
    return res.status(404).send('Todo not found');
  }
  userTodos.splice(todoIndex, 1);
  saveTodos(todos);
  res.json(todos);
})


//Delete a user
app.delete('/todos/:user', (req, res) => {
  const todos = loadTodos();
  const userTodos = todos[req.params.user];
  if(!userTodos){
    return res.status(404).send('Todo not found');
  }
  delete todos[req.params.user];
  saveTodos(todos);
  res.json(todos);
})





// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});