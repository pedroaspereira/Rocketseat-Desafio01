const express = require('express')
const server = express()

server.use(express.json());
//Array
const projects = []

let requisitionLog = 0

function checkIfIdExists (req, res, next) {
  const { id } = req.params
  const project = projects.find(project => project.id == id)

  if(!project) {
    return res.status(400).json({ error: 'Project does not exist' })
  }

  return next()
}

function requisitionLogs (req, res, next) {
  requisitionLog++

  console.log(`Requisicoes efetuadas: ${requisitionLog}`)

  return next()
}

server.use(requisitionLogs)

//List Projects
server.get('/projects', (req, res) => {
  return res.json(projects)
})

//Search Project
server.get('/projects/:id', checkIfIdExists, (req, res) => {
  const { id } = req.params

  const index = projects.findIndex(project => project.id == id)

  return res.json(projects[index])
})

//Create Project
server.post('/projects', (req, res) => {
  const { id, title } = req.body

  const project = {
    id,
    title,
    tasks: [],
  }

  projects.push(project)

  return res.json(project)
})

//Edit project
server.put('/projects/:id', checkIfIdExists, (req, res) => {
  const { id } = req.params
  const { title } = req.body

  const project = projects.find(project => project.id == id)
  
  project.title = title
    
  return res.json(projects)
})

//Delete Project
server.delete('/projects/:id', checkIfIdExists, (req, res) => {
  const { id } = req.params

  const index = projects.findIndex(project => project.id == id)
  projects[index] = { ...projects[index], title: req.body.title }

  projects.splice(index, 1)
  return res.send()
})

//Create Task
server.post('/projects/:id/tasks', (req, res) => {
  const { id } = req.params
  const { tasks } = req.body

  const project = projects.find(project => project.id == id)
  
  project.tasks.push(tasks)
    
  return res.json(projects)
})


server.listen(3000)