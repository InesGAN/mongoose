// server
"use strict"
const express = require('express');
const app = express();
const port=4000;
app.use(express.json())

// include the dependences we just installed:

const express = require("express");
const mongoose = require("mongoose");
const personModel=require('./src/models/person')
const bodyParser = require("body-parser");
require("dotenv").config();

// process.env.MONGO_URI='mongodb://localhost:3000/mydatabase'
// database

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true },(err) => {
    if (err) console.log(err);
    else console.log("database connected");
})


// Create a person having this prototype:
let person=new personModel({
    name:'Ines',
    age:26,
    favoriteFoods:['couscous']
})

// Create and Save a Record of a Model:
person.save(function(err,doc){
    if (err) console.log(err)
    console.log(doc); 
}) 


app.post('/', (req, res) => { 
    personModel.create({
        name:req.body.name,
        age:req.body.age,
        favoriteFoods:req.body.favoriteFoods},(err,doc)=>{
        if (err) console.log(err)
        console.log(doc);
        
})
})

// Use model.find() to Search Your Database
// all persons
app.get('/allPersons', (req, res) => {
    personModel.find()
    .then(doc => res.send(doc))
    .catch(err => console.error(err))
})
//  find person by name
app.get('/person/:name', (req, res) => {
    personModel.find({name:req.params.name},(err,doc)=>{
        if(err){console.error(err);}
        console.log(doc);
    })
    .then(doc => res.send(doc))
    .catch(err => console.error(err.message))
})

// Use model.findOne() to Return a Single Matching Document from Your Database
app.get('/person/:favoriteFoods', (req, res) => {
    personModel.findOne({favoriteFoods:req.params.favoriteFoods},(err,doc)=>{
        if(err){console.error(err);}
        console.log(doc);
    })
    .then(doc => {
        res.send(doc)
    })
    .catch(err => {
        console.error(err)
        res.send('Server Error')
    })
})
// Use model.findById() to Search Your Database By _id

app.get('/person/:_id', (req, res) => {
personModel.findById(req.params._id,(err,doc)=>{
    if(err){console.error(err);}
    console.log(doc);
})
.then(doc => {
    res.send(doc)
})
.catch(err => {
    console.error(err)
    res.send('Server Error')
})
})

// basic operations Running Find, Edit, then Save
app.put("/updatePerson/:_id",(req,res)=>{
    personModel.findById(req.params._id,(err,data)=>{
        if(err){console.log(err)}
        else {data.favoriteFoods.push("hamburger")};
        data.save((err,data)=>{
            if(err){console.log(err)}
            else {console.log(data),res.send(data)}
        })   
    })
});

// Perform New Updates on a Document Using model.findOneAndUpdate()
app.put("/UpdatePersonAge/:name",(req,res)=>{
personModel.findOneAndUpdate({name:req.params.name},{age:20},{new:true},(err,doc)=>{
    if (err) console.log(err)
    console.log(doc); })
})

// findByIdAndRemove
app.delete("/deletePerson/:_id",(req,res)=>{
    personModel.findOneAndDelete(req.params._id,(err,doc)=>{
        if (err) console.log(err)
        console.log(doc); })
    .then( doc => res.send( doc ) )
    .catch(err=>console.log(err))
})

//  model.remove()
app.delete("/removeHarry",(req,res)=>{
personModel.remove({name:'Harry'},(err,doc)=>{
    if (err) console.log(err)
    console.log(doc);
    res.send(doc) })

.exec((err,doc)=>{
    if (err) console.log(err)
    console.log(doc); 
    res.send(doc)
})
    
})

// Chain Search Query Helpers to Narrow Search Results
app.get('/2personlikeburrito', (req, res) => {
personModel.find({favoriteFoods:'burrito'})
.sort({name:1})
.limit(2)
.select("-age")
.exec((err,doc)=>{
    if (err) console.log(err)
    console.log(doc); })
.then(doc => {
        res.send(doc)
})
.catch(err => {
        console.error(err)
        res.send('Server Error')
})
})

app.listen(port,()=>{console.log('The server is running, ' +' please, open your browser at http://localhost:%s',port)});