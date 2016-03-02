var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');


var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Todo API root');
});

// GET /todos?completed=true&q=description
app.get('/todos', function (req, res) {
    var query = req.query;
    var where = {};

    if(query.hasOwnProperty('completed') && query.completed === "true"){
        where.completed = true;
    } else if (query.hasOwnProperty('completed') && query.completed === "false"){
        where.completed = false;
    }

    if(query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {
            $like: '%' + query.q +'%'
        };
    }

    db.todo.findAll({where: where}).then(function (todos) {
                res.json(todos);
        }, function (error) {
                res.status(404).send(error);
            });
});

// GET /todos/:id
app.get('/todos/:id', function (req, res){
    var todoId = parseInt(req.params.id, 10);

    db.todo.findById(todoId).then(function (todo) {
        if(todo){
             res.json(todo.toJSON());
        } else {
            res.status(404).send();
        }
    }).catch(function (error){
        res.status(500).send(error);
    });


});

// POST /todos
app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    db.todo.create(body).then(function (todo) {
        res.json(todo.toJSON());
    },function(error) {
       res.status(400).send(error);

    });

});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);

    db.todo.findById(todoId).then(function (matchedTodo) {
        if(!matchedTodo) {
            res.status(404).json({"error": "no todo found with that id"});
        } else {
            matchedTodo.destroy();
            res.status(204).send();
        }
    });

});

// PUT /todos/:id
app.put('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'description', 'completed');
    var attributes = {};


    if(body.hasOwnProperty('completed')){
       attributes.completed = body.completed;
    }

    if(body.hasOwnProperty('description')){
        attributes.description = body.description;
    }

    db.todo.findById(todoId).then(function(todo){
        if(todo){
            todo.update(attributes).then(function (todo){
                res.json(todo.toJSON());
            }, function (error) {
                res.status(400).json(error);
            });
        } else {
            res.status(404).send();
        }
    }, function () {
        res.status(500).send();
    });
});

app.post('/users', function (req, res){
    var body = _.pick(req.body, 'email', 'password');

    db.user.create(body).then(function (user) {
        res.json(user.toPublicJSON());
    },function(error) {
        res.status(400).send(error);
    });
});

db.sequelize.sync().then(function () {
    app.listen(PORT, function (){
        console.log('Express listening on port ' + PORT);
    });
});

