let button = document.getElementById('btn');
let input = document.getElementById('inp');
let parent = document.getElementById('parent');

button.addEventListener('click', () => {
    let value = input.value;
    if (!value) {
        alert('Please Enter a todo');
        return;
    }
    let todo = {
        todoText: value
    };
    fetch('/todo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
    }).then(function (response) {
        if (response.status === 200) {
            showTodoInUI(todo);
        }else if(response.status === 401) {
            alert('Please Login First');
        }else {
            alert("something went wrong");
        }
    })
});

function showTodoInUI(todo) {
    let value = todo.todoText;
    var checkBox = document.createElement('input');
    checkBox.type = "checkbox";
    checkBox.id = value;
    checkBox.style.padding = '12px';
    var label = document.createElement('label');
    label.htmlFor = value;
    label.appendChild(document.createTextNode(value));
    label.style.padding = '10px 5px';
    let img = document.createElement('img');
    img.src = '/cross.png';
    img.id = 'cross';
    img.width = '12';
    img.height = '12';
    var endLine = document.createElement('br');
    parent.appendChild(img);
    parent.appendChild(checkBox);
    parent.appendChild(label);
    parent.appendChild(endLine);
    img.onclick = () => {
        parent.removeChild(checkBox);
        parent.removeChild(label);
        parent.removeChild(img);
        parent.removeChild(endLine);
    }
    input.value = "";
}

fetch('/todo-data').then(function (response) {
    if (response.status === 200) {
        return response.json();
    }
    else if(response.status === 401) {
        alert('Please Login First');
    }else {
        alert("something went wrong");
    }
}).then(function (todos) {
    todos.forEach(function (todo) {
        showTodoInUI(todo);
    })
})