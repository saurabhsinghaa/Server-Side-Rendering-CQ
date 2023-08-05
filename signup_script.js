let firstName = document.getElementById('firstname');
let lastName = document.getElementById('lastname');
let userName = document.getElementById('username');
let password = document.getElementById('password');
let submit = document.createElement('submit');

submit.addEventListener('click', ()=>{
    const firstname = firstName.value;
    const lastname = lastName.value;
    const username = userName.value;
    const pass = password.value;

    if(!firstname || !lastname || !username || !pass){
        alert('Please Enter All Details');
        return;
    }
    let signupData = {
        firstName: firstname,
        lastName: lastname,
        userName: username,
        password: pass
    };
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
    }).then(function (response) {
        if (response.status === 200) {
            window.location.href = '/index.html';
        }else {
            alert("something went wrong");
        }
    })

})