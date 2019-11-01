const express = require('express');
const Projects = require('../data/helpers/projectModel');
const Actions = require('../data/helpers/actionModel');

const router = express.Router();

// Create a new Project
// router.post('/', (req, res) => {

// });

// Get all projects

router
    .get('/:id', (req, res) => {
        return res.status(200).json(req.project)
});

module.exports = router;