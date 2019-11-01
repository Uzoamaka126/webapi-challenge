const express = require('express');
const Projects = require('../data/helpers/projectModel');
const Actions = require('../data/helpers/actionModel');

const router = express.Router();

// Create a new Action
router.post('/', (req, res) => {
    const newAction = {
        description: req.body.description,
        notes: req.body.notes,
        completed: req.body.completed,

    };
    Actions.insert(newAction)
        .then(data => {
            console.log(data);
            res.status(201).json(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'An error occured'
            });
        });
});

// Get a specific action
router
    .get('/:id', validateActionId, (req, res) => {
        return res.status(200).json(req.action)
});




function validateActionId(req, res, next) {
    const { id } = req.params;
    if(Number(id) == id) {
        Actions.getById(id)
        .then(action => {
            if(action) {
                req.action = action;
                next()
            } else {
                res.status(400).json({
                    message: 'Invalid project id'
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Something came up when we were checking the project id' + error.message,
            });
        });
    } else {
        return res.status(400).json({
            message: 'This id format is wrong'
        })
    }
}

function validateAction(req, res, next) {
    if (!Object.keys(req.body).length) {
        return res.status(400).json({
            message: 'Missing project data'
        })
    }  
    next();
}

module.exports = router;