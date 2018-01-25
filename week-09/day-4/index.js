'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use('/assets', express.static('./assets'));

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/doubling', function (req, res) {
  if (req.query.input === undefined) {
    res.json(
      {
        error: 'Please provide an input!'
      }
    );
  } else {
    res.json(
      {
        received: req.query.input,
        result: req.query.input * 2
      }
    );
  }
});

app.get('/greeter', function (req, res) {
  const name = req.query.name;
  const title = req.query.title;
  if (name === undefined) {
    res.json(
      {
        error: 'Please provide a name!'
      }
    );
  } else if (title === undefined) {
    res.json(
      {
        error: 'Please provide a title!'
      }
    );
  }
  else {
    res.json(
      {
        welcome_message: `Oh, hi there ${name}, my dear ${title}!`
      }
    );
  }
});

app.get('/appenda/:appendable', function (req, res) {
  const appendable = req.params.appendable;
  if (appendable !== undefined) {
  res.json(
    {
      appended: `${appendable}a`
    }
  );
}
  else {
    {
      res.status(404);
    }
  }
});

app.post('/appenda/:appendable', function (req, res) {
  const appendable = req.params.appendable;
  if (appendable !== undefined) {
  res.json(
    {
      appended: `${appendable}a`
    }
  );
}
  else {
    {
      res.status(404);
    }
  }
});

app.listen(8080, function () {
  console.log('app is running');
});