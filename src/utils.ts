import config from './config';
import * as mongoose from 'mongoose';

mongoose.connect(config.mongoURL);
export const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Mongoose Connected!');
});

export interface util {
	db: mongoose.Connection;
}
export const utils: util = {
	db
};
