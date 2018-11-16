/* Reservations.js */ 
'use strict';

const log = console.log
const fs = require('fs');
const datetime = require('date-and-time')

const startSystem = () => {

	let status = {};

	try {
		status = getSystemStatus();
	} catch(e) {
		status = {
			numRestaurants: 0,
			totalReservations: 0,
			currentBusiestRestaurantName: null,
			systemStartTime: new Date(),
		}

		fs.writeFileSync('status.json', JSON.stringify(status))
	}

	return status;
}

const getSystemStatus = () => {
	const status = fs.readFileSync('status.json')
	return JSON.parse(status)
}

/*********/

/* Helper functions to save JSON */
const updateSystemStatus = () => {
	const status = {}
	
	/* Add your code below */

	fs.writeFileSync('status.json', JSON.stringify(status))
}

const saveRestaurantsToJSONFile = (restaurants) => {
	/* Add your code below */

};

const saveReservationsToJSONFile = (reservations) => {
	/* Add your code below */

};

/*********/

// Should return an array
const addRestaurant = (name, description) => {
	// Check for duplicate names

	return [];

	// if no duplicate names:
	const restaurant = null;


	return [restaurant];

}

const addReservation = (restaurant, time, people) => {
	
	/* Add your code below */
	const reservation = null;
	return reservation;

}


/// Getters - use functional array methods when possible! ///

// Should return an array - check to make sure restaurants.json exists
const getAllRestaurants = () => {
	/* Add your code below */
};


const getRestaurtantByName = (name) => {
	/* Add your code below */
};

// Should return an array - check to make sure reservations.json exists
const getAllReservations = () => {
  /* Add your code below */
};

// Should return an array
const getAllReservationsForRestaurant = (name) => {
	/* Add your code below */
};


// Should return an array
const getReservationsForHour = (time) => {
	/* Add your code below */
}


const checkOffEarliestReservation = (restaurantName) => {
	
	const checkedOffReservation = null;
 	return checkedOffReservation;
}


const addDelayToReservations = (restaurant, minutes) => {
	// Hint: try to use array.map()
	
}

startSystem(); // start the system to create status.json (should not be called in app.js)

// May not need all of these in app.js..but they're here.
module.exports = {
	addRestaurant,
	getSystemStatus,
	getRestaurtantByName,
	getAllRestaurants,
	getAllReservations,
	getAllReservationsForRestaurant,
	addReservation,
	checkOffEarliestReservation,
	getReservationsForHour,
	addDelayToReservations
}
