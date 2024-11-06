const express = require('express');
const router = express.Router();
const axios = require('axios');

const jiraBaseUrl = process.env.JIRA_BASE_URL;
const jiraEmail = process.env.JIRA_EMAIL;
const jiraApiToken = process.env.JIRA_API_TOKEN;
const authHeader = {
    'Authorization': `Basic ${Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString('base64')}`,
    'Content-Type': 'application/json'
};


app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Home route with buttons for different Jira actions
router.get('/', (req, res) => {
    res.render('layout', { data: null, error: null, view: 'home' });
});

// Route to fetch all projects
router.post('/projects', async (req, res) => {
    try {
        const response = await axios.get(`${jiraBaseUrl}/rest/api/3/project`, { headers: authHeader });
        res.render('layout', { data: response.data, error: null, view: 'projects' });
    } catch (error) {
        res.render('layout', { data: null, error: 'Failed to fetch projects.', view: 'home' });
    }
});

// Route to fetch sprints of a specific project
router.post('/sprints', async (req, res) => {
    const projectId = req.body.projectId;
    try {
        const response = await axios.get(`${jiraBaseUrl}/rest/agile/1.0/board/${projectId}/sprint`, { headers: authHeader });
        res.render('layout', { data: response.data, error: null, view: 'sprints' });
    } catch (error) {
        res.render('layout', { data: null, error: 'Failed to fetch sprints.', view: 'home' });
    }
});

// Route to fetch current sprint of a project
router.post('/current-sprint', async (req, res) => {
    const boardId = req.body.boardId;
    try {
        const response = await axios.get(`${jiraBaseUrl}/rest/agile/1.0/board/${boardId}/sprint`, { headers: authHeader });
        const activeSprint = response.data.values.find(sprint => sprint.state === 'active');
        res.render('layout', { data: activeSprint, error: null, view: 'current-sprint' });
    } catch (error) {
        res.render('layout', { data: null, error: 'Failed to fetch current sprint.', view: 'home' });
    }
});

// Route to fetch issues in the current sprint
router.post('/sprint-issues', async (req, res) => {
    const sprintId = req.body.sprintId;
    try {
        const response = await axios.get(`${jiraBaseUrl}/rest/agile/1.0/sprint/${sprintId}/issue`, { headers: authHeader });
        res.render('layout', { data: response.data.issues, error: null, view: 'sprint-issues' });
    } catch (error) {
        res.render('layout', { data: null, error: 'Failed to fetch sprint issues.', view: 'home' });
    }
});

// Route to fetch issues assigned to the current user
router.post('/assigned-issues', async (req, res) => {
    const sprintId = req.body.sprintId;
    try {
        const response = await axios.get(`${jiraBaseUrl}/rest/agile/1.0/sprint/${sprintId}/issue`, { headers: authHeader });
        const assignedIssues = response.data.issues.filter(issue => issue.fields.assignee && issue.fields.assignee.emailAddress === jiraEmail);
        res.render('layout', { data: assignedIssues, error: null, view: 'assigned-issues' });
    } catch (error) {
        res.render('layout', { data: null, error: 'Failed to fetch assigned issues.', view: 'home' });
    }
});

// Route to fetch unassigned issues
router.post('/unassigned-issues', async (req, res) => {
    const sprintId = req.body.sprintId;
    try {
        const response = await axios.get(`${jiraBaseUrl}/rest/agile/1.0/sprint/${sprintId}/issue`, { headers: authHeader });
        const unassignedIssues = response.data.issues.filter(issue => !issue.fields.assignee);
        res.render('layout', { data: unassignedIssues, error: null, view: 'unassigned-issues' });
    } catch (error) {
        res.render('layout', { data: null, error: 'Failed to fetch unassigned issues.', view: 'home' });
    }
});

module.exports = router;
