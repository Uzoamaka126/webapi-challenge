const express = require('express');
const Projects = require('../data/helpers/projectModel');
const actions = require('../data/helpers/actionModel');

const router = express.Router();

router.use((req, res, next) => {
    console.log('SOMETHING CAME INTO THE HUBS ROUTER!!!!!!!!');
    next();
});

// Create a new Project
router.post('/', validateProject, (req, res) => {
    const newProject = {
        name: req.body.name,
        description: req.body.description,
        completed: req.body.completed
    };
    Projects.insert(newProject)
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

router.get('/', (req, res) => {
    Projects
        .get(req.query)
        .then(projects => {
            return res.status(200).json(projects);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving all projects'
            });
        });
});

// Get a particular project by id --done!
router
    .get('/:id', validateProjectId, (req, res) => {
        return res.status(200).json(req.project);
});

// Get all actions from a particular project
router
    .get('/:id/actions', validateProjectId, (req, res) => {
        Projects.getProjectActions(req.project.id)
        .then(actions => {
            return res.status(200).json(actions)
        })
    
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: 'Error getting actions from the projects'
        });
    });
})

router.delete("/:id", validateProjectId, (req, res) => {
    Projects.remove(req.project.id)
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

router.put('/:id', validateProjectId, (req, res) => {
    Projects.update(req.project.id, req.body)
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
        .then(project => {
            if(project) {
                req.project = project;
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

function validateProject(req, res, next) {
    if (!Object.keys(req.body).length) {
        return res.status(400).json({
            message: 'Missing project data'
        })
    }  
    next();
}

module.exports = router;