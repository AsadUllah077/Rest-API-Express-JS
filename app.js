const express = require('express');
const app = express();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
var methodOverride = require('method-override')


// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public/images')); // Save in 'public/images' folder
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname)); // Generate unique file name
    }
});
const upload = multer({ storage: storage });

app.use(methodOverride('_method'))
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

let port = 8080;

let posts =[
        {
            id : uuidv4(),
            user : "asad",
            content : "Hello i am asad",
            img : "/images/one.jpg"
        },
        {
            id : uuidv4(),
            user : "ahmed",
            content : "Hello i am ahmed",
            img : "/images/two.jpg"
        },
        {
            id : uuidv4(),
            user : "mohammed",
            content : "Hello i am mohammed",
            img : "/images/thre.jpg"
        }
];

app.listen(port , ()=>{
    console.log(`listening on ${port}`);
});

app.get('/posts', (req,res) => {
    res.render('view.ejs', {posts});
});

app.delete('/posts/:id', (req,res) => {
    let post = req.params;
    posts = posts.filter(p => p.id!== post.id);
     res.redirect('/posts');
});


app.post('/posts', upload.single('img'), (req, res) => {
    const { user, content } = req.body;
    const img = req.file ? `/images/${req.file.filename}` : ''; // Get file path or empty string
    const newPost = { id: uuidv4(), user, content, img };
    posts.push(newPost);
    res.render('view.ejs', { posts }); // Render the posts view
});

app.get('/posts/new', (req,res) => {
    // res.send("new post");
     res.render('new.ejs');
});
app.get('/posts/detail/:id', (req,res) => {
   
    let post = posts.find(p => p.id === req.params.id);
     res.render('detail.ejs', { post });
   
});

app.get('/posts/edit/:id', (req,res) => {
    let post = posts.find(p => p.id === req.params.id);
     res.render('edit.ejs', { post });
});


app.put('/posts/:id', upload.single('img'), (req, res) => {
    let post = posts.find(p => p.id === req.params.id);
    post.user = req.body.user;
    post.content = req.body.content;
    if(req.file){
        post.img = `/images/${req.file.filename}`;
    }
    res.redirect('/posts');
});

