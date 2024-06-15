const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchUser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');


//Get all the notes: GET "/api/notes/fetchallnotes" .  ========== ROUTE 1 ========================
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured. Try again!");
    }
})

//Add new notes: POST "/api/notes/addnotes" .  ========== ROUTE 2 ========================
router.post('/addnote', fetchuser,
    [
        body('title', 'Enter a valid Title').isLength({ min: 3 }),
        body('description', 'Description must be atleast 5 character').isLength({ min: 5 }),
    ], async (req, res) => {

        //Returning bad request of error after validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            //adding new notes
            const {title,description,tag} = req.body;
            const note = new Notes({
                title,description,tag,user: req.user.id
            })

            //saving notes
            const savedNote = await note.save();
            res.json(savedNote);
        } catch (error) {
            //handlling  error
            console.error(error.message);
            res.status(500).send("Internal server error occured. Try again!");
        }
    })


//Update an existing notes: Put "/api/notes/updatenotes" .  ========== ROUTE 3 ========================
router.put('/updatenotes/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //Create a new note object 
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //Find teh note and update it
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") };

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    } catch (error) {
        //handlling  error
        console.error(error.message);
        res.status(500).send(`Internal server error occured. Try again! . Message: ${error}`);
    }

})


//Delete an existing notes: Delete "/api/notes/deletenotes" .  ========== ROUTE 4 ========================
router.delete('/deletenotes/:id', fetchuser, async (req, res) => {
    try {
        //Find the note  delete it
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") };

        //Allow delete only when use is loged in 
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been delted", note: note });
    } catch (error) {
        //handlling  error
        console.error(error.message);
        res.status(500).send("Internal server error occured. Try again!");
    }

})



module.exports = router;