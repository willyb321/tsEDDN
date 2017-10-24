import * as moment from 'moment';
import * as Raven from 'raven';
import * as zmq from 'zeromq';
import * as zlib from 'zlib';
import * as mongoose from 'mongoose';
import * as schemas from './models/';
import * as GenerateSchema from 'generate-schema';
import utils, {db} from './utils';

const sock = zmq.socket('sub');

sock.connect('tcp://eddn.edcd.io:9500');

console.log('Worker connected to port 9500');

Raven.config('https://7c3174b16e384349bbf294978a65fb0c:c61b0700a2894a03a46343a02cf8b724@sentry.io/187248', {
	autoBreadcrumbs: true,
	captureUnhandledRejections: true
}).install();

export function initEDDN() {
	sock.subscribe('');
	sock.on('message', (topic: any) => {
		onMessage(topic);
	});
}

function onMessage(topic: Buffer) {
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
		const message: any = JSON.parse(res.toString());
		if (message.$schemaRef !== 'https://eddn.edcd.io/schemas/journal/1') {
			return;
		}
		message.uploader = message.header.uploaderID.toString().toLowerCase();
		message.StarSystem = message.message.StarSystem || message.message.starSystem || message.message.systemName || null;
		message.StationName = message.message.StationName || message.message.stationName || null;
		message.header.unixTimestamp = moment(message.message.timestamp).valueOf();
		message.eddnSchema = message.$schemaRef;
		delete message.$schemaRef;
		message.header.software = `${message.header.softwareName}@${message.header.softwareVersion}`;
		// console.log(message);
		const modelled = new schemas.journalModel(message);
		modelled.save((errModel, newMessage) => {
			if (err) {
				console.error(errModel);
				Raven.captureException(errModel);
			} else {
				console.log(`inserted ${message.message.event || 'another thing'} from: ${message.uploader}`);
			}
		});
	});
}
