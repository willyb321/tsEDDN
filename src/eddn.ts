import * as _ from 'lodash';
import * as moment from 'moment';
import * as Raven from 'raven';
import * as zmq from 'zeromq';
import * as zlib from 'zlib';
import utils from './utils';

const sock = zmq.socket('sub');

sock.connect('tcp://eddn.edcd.io:9500');

console.log('Worker connected to port 9500');

Raven.config('https://7c3174b16e384349bbf294978a65fb0c:c61b0700a2894a03a46343a02cf8b724@sentry.io/187248', {
	autoBreadcrumbs: true,
	captureUnhandledRejections: true
}).install();

export function initEDDN() {
	utils.connectDB()
		.then((db: any) => {
			sock.subscribe('');
			sock.on('message', (topic: any) => {
				const collection: any = db.collection('eddnHistory');
				onMessage(topic, db, collection);
			});
		})
		.catch((err: Error) => {
			Raven.captureException(err);
			console.error(err);
		});
}

function onMessage(topic: Buffer, db: any, collection: any) {
	zlib.inflate(topic, (err: Error, res: object) => {
		if (err) {
			Raven.context(() => {
				Raven.captureBreadcrumb({
					file: 'eddn.js',
					message: 'zlib insertion failed'
				});
				Raven.captureException(err);
				console.error(err);
			});
		}
		let message: any = JSON.parse(res.toString());
		if (message.message.event) {
			message.message.uploader = message.header.uploaderID.toString().toLowerCase();
			message.message.unixTimestamp = moment(message.message.timestamp).valueOf();
			message.message.software = `${message.header.softwareName}@${message.header.softwareVersion}`;
			collection
				.insertOne(message.message)
				.then(() => {
					console.log(`inserted ${message.message.event} from: ${message.message.uploader}`);
					message = null;
				})
				.catch(error => {
					Raven.context(() => {
						Raven.captureBreadcrumb({
							data: message,
							file: 'eddn.js',
							message: 'Insert failed'
						});
						Raven.captureException(error);
						console.error(error);
						message = null;
						utils.connectDB()
							.then((dbNew: any) => {
								db = dbNew;
							})
							.catch((errorNewDB: Error) => {
								Raven.captureException(errorNewDB);
								console.error(errorNewDB);
							});
					});
				});
		}
	});
}
