const express=require('express');
const router=express.Router();
const fetchuser=require('../middleware/fetchuser');
const Note=require('../models/Note.js');
const { body, validationResult } = require('express-validator');
const { findById } = require('../models/User');

//ROUTE 2: fetch all notes using: GET '/api/fetchnotes'
router.get('/fetchnotes', fetchuser,async(req,res)=>{
    try {
        const notes=await Note.find({user:req.user.id})
    res.json(notes);
    } catch (error) {
        console.log(error.message);
    res.status(500).send("Internal server error");
    }
    
})

//ROUTE 3: add new note using: POST '/api/addnote'

router.post('/addnote', fetchuser,[
    body('title','enter a valid title').isLength({min:1}),
    body('description','enter a valid description').isLength({min:1})
],async(req,res)=>{
    try {
        
    const {title,description,tag}=req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const notes=new Note({
        title,description,tag,user:req.user.id
    })
    const savedNote= await notes.save();
    res.json(savedNote);
} catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
}
})

//ROUTE 3: update a note using: PUT '/api/updatenote'
router.put('/updatenote/:id', fetchuser,async(req,res)=>{
    try {
        
    const {title,description,tag}=req.body;
    //store what user wants to update
    const newNote={};
        if(title){newNote.title=title}
        if(description){newNote.description=description};
        if(tag){newNote.tag=tag};
    
        //VERIFY USER
        let note= await Note.findById(req.params.id);
        if(!note){ return res.status(404).send("Not found")}
        if(note.user.toString()!=req.user.id){
            return res.status(401).send("Not Allowed")
        }

        //update note
        note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
        res.json(note);
} catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
}
})

//ROUTE 4: update a note using: DELETE '/api/updatenote'
router.delete('/deletenote/:id', fetchuser,async(req,res)=>{
    try {
    
        //VERIFY USER
        let note= await Note.findById(req.params.id);
        if(!note){ return res.status(404).send("Not found")}
        if(note.user.toString()!=req.user.id){
            return res.status(401).send("Not Allowed")
        }

        //delete note
        note=await Note.findByIdAndDelete(req.params.id);
        res.json("Note was deleted"+note);
} catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
}
})


module.exports=router;