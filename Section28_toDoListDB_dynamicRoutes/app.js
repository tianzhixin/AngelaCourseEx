// Goal:
// Create a to-do list home page and a to-do list dynamic routes.

// Requirements:
// Can do add items and delete items. => post requests of express.
// Added and deleted items are permanant. => Database
// Dyanmic routes: express. EJS templates and EJS layouts.

// Realization:
// Front-end: EJS+HTML, CSS+BOOTSTRAP
// Back-end: express for web application, mongoose for Database

// Steps:
// 1. Create a collection for this web application. Each document corresponds to
//    each page. {listName: xxx, items: []}.
// 2. Show webpage: get request. Render EJS file with listName and items passed in.
// 3. Add items: button pressed. Post request. Add item to Database. Redirect to
//    the page.
// 4. Delete items: checkbox checked. post request. Delete item in Database. Redirect
//    to the page.

const express = require("express"); //For web application.
const date = require(__dirname + "/date.js") //local module.
const mongoose = require("mongoose");
// Database code
mongoose.connect('mongodb://localhost:27017/toDoList');
// List collection
const listSchema = new mongoose.Schema({
  name: String,
  items: [{name: String}]
});
const List = mongoose.model("List",listSchema);
// Create items and homeList
const item1 = {name: "Pelvic floor exercise"};
const item2 = {name: "Web course"};
const item3 = {name: "Eyes exercise"};

List.find({name:"homeList"},(err,listFound)=>{
  if (listFound.length === 0){
    const homeList = new List({
      name: "homeList",
      items: [item1, item2, item3]
    })
    homeList.save();
  }
});

// Prerequisites
const app = express();
app.set("view engine","ejs"); // To use ejs as the view engine
app.use(express.urlencoded({extended: true})); // to use req.body.
app.use(express.static(__dirname + '/public')) // To use static files (styles.css) in public folder

// Get and post requests
app.get("/",(req,res)=>{
  List.find({name:"homeList"},(err,listsFound)=>{
    res.render("list",{listName:"homeList", listItems:listsFound[0].items});
  });
})

app.post("/",(req,res)=>{
  List.findOneAndUpdate(
    {name:req.body.list},
    {$push:{items:{name:req.body.newItem}}},
    (err,success)=>{
      if (err){
        console.log(err);
      } else {
        if (req.body.list == "homeList"){
            res.redirect("/");
        } else {
          res.redirect("/myList/"+req.body.list);
        }
      }
    }
  );

})

app.post("/delete",(req,res)=>{
  List.findOneAndUpdate(
    {name: req.body.list},
    {$pull: {items:{_id:req.body.itemId}}},
    (err,suc)=>{
      if (err){
        console.log(err);
      } else {
        if (req.body.list==="homeList"){
          res.redirect("/");
        } else {
          res.redirect("/myList/"+req.body.list)
        }
      }
    }
  );
})

app.get("/myList/:listName",(req,res)=>{
  const listName = req.params.listName;
  List.find({name:listName},(err,list)=>{
    if (!err){
      if (list.length === 0){
        const newList = new List({
          name: listName,
          items: [item1, item2]
        });
        newList.save();
        res.redirect("/myList/" + listName)
      } else {
        res.render("list",{listName:listName, listItems:list[0].items});
      }
    }
  })
})

app.listen(3000,function(){
  console.log("Server is running on 3000.")
})
