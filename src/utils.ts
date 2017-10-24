import config from './config';
import * as _ from 'lodash';
import * as mongoose from 'mongoose';
import * as schemas from './models/';

mongoose.connect(config.mongoURL);
export const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Mongoose Connected!');
});

export interface util {
	db: mongoose.Connection;
}
const utils: util = {
	db
};

export default utils;
