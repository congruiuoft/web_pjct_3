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
	let status = getSystemStatus();
	
	/* Add your code below */
	const allRestaurants = getAllRestaurants();
	const allReservations = getAllReservations();
	let curBusiestRestaurantName = '';
	let maxResCount = 0;
	let ResCount_i = 0;
	for (let i = 0; i < allRestaurants.length; i++) {
		ResCount_i = allRestaurants[i].numReservations;
		if (ResCount_i > maxResCount){
			maxResCount = ResCount_i;
			curBusiestRestaurantName = allRestaurants[i].name;
		}
	}
	status.numRestaurants = allRestaurants.length;
	status.totalReservations = allReservations.length;
	status.currentBusiestRestaurantName = curBusiestRestaurantName;

	fs.writeFileSync('status.json', JSON.stringify(status))
}

const saveRestaurantsToJSONFile = (restaurants) => {
	/* Add your code below */
	
	if (restaurants.length > 0){
		fs.writeFileSync('restaurants.json', JSON.stringify(restaurants))
	}
	else{
		fs.writeFileSync('restaurants.json', JSON.stringify([]))
	}

};

const saveReservationsToJSONFile = (reservations) => {
	/* Add your code below */
	if (reservations.length > 0){
		fs.writeFileSync('reservations.json', JSON.stringify(reservations))
	}
	else{
		fs.writeFileSync('reservations.json', JSON.stringify([]))
	}
};

/*********/

// Should return an array
const addRestaurant = (name, description) => {
	// Check for duplicate names
    let allRestaurants = getAllRestaurants();
    let duplicate_name_found = 0;
	for (let i = 0; i < allRestaurants.length; i++) {
		if (allRestaurants[i].name == name){
			duplicate_name_found = 1;
			break;
		}
	}
	if (duplicate_name_found == 1){
		return [];
	}
	

	// if no duplicate names:
	const restaurant = {
		name: name,
		description: description,
		numReservations: 0,
	};
	allRestaurants.push(restaurant);
    saveRestaurantsToJSONFile(allRestaurants);
	return [restaurant];

}

const addReservation = (restaurant, time, people) => {
	
	/* Add your code below */
	let currentAllReservations = getAllReservations();
	const reservation = {
		restaurant: restaurant,
		time: datetime.parse(time, 'MMM D YYYY HH:mm:ss'),
		people: people,
	};
	currentAllReservations.push(reservation);
    saveReservationsToJSONFile(currentAllReservations);
	let allRestaurants = getAllRestaurants();
	for (let i = 0; i < allRestaurants.length; i++) {
		if (allRestaurants[i].name == restaurant){
			allRestaurants[i].numReservations++;
		}
	}
    saveRestaurantsToJSONFile(allRestaurants);
	return reservation;

}


/// Getters - use functional array methods when possible! ///

// Should return an array - check to make sure restaurants.json exists
const getAllRestaurants = () => {
	/* Add your code below */
	if (fs.existsSync('restaurants.json')) {
		const restaurants = fs.readFileSync('restaurants.json');
		return JSON.parse(restaurants);
	}
	else{
		return [];
	}

};


const getRestaurtantByName = (name) => {
	/* Add your code below */
	const allRestaurants = getAllRestaurants();
	for (let i = 0; i < allRestaurants.length; i++) {
		if (allRestaurants[i].name == name){
			return allRestaurants[i]
		}
	}
};

// Should return an array - check to make sure reservations.json exists
const getAllReservations = () => {
    /* Add your code below */
	if (fs.existsSync('reservations.json')) {
		const reservations = fs.readFileSync('reservations.json');
		return JSON.parse(reservations);
	}
	else{
		return [];
	}
};

// Should return an array
const getAllReservationsForRestaurant = (name) => {
	/* Add your code below */
	let targetReservations = [];
	const allReservations = getAllReservations();
	for (let i = 0; i < allReservations.length; i++) {
		if (allReservations[i].restaurant == name){
			targetReservations.push(allReservations[i]);
		}
	}

	return targetReservations;
};


// Should return an array
const getReservationsForHour = (time) => {
	/* Add your code below */
	let parsedTime = datetime.parse(time, 'MMM D YYYY HH:mm:ss'); 
	let targetReservations = [];
	const nextHour = datetime.addHours(parsedTime, 1);
	const allReservations = getAllReservations();
	for (let i = 0; i < allReservations.length; i++) {
        let allReservationsItime = new Date();
		allReservationsItime = datetime.parse(allReservations[i].time, "YYYY-MM-DD HH:mm:ss.SSSZ", true);
		if (datetime.subtract(allReservationsItime, parsedTime).toSeconds() > 0 ){
			if (datetime.subtract(nextHour, allReservationsItime).toSeconds() > 0 ){
				targetReservations.push(allReservations[i]);
			}			
		}
	}
	return targetReservations;

}


const checkOffEarliestReservation = (restaurantName) => {
	
	let checkedOffReservation = null;
	const allReservations4Restaurant = getAllReservationsForRestaurant(restaurantName);

	let latestTime = new Date();
	latestTime = datetime.addYears(latestTime,9999);
	for (let i = 0; i < allReservations4Restaurant.length; i++) {
        let allReservations4RestaurantItime = new Date();
		allReservations4RestaurantItime = datetime.parse(allReservations4Restaurant[i].time, "YYYY-MM-DD HH:mm:ss.SSSZ", true);
		if (datetime.subtract(latestTime, allReservations4RestaurantItime).toSeconds() > 0){
			checkedOffReservation = allReservations4Restaurant[i];
			latestTime = allReservations4RestaurantItime;						
		}
	}
    let index_to_remove = null;
    let allReservations = getAllReservations();

	for (let i = 0; i < allReservations.length; i++) {
		if (allReservations[i].restaurant == checkedOffReservation.restaurant){
			if(allReservations[i].time == checkedOffReservation.time){
				if(allReservations[i].people == checkedOffReservation.people){
					index_to_remove = i;
					break;
				}
			}	
		}
	}
    allReservations.splice(index_to_remove, 1);
    saveReservationsToJSONFile(allReservations);

	let allRestaurants = getAllRestaurants();
	for (let i = 0; i < allRestaurants.length; i++) {
		if (allRestaurants[i].name == restaurantName){
			allRestaurants[i].numReservations--;
		}
	}
    saveRestaurantsToJSONFile(allRestaurants);
 	return checkedOffReservation;
}


const addDelayToReservations = (restaurant, minutes) => {
	// Hint: try to use array.map()
	let allReservations = getAllReservations();
	for (let i = 0; i < allReservations.length; i++) {
		if (allReservations[i].restaurant == restaurant){
			allReservations[i].time = datetime.addMinutes(allReservations[i].time,minutes);
		}
	}
    saveReservationsToJSONFile(allReservations);
 	return allReservations;

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
