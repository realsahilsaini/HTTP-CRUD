// Description: A simple express server that allows you to create, read, and delete in memory todos.
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let todos = [];

//Get all todos
app.get('/', (req, res) => {
  res.json(todos);
});


//Create a new todo
app.post('/', (req, res) => {
  const newTodo = {
    id: todos.length + 1, //auto incrementing id
    title: req.body.title, 
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

//Delete a todo
app.delete('/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const index = todos.findIndex( todo => todo.id === todoId);
  console.log(index);

  
  if(index < 0 && index >= todos.length) { 
    res.status(404).json({ message: 'ToDo not found' })
    return;
  }
  todos.splice(index, 1);

  res.json(todos);
});

app.put('/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const index = todos.findIndex( todo => todo.id === todoId);
  // console.log(index);

  
  if(index < 0 && index >= todos.length) { 
    res.status(404).json({ message: 'ToDo not found' })
    return;
  }
  todos[index].title = req.body.title;
  res.json(todos);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});