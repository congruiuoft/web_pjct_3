/* E3 app.js */
'use strict';

const log = console.log
const datetime = require('date-and-time');
const yargs = require('yargs').option('addRest', {
    type: 'array' // Allows you to have an array of arguments for particular command
  }).option('addResv', {
    type: 'array' 
  }).option('addDelay', {
    type: 'array' 
  })

const reservations = require('./reservations');

const yargs_argv = yargs.argv
log(yargs_argv) // uncomment to see what is in the argument array

if ('addRest' in yargs_argv) {
	const args = yargs_argv['addRest']
	const rest = reservations.addRestaurant(args[0], args[1]);	
	if (rest.length > 0) {
		/* complete */ 
		log("Added restaurant "+args[0]+".");
	} else {
		/* complete */ 
		log("Duplicate restaurant not added.");
	}
}

if ('addResv' in yargs_argv) {
	const args = yargs_argv['addResv']
	const resv = reservations.addReservation(args[0], args[1], args[2]);

	// Produce output below
	log("Added reservation at "+args[0]+" on "+ datetime.format(resv.time, 'MMMM DD YYYY [at] hh:mm A')+ " for "+args[2]+" people.");
}

if ('allRest' in yargs_argv) {
	const restaurants = reservations.getAllRestaurants(); // get the array
	
	// Produce output below
	for(let i = 0; i < restaurants.length; i++) {
		log(restaurants[i].name+": "+restaurants[i].description+" - "+restaurants[i].numReservations+" active reservations");
	}
}

if ('restInfo' in yargs_argv) {
	const restaurants = reservations.getRestaurtantByName(yargs_argv['restInfo']);

	// Produce output below
	log(restaurants.name+": "+restaurants.description+" - "+restaurants.numReservations+" active reservations");
}

if ('allResv' in yargs_argv) {
	const restaurantName = yargs_argv['allResv']
	let reservationsForRestaurant = reservations.getAllReservationsForRestaurant(restaurantName); // get the arary
	
	// Produce output below

	log("Reservations for "+reservationsForRestaurant[0].restaurant+":");
	reservationsForRestaurant.sort(function(a, b) {
        let atime = new Date();
		let btime = new Date();
		atime = datetime.parse(a.time, "YYYY-MM-DD HH:mm:ss.SSSZ", true);
		btime = datetime.parse(b.time, "YYYY-MM-DD HH:mm:ss.SSSZ", true);
		if (datetime.subtract(atime, btime).toSeconds()>0){
			return 1
		}
		else{
			return -1
		}
	});
	for(let i = 0; i < reservationsForRestaurant.length; i++) {
		let curDate = new Date();
		curDate = datetime.parse(reservationsForRestaurant[i].time, "YYYY-MM-DD HH:mm:ss.SSSZ", true);
		log("- "+datetime.format(curDate, 'MMM. DD YYYY, h:mm A')+", table for "+reservationsForRestaurant[i].people);
	}
}

if ('hourResv' in yargs_argv) {
	const time = yargs_argv['hourResv']
	let all_reservations = reservations.getReservationsForHour(time); // get the arary
	
	// Produce output below
	log("Reservations in the next hour:");
	all_reservations.sort(function(a, b) {
        let atime = new Date();
		let btime = new Date();
		atime = datetime.parse(a.time, "YYYY-MM-DD HH:mm:ss.SSSZ", true);
		btime = datetime.parse(b.time, "YYYY-MM-DD HH:mm:ss.SSSZ", true);
		if (datetime.subtract(atime, btime).toSeconds()>0){
			return 1
		}
		else{
			return -1
		}
	});
	for(let i = 0; i < all_reservations.length; i++) {
		let curDate = new Date();
		curDate = datetime.parse(all_reservations[i].time, "YYYY-MM-DD HH:mm:ss.SSSZ", true);
		log(all_reservations[i].restaurant+": "+datetime.format(curDate, 'MMM[.] DD YYYY[,] h:mm A')+", table for "+all_reservations[i].people);
	}
}

if ('checkOff' in yargs_argv) {
	const restaurantName = yargs_argv['checkOff']
	const earliestReservation = reservations.checkOffEarlistReservation(restaurantName); 
	
	// Produce output below
	let curDate = new Date();
	curDate = datetime.parse(earliestReservation.time, "YYYY-MM-DD HH:mm:ss.SSSZ", true);
	log("Checked off reservation on "+datetime.format(curDate, 'MMM[.] DD YYYY[,] h:mm A')+", table for "+earliestReservation.people);
}

if ('addDelay' in yargs_argv) {
	const args = yargs_argv['addDelay']
	const resv = reservations.addDelayToReservations(args[0], args[1]);	

	// Produce output below
	log("Reservations for "+resv[0].restaurant+":");
	resv.sort(function(a, b) {
        let atime = new Date();
		let btime = new Date();
		atime = datetime.parse(a.time, "YYYY-MM-DD HH:mm:ss.SSSZ", true);
		btime = datetime.parse(b.time, "YYYY-MM-DD HH:mm:ss.SSSZ", true);
		if (datetime.subtract(atime, btime).toSeconds()>0){
			return 1
		}
		else{
			return -1
		}
	});
	for(let i = 0; i < resv.length; i++) {
		let curDate = new Date();
		curDate = datetime.parse(resv[i].time, "YYYY-MM-DD HH:mm:ss.SSSZ", true);
		log("- "+datetime.format(curDate, 'MMM[.] DD YYYY')+", table for "+resv[i].people);
	}
}

if ('status' in yargs_argv) {
	const status = reservations.getSystemStatus()

	// Produce output below
    log("Number of restaurants: "+status.numRestaurants.toString());
    log("Number of total reservations: "+status.totalReservations.toString());
    log("Busiest restaurant: "+status.currentBusiestRestaurantName);
    log("System started at: "+datetime.format(status.systemStartTime, 'MMM[.] DD YYYY[,] h:mm A'));
}

