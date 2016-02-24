var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Todo API root');
});

// GET /todos
app.get('/todos', function (req, res) {
    res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res){
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = null;

    for(var i = 0; i < todos.length; i++) {
        if(todos[i].id === todoId){
            matchedTodo = todos[i];
        }
    }

    if(matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send('This id doesn\'t exist');
    }

});

// POST /todos
app.post('/todos', function (req, res) {
    var body = req.body;

    body.id = todoNextId++;

    todos.push(body);

    res.json(body);
});

app.listen(PORT, function (){
   console.log('Express listening on port ' + PORT);
});