const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');

// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input
$('.alert').alert()

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

function deleteAll(){
    server.emit('remove-all',{});
}
function completeAll(){
    server.emit('complete-all',{});
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
    $("#todo-list").text("")
    todos.forEach((todo) => render(todo));
    try {
        window.localStorage.set('todos', JSON.stringify(todos));
    }catch(err){
        //pass
    }
    $(".btn").removeClass('disabled')
    $("input").removeClass('disabled')
    $("#connection-alert").hide()

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
server.on('remove-all',()=>{
    console.log('remove-all')
    $("#todo-list").text("")
})

server.on('complete-all',()=>{
    $('li').each(function(index,item) {
      $(item).find('.btn-success').replaceWith('<button class="btn btn-primary disabled" type="button">DONE!</button>')
    })

})

server.on('connect_error',()=>{
    $("#todo-list").text("")
try {
    todos = JSON.parse(window.localStorage.get('todos'))
    todos.forEach((todo) => render(todo));
}catch(err){
        //pass
}
    $(".btn").addClass('disabled')
    $("input").addClass('disabled')
    $("#connection-alert").show()

})