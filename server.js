const express = require('express');
const fs = require('fs');
const app = express();
var session = require('express-session')

app.use(express.json());

app.set('view engine', 'ejs');

app.use(session({
    secret: 'iambatman',
    resave: false,
    saveUninitialized: true,
}))

app.listen(4000, () => {
    console.log('Server listening on port 4000');
});
app.get('/', function (req, res) {
    if(!req.session.isLoggedIn){
        res.redirect('/login');
        return;
    }
    res.render("index",{username: req.session.username});
});
app.get('/signup', function (req, res) {
    res.sendFile(__dirname + '/signup.html');
});
app.post('/todo', function (req, res) {
    if(!req.session.isLoggedIn){
        res.status(401).send("Error");
        return;
    }
    saveTodoInFile(req.body, function (err) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).send("success");
    });
});
app.get('/todo-data', function (req, res) {
    if(!req.session.isLoggedIn){
        res.status(401).send('Error');
        return;
    }
    readAllTodos(function (err, data) {
        if (err) {
            res.status(500).send("error");
            return;
        }
        // res.status(200).json(data);
        res.status(200).send(JSON.stringify(data));
    });
});
app.get('/login', function (req, res) {
    res.render("login",{ error: null });
});
app.get('/about', function (req, res) {
    if(!req.session.isLoggedIn){
        res.redirect('/login');
        return;
    }
    res.sendFile(__dirname + '/about.html');
});
app.get('/contact', function (req, res) {
    if(!req.session.isLoggedIn){
        res.redirect('/login');
        return;
    }
    res.sendFile(__dirname + '/contact.html');
});
app.get('/todo', function (req, res) {
    if(!req.session.isLoggedIn){
        res.redirect('/login');
        return;
    }
    res.sendFile(__dirname + '/todo.html');
});
app.get('/todoScript.js', function (req, res) {
    res.sendFile(__dirname + '/todoScript.js');
});
app.get('/cross.png', function (req, res) {
    res.sendFile(__dirname + '/cross.png');
});

function readAllTodos(callback) {
    fs.readFile('./todoStore.txt', 'utf-8', function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        if (data.length === 0) {
            data = "[]";
        }
        try {
            data = JSON.parse(data);
            callback(null, data);
        } catch (err) {
            callback(err);
        }
    });
}
function saveTodoInFile(todo, callback) {
    readAllTodos(function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        data.push(todo);
        fs.writeFile('./todoStore.txt', JSON.stringify(data), function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null);
        });
    })
}

// authentication code below
app.get('/signup_script.js', function (req, res) {
    res.sendFile(__dirname + '/signup_script.js');
});
app.use(express.urlencoded({ extended:true}));
app.post('/signup', function (req, res) {
    saveSignupData(req.body, function (err) {
        if (err) {
            res.status(401).send(err);
            return;
        }
        // res.status(200).send("success");
        res.redirect('/');
    });
});
function readAllSignups(callback) {
    fs.readFile('./signup_data.txt', 'utf-8', function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        if (data.length === 0) {
            data = "[]";
        }
        try {
            data = JSON.parse(data);
            callback(null, data);
        } catch (err) {
            callback(err);
        }
    });
}
function saveSignupData(signupData, callback) {
    readAllSignups(function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        data.push(signupData);
        fs.writeFile('./signup_data.txt', JSON.stringify(data), function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null);
        });
    })
}
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    fs.readFile('signup_data.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('An error occurred.');
        }

        try {
            const users = JSON.parse(data);
            const foundUser = users.find(user => user.username === username && user.password === password);

            if (foundUser) {
                // User found, perform successful login action
                req.session.isLoggedIn = true;
                req.session.username = username;
                res.redirect('/');
            } else {
                // User not found or incorrect credentials
                // res.send(`<script>alert("Login failed. Incorrect username or password."); window.location.href="/";</script>`);
                res.render('login', {error: "Invalid username or password"});                
            }
        } catch (error) {
            console.error(error);
            res.status(401).send('An error occurred.');
        }
    });
});