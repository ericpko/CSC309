/* E3 app.js */
'use strict';

const log = console.log;
const yargs = require('yargs');
yargs.option('addRest', {
  type: 'array' // Allows you to have an array of arguments for particular command
}).option('addResv', {
  type: 'array'
}).option('addDelay', {
  type: 'array'
});

const reservations = require('./reservations');

// datetime available if needed
const datetime = require('date-and-time');

const yargs_argv = yargs.argv;
// log(yargs_argv); // uncomment to see what is in the argument array
// log(yargs_argv['hi']);

if ('addRest' in yargs_argv) {
  const args = yargs_argv['addRest'];
  const rest = reservations.addRestaurant(args[0], args[1]);
  if (rest.length > 0) {
    /* complete */
    log(`Added restaurant ${args[0]}.`);

  } else {
    /* complete */
    log(`Duplicate restaurant not added.`);

  }
}

if ('addResv' in yargs_argv) {
  const args = yargs_argv['addResv'];
  const resv = reservations.addReservation(args[0], args[1], args[2]);

  // Produce output below
  try {
    const date = datetime.format(resv.time, "MMM D YYYY at h:mm A");
    // log(date);
    log(`Added reservation at ${resv.restaurant} on ${date} for ${resv.people} people.`);
  } catch (e) {
    log("Error", e.stack);
    log("Error", e.name);
    log("Error", e.message);
  }

}

if ('allRest' in yargs_argv) {
  const restaurants = reservations.getAllRestaurants(); // get the array

  // Produce output below
  restaurants.forEach(rest => {
    log(`${rest.name}: ${rest.description} - ${rest.numReservations} active reservations`);
  });
}

if ('restInfo' in yargs_argv) {
  const rest = reservations.getRestaurantByName(yargs_argv['restInfo']);

  // Produce output below
  log(`${rest.name}: ${rest.description} - ${rest.numReservations} active reservations`);
}

if ('allResv' in yargs_argv) {
  const restaurantName = yargs_argv['allResv'];
  const reservationsForRestaurant = reservations.getAllReservationsForRestaurant(restaurantName); // get the array

  // Produce output below
  log(`Reservations for ${restaurantName}:`);
  reservationsForRestaurant.forEach((rest) => {
    let date = datetime.format(rest.time, "MMM D YYYY, h:mm A");
    return log(`- ${date}, table for ${rest.people}`);
  });
}

if ('hourResv' in yargs_argv) {
  const time = yargs_argv['hourResv']
  const reservationsForRestaurant = reservations.getReservationsForHour(time); // get the array

  // Produce output below
  log(`Reservations in the next hour:`);
  reservationsForRestaurant.forEach((rest) => {
    let date = datetime.format(rest.time, "MMM D YYYY, h:mm A");
    return log(`- ${rest.restaurant}: ${date}, table for ${rest.people}`);
  });
}

if ('checkOff' in yargs_argv) {
  const restaurantName = yargs_argv['checkOff'];
  const earliestReservation = reservations.checkOffEarliestReservation(restaurantName);

  // Produce output below
  const date = datetime.format(earliestReservation.time, "MMM D YYYY, h:mm A");
  log(`Checked off reservation on ${date}, table for ${earliestReservation.people}`);
}

if ('addDelay' in yargs_argv) {
  const args = yargs_argv['addDelay'];
  const resv = reservations.addDelayToReservations(args[0], args[1]);

  // Produce output below
  log(`Reservations for ${args[0]}:`);
  resv.forEach((rest) => {
    let date = datetime.format(rest.time, "MMM D YYYY, h:mm A");
    return log(`- ${date}, table for ${rest.people}`);
  });
}

if ('status' in yargs_argv) {
  const status = reservations.getSystemStatus();

  // Produce output below
  log(`Number of restaurants: ${status.numRestaurants}`);
  log(`Number of total reservations: ${status.totalReservations}`);
  log(`Busiest restaurant: ${status.currentBusiestRestaurantName}`);
  const date = datetime.format(new Date(status.systemStartTime), "MMM D, YYYY, h:mm A");
  log(`System stated at: ${date}`);
}
