import {MongoClient} from 'mongodb';
import config from './config';
import * as _ from 'lodash';

function connectDB() {
	return new Promise((resolve: any, reject: any) => {
		MongoClient.connect(config.mongoURL, (err: Error, db: any) => {
			if (err) {
				reject(err);
			} else {
				resolve(db);
			}
		});
	});
}

function compareTwoNames(name1: string, name2: string) { // Compare two names
	// Just try and see if they're equal right off the bat
	name1 = _.toString(name1);
	name2 = _.toString(name2);
	if (!name1 || !name2 || name1 === '' || name2 === '') {
		return false;
	} else if (name1 === name2 && name1 !== '' && name2 !== '') {
		return true;
	}
	// Mild escape prevention
	name1 = JSON.stringify(name1);
	name2 = JSON.stringify(name2);
	if (name1 === name2 && name1 !== '' && name2 !== '') {
		return true;
	}
	// ToUpperCase the whole thing
	name1 = name1.toUpperCase();
	name2 = name2.toUpperCase();
	// Cut spaces out
	name1 = name1.replace('/\s+/g', '');
	name2 = name2.replace('/\s+/g', '');
	if (name1 === name2 && name1 !== '' && name2 !== '') {
		return true;
	}
	// Cut "CMDR" out
	name1 = name1.replace('CMDR', '');
	name2 = name2.replace('CMDR', '');
	if (name1 === name2 && name1 !== '' && name2 !== '') {
		return true;
	}
	// Cut clantags off
	name1 = name1.split('[').filter((el: any) => {
		return el.length !== 0;
	})[0];
	name2 = name2.split('[').filter((el: any) => {
		return el.length !== 0;
	})[0];
	name1 = name1.split('(').filter((el: any) => {
		return el.length !== 0;
	})[0];
	name2 = name2.split('(').filter((el: any) => {
		return el.length !== 0;
	})[0];
	name1 = name1.split('<').filter((el: any) => {
		return el.length !== 0;
	})[0];
	name2 = name2.split('<').filter((el: any) => {
		return el.length !== 0;
	})[0];
	name1 = name1.split('{').filter((el: any) => {
		return el.length !== 0;
	})[0];
	name2 = name2.split('{').filter((el: any) => {
		return el.length !== 0;
	})[0];
	if (name1 === name2 && name1 !== '' && name2 !== '') {
		return true;
	}
	// Cut all non-alphanumerics off
	name1 = name1.replace('/\W/g', '');
	name2 = name2.replace('/\W/g', '');
	if (name1 === name2 && name1 !== '' && name2 !== '') {
		return true;
	}
	// If none of that worked they must not match.
	return false;
}

export interface util {
	connectDB: Function;
	compareTwoNames: Function;
}
const utils: util = {
	connectDB,
	compareTwoNames
};

export default utils;
