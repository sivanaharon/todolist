const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');

// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input

list_item_template = '<div class="row">'+
        '<div class="col-sm-8">'+
            '<p class="title">{{title}}</p>'+
        '</div>'+
        '<div class="col-sm-4">'+
        '<div class="btn-group float-right">'+
    '{{#if completed}}'+
    '<button class="btn btn-primary disabled" type="button">DONE!</button>'+
'{{else}}'+
            '<button class="btn btn-success" type="button" onclick="complete(\'{{title}}\')">Complete</button>'+
    '{{/if}}'+
            '<button class="btn btn-danger" type="button" onclick="remove(\'{{title}}\')" >X</button>'+
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

function complete(title){
    server.emit('complete',{title: title})
}

function remove(title){
    server.emit('remove',{title:title})

//TODO
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

server.on('complete', (todo)=>{
    $('li').each(function(index,item){
        if($(item).find('p').text()===todo.title){
            $(item).find('.btn-success').replaceWith('<button class="btn btn-primary disabled" type="button">DONE!</button>')
        }
    })
});
server.on('remove', (todo)=>{
    $('li').each(function(index,item){
        if($(item).find('p').text()===todo.title){
            $(item).remove()
        }
    })
});
