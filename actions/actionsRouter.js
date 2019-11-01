const express = require('express');
const Projects = require('../data/helpers/projectModel');
const Actions = require('../data/helpers/actionModel');

const router = express.Router();

// Create a new Action
router.post('/', validateAction, (req, res) => {
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

router.delete(':/id', validateProjectId, validateActionId, (req, res) => {
    Actions.remove(req.action.id)
    .then(() => {
        res.status(200).json({
            message: "This project has been deleted"
        })
    })
    .catch(error => {
        res.status(500).json({
            message: "Error deleting project"
        })
    })
});

router.put('/:id', validateProjectId, validateActionId, (req, res) => {
    Actions.update(req.action.id, req.body)
    .then(project => {
        res.status(200).json(project);
    })
    .catch(error => {
        res.status(500).json({
            message: "Error updating project"
        })
    })
})

function validateProjectId(req, res, next) {
    const { id } = req.params;
    if(Number(id) == id) {
        Projects.getById(id)
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