const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;


const todosJSON = 'todos.json';

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

app.use(express.json());


//GET todos
app.get('/', (req, res) => {
  const todos = loadTodos();
  res.json(todos);
});


//Add todo POST
app.post('/', (req, res) => {
  const todos = loadTodos();
  const newTodo = {
    id: todos.length + 1, //auto incrementing id
    title: req.body.title, 
  };
  todos.push(newTodo);
  saveTodos(todos);
  res.json(newTodo);
});


//Delete todo
app.delete('/:id', (req, res) => {
  const todos = loadTodos();

  const todoId = parseInt(req.params.id);
  if(todoId < 1 && todoId>=todos.length) {
    res.status(404).json({ message: 'ToDo not found' });
    return;
  }
  const index = todos.findIndex( todo => todo.id === todoId);

  todos.splice(index, 1);
  saveTodos(todos);
  res.json(todos);
});

//Update todo
app.put('/:id', (req, res) => {
  const todos = loadTodos();
  const todoId = parseInt(req.params.id);
  const index = todos.findIndex( todo => todo.id === todoId);
  if(index < 0 || index>=todos.length) {
    res.status(404).json({ message: 'ToDo not found' });
    return;
  }

  todos[index].title = req.body.title;
  saveTodos(todos);
  res.json(todos);
});















// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});