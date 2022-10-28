const express = require("express");
const date = require(__dirname + "/date.js") //local module.
const mongoose = require("mongoose");
// Database code
mongoose.connect('mongodb://localhost:27017/toDoList');
// Item collection
// const itemSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   }
// });
// const Item = mongoose.model("Item",itemSchema);
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
    console.log(listsFound);
    res.render("list",{listName:"homeList", listItems:listsFound[0].items});
  });
})

app.post("/",(req,res)=>{
  console.log(req.body.add);
  console.log("req.body.list: " + req.body.list);

  // List.findOne({items:{_id:req.body.add}},(err,result)=>{
  //     if (err){
  //       console.log(err);
  //     } else {
  //       console.log("Found\n" + result);
  //     }
  // })

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
  console.log("req.body.list: " + req.body.list);
  List.findOneAndUpdate(
    {name: req.body.list},
    {$pull: {items:{_id:req.body.checkBox}}},
    (err,suc)=>{
      if (err){
        console.log(err);
      } else {
        console.log("req.body.checkBox: " + req.body.checkBox);
        if (req.body.list==="homeList"){
          res.redirect("/");
        } else {
          console.log("post, delete, redirect to /myList/" + req.body.list);
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
      // console.log(list);
      if (list.length === 0){
        const newList = new List({
          name: listName,
          items: [item1, item2]
        });
        newList.save();
        console.log("get, redirect to /myList/" + listName);
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
