const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');

// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input

list_item_template = '<div class="row">'+
        '<div class="col-sm-8">'+
            '<p>{{title}}</p>'+
        '</div>'+
        '<div class="col-sm-4">'+
        '<div class="btn-group">'+
    '{{#if completed}}'+
    '<button class="btn btn-primary" type="button">DONE!</button>'+
'{{else}}'+
            '<button class="btn btn-success" type="button" onclick="complete(\'{{title}}\')">Complete</button>'+
    '{{/if}}'+
            '<button class="btn btn-danger" type="button" onclick="complete(\'{{title}}\')" >X</button>'+
    '</div>'+
    '</div>'+
    '</div>'



function add() {
    console.warn(event);
    const input = document.getElementById('todo-input');

    // Emit the new todo as some data to the server
    server.emit('make', {
        title: input.value
    });

    // Clear the input
    input.value = '';
    // TODO: refocus the element
}

function complete(){

}

function render(todo) {
    const container = document.createElement('li');
    container.className = 'list-group-item';

    const listItem = Handlebars.compile(list_item_template);
    const compiledItem = listItem(todo);
    container.innerHTML = compiledItem;
    list.append(container);
}

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', (todos) => {
    todos.forEach((todo) => render(todo));
});

server.on('load-new', (todo) => {
    render(todo)
})
