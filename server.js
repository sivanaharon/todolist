const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

//Note: in practice this should be in a constructor
server.data = firstTodos.map((t) => {
        // Form new Todo objects
        return new Todo(title=t.title);
});

server.on('connection', (client) => {
    // This is going to be our fake 'database' for this application
    // Parse all default Todo's from db

    // FIXME: DB is reloading on client refresh. It should be persistent on new client
    // connections from the last time the server was run...


    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        server.emit('load', server.data);
    }

    // Accepts when a client makes a new todo
    client.on('make', (t) => {
        // Make a new todo
        const newTodo = new Todo(title=t.title);

        // Push this newly created todo to our database
        server.data.push(newTodo);

        // Send the latest todos to the client

        server.emit('load-new',newTodo)
    });

    // Send the DB downstream on connect
    reloadTodos();
});

console.log('Waiting for clients to connect');
server.listen(3003);
