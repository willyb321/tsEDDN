import {MongoClient} from 'mongodb';
import config from './config';

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
export interface util {
	connectDB: Function;
}
const utils: util = {
	connectDB
};

export default utils;
