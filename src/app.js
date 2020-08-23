const express = require("express");
const cors = require("cors");

const {
  uuid,
  isUuid
} = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];

// Middlewares
function validateId(request, response, next) {
  const {
    id
  } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({
      error: 'Invalid id'
    })
  }

  return next();
}

function verifyIfExistRepository(request, response, next) {
  const {
    id
  } = request.params;

  const repository = repositories.find(el => el.id === id);

  if (!repository) {
    return response.status(400).json({
      error: 'Repository not found!'
    })
  }

  return next();
}

app.get("/repositories", (request, response) => {
  response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const {
    title,
    url,
    techs
  } = request.body;

  const newObject = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(newObject);

  return response.json(newObject);
});

app.put("/repositories/:id", validateId, verifyIfExistRepository, (request, response) => {
  const {
    title,
    url,
    techs
  } = request.body;
  const {
    id
  } = request.params;

  const index = repositories.findIndex(el => el.id === id);

  repositories = repositories.map((repository, key) => {
    if (key === index) {
      return {
        title,
        url,
        techs,
        id: repository.id,
        likes: repository.likes
      }
    }
    return repository
  })

  return response.json(repositories[index])
});

app.delete("/repositories/:id", validateId, verifyIfExistRepository, (request, response) => {
  const {
    id
  } = request.params;

  repositories = repositories.filter(el => el.id !== id);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateId, verifyIfExistRepository, (request, response) => {
  const {
    id
  } = request.params;

  const index = repositories.findIndex(el => el.id === id);

  repositories[index].likes++;

  return response.json({
    likes: repositories[index].likes
  })
});

module.exports = app;