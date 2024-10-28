import fs from 'fs';
import express, { json } from 'express';
const app = express(); 
const PORT = 3000;

loadTodosFromFile();

app.use(json());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

let todos = [];

app.get('/todos', (req, res) => {
    res.json(todos);
});

app.post('/todos', (req, res) => {
    const { task } = req.body;
    if (!task || typeof task !== "string" || task.trim() === "") {
        return res.status(400).send("Task is required");
    }
    const newTodo = { id: todos.length + 1, task };
    todos.push(newTodo);
    res.status(201).json(newTodo);
    saveTodosToFile();
}); 

app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { task } = req.body;
    const todo = todos.find((t) => t.id === parseInt(id));
  
    if (!todo) {
      return res.status(404).send('To-Do item not found');
    }
  
    if (!task || typeof task !== "string" || task.trim() === "") {
      return res.status(400).send("Task is required");
    }
  
    todo.task = task;
    res.json(todo);
    saveTodosToFile();
});

app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    todos = todos.filter((t) => t.id !== parseInt(id));
    res.status(204).send();
    saveTodosToFile();
});

const saveTodosToFile = () => {
    fs.writeFile('todos.json', JSON.stringify(todos, null, 2), (err) => {
      if (err) console.error('Error saving todos:', err);
    });
};

const loadTodosFromFile = () => {
    fs.readFile('todos.json', 'utf8', (err, data) => {

        if (err) {
            console.log('No existing todos to load, starting fresh.');
            return;
        }
        try {
            todos = JSON.parse(data);
        }
        catch (parseError) {
            console.error('Error parsing todos.json, starting fresh:', parseError);
            todos = [];
        }
    });
};
    