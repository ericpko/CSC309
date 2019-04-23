/* Reservations.js */
'use strict';

// import fs from 'fs';
// import datetime from 'date-and-time';

const log = console.log;
const fs = require('fs');
const datetime = require('date-and-time');

const startSystem = () => {

  let status = {};

  try {
    status = getSystemStatus();
  } catch (e) {
    status = {
      numRestaurants: 0,
      totalReservations: 0,
      currentBusiestRestaurantName: null,
      systemStartTime: new Date(),
    };

    fs.writeFileSync('status.json', JSON.stringify(status));
  }

  return status;
};

/*********/


// You may edit getSystemStatus below.  You will need to call updateSystemStatus() here, which will write to the json file
const getSystemStatus = () => {
  updateSystemStatus();
  const status = fs.readFileSync('status.json').toString();

  return JSON.parse(status);
};

/* Helper functions to save JSON */
const updateSystemStatus = () => {
  /* Add your code below */
  // const status = {};

  // Get the current restaurants and reservations
  const restaurants = getAllRestaurants();
  const reservations = getAllReservations();
  let numReservs = 0;
  let busiestRest = null;

  // Update the status JSON
  restaurants.forEach((restaurant) => {
    if (restaurant.numReservations > numReservs) {
      numReservs = restaurant.numReservations;
      busiestRest = restaurant.name;
    }
  });
  // We don't want to update systemStartTime
  const status = JSON.parse(fs.readFileSync('status.json').toString());
  status.numRestaurants = restaurants.length;
  status.totalReservations = reservations.length;
  status.currentBusiestRestaurantName = busiestRest;

  try {
    fs.writeFileSync('status.json', JSON.stringify(status));
  } catch (e) {
    console.log("Error", e.stack);
    console.log("Error", e.name);
    console.log("Error", e.message);
  }
};

const saveRestaurantsToJSONFile = (restaurants) => {
  /* Add your code below */
  try {
    fs.writeFileSync('restaurants.json', JSON.stringify(restaurants));
  } catch (e) {
    console.log("Error", e.stack);
    console.log("Error", e.name);
    console.log("Error", e.message);
  }
};

const saveReservationsToJSONFile = (reservations) => {
  /* Add your code below */
  try {
    fs.writeFileSync('reservations.json', JSON.stringify(reservations));
  } catch (e) {
    console.log("Error", e.stack);
    console.log("Error", e.name);
    console.log("Error", e.message);
  }
};

/*********/

// Should return an array of length 0 or 1.
const addRestaurant = (name, description) => {
  // Check for duplicate names
  // Check 1:
  // const restNames = getAllRestaurants().map(rest => rest.name);
  // if (restNames.length !== new Set(restNames).size) {
  //   // Then there are duplicates
  //   return [];
  // }
  // Check 2:
  const restaurants = getAllRestaurants();
  if (restaurants.filter(rest => rest.name === name).length > 0) {
    return [];
  }

  // if no duplicate names:
  const restaurant = {
    "name": name,
    "description": description,
    "numReservations": 0
  };

  // Save the new restaurant
  restaurants.push(restaurant);
  saveRestaurantsToJSONFile(restaurants);
  return [restaurant];
};

// should return the added reservation object
const addReservation = (restaurant, time, people) => {

  /* Add your code below */
  const reservation = {
    "restaurant": restaurant,
    "time": datetime.parse(time, "MMM DD YYYY hh:mm:ss"),
    "people": people
  };

  // Save the new reservations
  const reservations = getAllReservations();
  reservations.push(reservation);
  saveReservationsToJSONFile(reservations);

  // Update the number of reservations for this restaurant
  const restaurants = getAllRestaurants();
  const index = restaurants.findIndex(rest => rest.name === restaurant);
  restaurants[index].numReservations++;
  saveRestaurantsToJSONFile(restaurants);
  // fs.writeFileSync('restaurants.json', restaurants);

  return reservation;
};


/// Getters - use functional array methods when possible! ///

// Should return an array - check to make sure restaurants.json exists
const getAllRestaurants = () => {
  /* Add your code below */
  try {
    const restaurants = fs.readFileSync('restaurants.json');
    return JSON.parse(restaurants);

  } catch (e) {
    return [];
  }
};

// Should return the restaurant object if found, or an empty object if the restaurant is not found.
const getRestaurantByName = (name) => {
  /* Add your code below */
  const restaurants = getAllRestaurants().filter(rest => rest.name === name);
  if (restaurants.length === 0) {
    return {};
  }

  return restaurants[0];  // They are unique, so should only be one entry
};

// Should return an array - check to make sure reservations.json exists
const getAllReservations = () => {
  /* Add your code below */
  try {
    let reservations = fs.readFileSync('reservations.json');
    // log(JSON.parse(reservations));
    // Date is still messed up
    reservations = JSON.parse(reservations).map((resv) => ({
      restaurant: resv.restaurant,
      time: new Date(resv.time),
      people: resv.people
    }));

    return reservations;

  } catch (e) {
    return [];
  }
};

// Should return an array
const getAllReservationsForRestaurant = (name) => {
  /* Add your code below */
  const reservations = getAllReservations().filter(reserv => reserv.restaurant === name);
  return reservations.sort((resv1, resv2) => resv1.time - resv2.time);
};


// Should return an array
const getReservationsForHour = (time) => {
  /* Add your code below */
  const startTime = datetime.parse(time, "MMM D YYYY hh:mm:ss");
  const endTime = datetime.addHours(startTime, 1);
  const reservations = getAllReservations().filter((resv) => {
    return resv.time >= startTime && resv.time <= endTime;
  });

  return reservations.sort((resv1, resv2) => resv1.time - resv2.time);
};

// should return a reservation object
const checkOffEarliestReservation = (restaurantName) => {

  const checkedOffReservation = getAllReservationsForRestaurant(restaurantName)[0];
  const reservations = getAllReservations().filter(resv => resv !== checkedOffReservation);
  saveReservationsToJSONFile(reservations);

  // Update the restaurants
  const restaurants = getAllRestaurants();
  const index = restaurants.findIndex(rest => rest.name === restaurantName);
  restaurants[index].numReservations--;
  saveRestaurantsToJSONFile(restaurants);


  return checkedOffReservation;
};


const addDelayToReservations = (restaurant, minutes) => {
  // Hint: try to use a functional array method

  const delayed = getAllReservations().map(resv => {
    // log(resv.time);

    if (resv.restaurant === restaurant) {
      resv.time = new Date(resv.time);
      // let date2 = new Date(resv.time);
      // resv.time.setMinutes(date2.getMinutes() + minutes);
      resv.time = datetime.addMinutes(resv.time, minutes);

      return resv;

    } else {
      resv.time = new Date(resv.time);
      return resv;
    }
  });
  saveReservationsToJSONFile(delayed);

  return getAllReservationsForRestaurant(restaurant).sort((resv1, resv2) => resv1.time - resv2.time);
};











startSystem(); // start the system to create status.json (should not be called in app.js)

// May not need all of these in app.js..but they're here.
module.exports = {
  addRestaurant,
  getSystemStatus,
  getRestaurantByName,
  getAllRestaurants,
  getAllReservations,
  getAllReservationsForRestaurant,
  addReservation,
  checkOffEarliestReservation,
  getReservationsForHour,
  addDelayToReservations
};
