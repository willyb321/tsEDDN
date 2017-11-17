import config from './config';
import * as mongoose from 'mongoose';
import {sock} from './eddn';
mongoose.connect(config.mongoURL);
export const db = mongoose.connection;
db.on('error', err => {
	console.log(err);
	sock.disconnect('tcp://eddn.edcd.io:9500');
	sock.close();
});
db.once('open', () => {
	console.log('Mongoose Connected!');
});

export interface util {
	db: mongoose.Connection;
}
export const utils: util = {
	db
};
