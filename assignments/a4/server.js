/* E4 server.js */
'use strict';
const log = console.log;

const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')

// Mongoose
const { mongoose } = require('./db/mongoose');
const { Restaurant } = require('./models/restaurant')

// Express
const port = process.env.PORT || 3000
const app = express();
app.use(bodyParser.json());

/// Route for adding restaurant, with *no* reservations (an empty array).
/*
Request body expects:
{
	"name": <restaurant name>
	"description": <restaurant description>
}
Returned JSON should be the database document added.
*/
// POST /restaurants
app.post('/restaurants', (req, res) => {
  // Add code here
  const rest = new Restaurant({
    name: req.body.name,
    description: req.body.description,
    reservations: []
  });

  // Save the new restaurant to the database
  rest.save().then((result) => {
    res.status(200).send(result);

  }, (error) => {
    // Bad Request
    // This response means that server could not understand the request due to invalid syntax.
    res.status(400).send(error);

  }).catch(error => {
    res.status(500).send(error);
  });

});


/// Route for getting all restaurant information.
// GET /restaurants
app.get('/restaurants', (req, res) => {
	// Add code here
  Restaurant.find().then((restaurant) => {
    res.send(restaurant);
  }, (error) => {
    res.status(400).send(error);

  }).catch(error => {
    res.status(500).send(error);
  });

});


/// Route for getting information for one restaurant.
// GET /restaurants/id
app.get('/restaurants/:id', (req, res) => {
	// Add code here
  const id = req.params.id;
  // log(req.params);

  if (ObjectID.isValid(id)) {
    Restaurant.findById(id).then((restaurant) => {
      if (!restaurant) { // if rest === null?
        // 404: Not Found
        // Server cannot find request
        res.status(404).send();
      } else {
        res.send(restaurant);
      }
    }, (error) => {
      res.status(404).send(error);

    }).catch(error => {
      res.status(500).send(error);
    });
  }
});


/// Route for adding reservation to a particular restaurant.
/*
Request body expects:
{
	"time": <time>
	"people": <number of people>
}
*/
// Returned JSON should have the restaurant database
//   document that the reservation was added to, AND the reservation subdocument:
//   { "reservation": <reservation subdocument>, "restaurant": <entire restaurant document>}
// POST /restaurants/id
app.post('/restaurants/:id', (req, res) => {
  // Add code here
  // Check if it's a valid id first
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  }

  const reservation = {
    time: req.body.time,
    people: req.body.people
  };

  const update = {
    "$push": { reservations: reservation }
  }

  const options = {
    new: true
  }

  Restaurant.findByIdAndUpdate(id, update, options).then(restaurant => {
    if (!restaurant) {
      res.status(404).send();
    } else {
      res.send({ reservation, restaurant });
    }

  }).catch(error => {
    res.status(500).send(error);
  });
});


/// Route for getting information for one reservation of a restaurant (subdocument)
// GET /restaurants/id
app.get('/restaurants/:id/:resv_id', (req, res) => {
  // Add code here
  // Check validity first
  const restID = req.params.id;
  const resvID = req.params.resv_id;
  if (!ObjectID.isValid(restID) || !ObjectID.isValid(resvID)) {
    res.status(404).send();
  }

  // Now request is valid, so should not be 404 or 400
  Restaurant.findById(restID).then(rest => {
    if (!rest) {
      res.status(404).send();

    } else {
      // Find the reservation
      if (rest.reservations.id(resvID) === null) {
        res.status(404).send();

      } else {
        res.send(rest.reservations.id(resvID))
      }
    }
  }).catch(error => {
    res.status(500).send(error);
  });
});


/// Route for deleting reservation
// Returned JSON should have the restaurant database
//   document from which the reservation was deleted, AND the reservation subdocument deleted:
//   { "reservation": <reservation subdocument>, "restaurant": <entire restaurant document>}
// DELETE restaurant/<restaurant_id>/<reservation_id>
app.delete('/restaurants/:id/:resv_id', (req, res) => {
	// Add code here
  const restID = req.params.id;
  const resvID = req.params.resv_id;

  if (!ObjectID.isValid(restID) || !ObjectID.isValid(resvID)) {
    res.status(404).send();
  }

  const update = {
    $pull: { reservations: {_id: resvID} }
  }

  const options = {
    new: true
  }

  Restaurant.findById(restID).then(rest => {
    if (!rest) {
      res.status(404).send();
    }

    const reservation = rest.reservations.id(resvID);
    if (reservation === null) {
      res.status(404).send();
    }

    Restaurant.findByIdAndUpdate(restID, update, options).then(restaurant => {

      if (!restaurant) {
        res.status(400).send();
      }

      res.send({ reservation, restaurant });

    }).catch(error => {
      res.status(404).send(error);
    });

  }).catch(error => {
    res.status(500).send(error);
  });
});


/// Route for changing reservation information
/*
Request body expects:
{
	"time": <time>
	"people": <number of people>
}
*/
// Returned JSON should have the restaurant database
//   document in which the reservation was changed, AND the reservation subdocument changed:
//   { "reservation": <reservation subdocument>, "restaurant": <entire restaurant document>}
// PATCH restaurant/<restaurant_id>/<reservation_id>
app.patch('/restaurants/:id/:resv_id', (req, res) => {
  // Add code here
  const restID = req.params.id;
  const resvID = req.params.resv_id;

  if (!ObjectID.isValid(restID) || !ObjectID.isValid(resvID)) {
    res.status(404).send();
  }

  const reservation = {
    time: req.body.time,
    people: req.body.people
  }

  const query = {
    "_id": restID,
    "reservations._id": resvID
  }

  const update = {
    $set: {
      "reservations.$": reservation
    }
  }

  const options = {
    new: true
  }

  Restaurant.findOneAndUpdate(query, update, options).then(restaurant => {
    if (!restaurant) {
      res.status(404).send();
    }

    res.send({ reservation, restaurant });

  }).catch(error => {
    res.status(404).send(error);
  });
});



/** Start server */
app.listen(port, () => {
	log(`Listening on port ${port}...`);
});
