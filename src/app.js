const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const { title, url, techs } = request.body;

  const index = findIndexById(id);

  if( index < 0 ){
    return response.status(400).send();
  }

  const repository = { ...repositories[index], title, url, techs }
  
  repositories[index] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const index = findIndexById(id);

  if( index < 0 ) {
    return response.status(400).send();
  }

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = findById(id);

  if(!repository) {
    return response.status(400).send();
  }

  repository.likes += 1;

  return response.json(repository);

});

const findById = (id) => repositories.find(repositorie => repositorie.id === id);
const findIndexById = (id) => repositories.findIndex(repositorie => repositorie.id === id);

module.exports = app;