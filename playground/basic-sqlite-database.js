var Sequelize = require('sequelize');
var sequilize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequilize.define('todo', {
        description: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: [1,250]
            }
        },
        completed: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
});


sequilize.sync({
    //force: true
    }).then(function () {
    console.log('Everything is synced');

    Todo.findById(2).then(function (todo) {
        if (todo) {
            console.log(todo.toJSON());
        } else {
            console.log('todo not found');
        }
    }).catch(function (error) {
        console.log(error);
    })
});


    //Todo.create({
    //    description: "Eat lunch"
    //}).then(function (todo) {
    //    return Todo.create({
    //        description: "Drink tea"
    //    });
    //}).then (function () {
    //    //return Todo.findById(1)
    //    return Todo.findAll({
    //       where: {
    //           description: {
    //               $like: '%drink%'
    //           }
    //       }
    //    });
    //}).then(function (todos) {
    //    if(todos) {
    //        todos.forEach(function (todo) {
    //            console.log(todo.toJSON());
    //        });
    //    } else {
    //        console.log('no todo found!');
    //    }
    //}).catch(function (error) {
    //    console.log(error);
    //});


