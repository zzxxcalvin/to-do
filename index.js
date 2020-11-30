const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.set("view engine",'ejs');

const todoSchema = new mongoose.Schema({
    task:{type:String,required:true},
});

const Todo = mongoose.model('Todo',todoSchema);

mongoose.connect('mongodb://localhost/todo-list',{ useNewUrlParser: true ,useUnifiedTopology: true })
    .then(()=>console.log("Connect to mongodb..."))
    .catch(err => console.log("Error happend ...",err));

async function getTasks(){
    let tmp = await Todo.find();
    return tmp;
}
// async await
// await Todo.findByIdAndRemove("5fc4c3ba7392013d0ccd040e");

app.get('/',(req,res)=>{
    Todo.find()
        .exec((err,task)=>{
            res.render('index',{
                title:"TODO",
                items:task
            });
        })
})

app.post('/test', function(req, res) {
    console.log('hello');
});

// a function base on body-parser pack
// function as a middleware to simple validate the post/get data in the req.body 
// need this one to make post/get method works
// app.use(express.urlencoded({
//     extended: false
// }));

app.post('/add-todo',express.urlencoded({extended: false}),(req,res)=>{
    if(req.body.item == "")
        res.redirect("/");
    Todo.create({task:req.body.item});
    res.render('reply',{message:`add "${req.body.item}" to the to do list .`});
});

app.get('/edit/:id',(req,res)=>{
    Todo.find()
        .exec((err,task)=>{
            res.render('edit',{
                id:req.params.id,
                title:"TODO",
                items:task
            });
        })
});

app.post('/update/:id',express.urlencoded({extended: false}),async(req,res)=>{
    
    if(req.body.task != "" || req.body.task.length > 3 )
        await Todo.updateOne({_id:req.params.id},{task: req.body.task });
    res.redirect("/");
});

app.get('/delete/:id',async(req,res)=>{
    if(req.params.id == "")
        res.redirect('/');
    await Todo.findByIdAndRemove(req.params.id);
    res.redirect('/');
});

app.listen(3000,()=>{
    console.log("app start at port 3000 ... ");
});


