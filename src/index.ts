import * as express from 'express';
import * as RateLimit from 'express-rate-limit';
import * as isDev from 'is-dev';
import * as Raven from 'raven';
import * as schemas from './models/'
import utils, {db} from './utils';
import {initEDDN} from './eddn';

const mongoosePaginate = require('mongoose-paginate');
Raven.config('https://7c3174b16e384349bbf294978a65fb0c:c61b0700a2894a03a46343a02cf8b724@sentry.io/187248', {
	autoBreadcrumbs: true,
	captureUnhandledRejections: true
}).install();

process.on('uncaughtException', (err: Error) => {
	Raven.captureException(err);
});

process.on('unhandledRejection', (err: Error) => {
	Raven.captureException(err);
});

const app: any = express();
initEDDN();
const apiLimiter: any = new RateLimit({
	delayMs: 0,
	headers: true,
	max: 75,
	windowMs: 15 * 60 * 1000
});
if (!isDev) {
	app.use('/api/', apiLimiter);
}
app.get('/', (req: any, res: any) => {
	res.json({
		message: 'Go to one of the endpoints',
		endpoints: [
			'/api/cmdr/:cmdr',
			'api/station/:station',
			'/api/recent'
		]
	});
});

interface newDocs {
	currentPage: number;
	perPage: number;
	total: number;
	totaPages: number;
	data: object[];
}

app.get('/api/cmdr/:cmdr', (req: any, res: any) => {
	const cmdr: string = req.params.cmdr.toString().toLowerCase();
	const page: number = parseInt(req.query.page, 10) || 1;
	if (!page) {
		console.log('No page query, sending first 25');
	}
	schemas.journalModel.paginate({uploader: cmdr}, {offset: (page - 1) * 25, limit: 25}).then(async result => {
		const count: number = await schemas.journalModel.count({uploader: cmdr});
		let totalPages: number = Math.round((count / 25));
		if (totalPages === 0) {
			totalPages = 1;
		}
		let newdocs: newDocs = {
			currentPage: page,
			perPage: 25,
			total: count,
			totaPages: totalPages,
			data: result.docs
		};
		res.json(newdocs);
		newdocs = null;
	});
});

app.get('/api/system/:system', (req: any, res: any) => {
	const system: string = req.params.system.toString();
	const page: number = parseInt(req.query.page, 10) || 1;
	if (!page) {
		console.log('No page query, sending first 25');
	}
	const collection = db.collection('eddnHistory');
	schemas.journalModel.paginate({StarSystem: system}, {offset: (page - 1) * 25, limit: 25}).then(async result => {
		const count: number = await collection.count({StarSystem: system});
		let totalPages: number = Math.round((count / 25));
		if (totalPages === 0) {
			totalPages = 1;
		}
		let newdocs: newDocs = {
			currentPage: page,
			perPage: 25,
			total: count,
			totaPages: totalPages,
			data: result.docs
		};
		res.json(newdocs);
		newdocs = null;
	});
});

app.get('/api/station/:station', (req: any, res: any) => {
	const station: string = req.params.station.toString();
	const page: number = parseInt(req.query.page, 10) || 1;
	if (!page) {
		console.log('No page query, sending first 25');
	}
	schemas.journalModel.paginate({StationName: station}, {offset: (page - 1) * 25, limit: 25}).then(async result => {
		const count: number = await schemas.journalModel.count({StationName: station});
		let totalPages: number = Math.round((count / 25));
		if (totalPages === 0) {
			totalPages = 1;
		}
		let newdocs: newDocs = {
			currentPage: page,
			perPage: 25,
			total: count,
			totaPages: totalPages,
			data: result.docs
		};
		res.json(newdocs);
		newdocs = null;
	});
});

app.get('/api/recent', (req: any, res: any) => {
	const page: number = parseInt(req.query.page, 10) || 1;
	schemas.journalModel.paginate({}, {offset: 0, limit: 25}).then(async result => {
		const count: number = await schemas.journalModel.count({});
		let totalPages: number = Math.round((count / 25));
		if (totalPages === 0) {
			totalPages = 1;
		}
		let newdocs: newDocs = {
			currentPage: page,
			perPage: 25,
			total: count,
			totaPages: totalPages,
			data: result.docs
		};
		res.json(newdocs);
		newdocs = null;
	});
});

app.listen(3001, () => {
	console.log('Server listening on 3000');
});
