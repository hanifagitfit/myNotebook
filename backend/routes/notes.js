const express = require('express');
const router = express.Router();
const Note = require('../models/Note')
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

//Route 1:Get all the notes using GET'/api/auth/fetchallnotes'.  login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Some error occured.')
    }
})
//Route 2:Add a new notes using post'/api/auth/addnewnote'. No login required
router.post('/addnewnote', fetchuser, [
    body('title', 'Please enter a title').isLength({ min: 5 }),
    body('description', 'Enter a valid description').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body; //Destructring the items/Bahar nikal rha h.
        //if there are no errors then return Bad request and the errors. 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Some error occured.')
    }
})
//Route 3:Update a note using Put'/api/auth/updatenote'. login required
router.put('/updatenote/:id', fetchuser,async (req, res) => {
    const {title,description,tag}=req.body;
    //create newNote object
    const newNote ={};
    if(title){newNote.title=title};
    if(description){newNote.description=description};
    if(tag){newNote.tag=tag};

    //find an update and update it
    let note=await Note.findById(req.params.id);
    if(!note){return res.status(404).send('Not found')}

    if(note.user.toString() !== req.user.id){
        return res.status(404).send('Not allowed')
    }
    note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
    res.json(note)
})
//Route 4:Delete a note using delete'/api/auth/deletnote'. login required
router.delete('/deletenote/:id', fetchuser,async (req, res) => {

    //find an update and update it
    let note=await Note.findById(req.params.id);
    if(!note){return res.status(404).send('Not found')}

    if(note.user.toString() !== req.user.id){
        return res.status(404).send('Not allowed')
    }
    note=await Note.findByIdAndDelete(req.params.id)
    res.json('Succsess: The note has been deleted');
})
module.exports = router