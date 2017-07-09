import * as _ from 'lodash';
import * as express from 'express';
import * as RateLimit from 'express-rate-limit';
import * as isDev from 'is-dev';
import * as Raven from 'raven';
import utils from './utils';

import './eddn';

Raven.config('https://7c3174b16e384349bbf294978a65fb0c:c61b0700a2894a03a46343a02cf8b724@sentry.io/187248', {
	autoBreadcrumbs: true,
	captureUnhandledRejections: true
}).install();

const app: any = express();

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
	res.send('hello');
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
	utils.connectDB()
		.then((db: any) => {
			const collection: any = db.collection('eddnHistory');
			collection
				.find({uploader: cmdr})
				.skip((page - 1) * 10)
				.limit(25)
				.sort({unixTimestamp: -1})
				.toArray(async (err: Error, docs: object[]) => {
					if (err) {
						console.error(err);
						Raven.captureException(err);
					}
					const count: number = await collection.count({uploader: cmdr});
					let totalPages: number = Math.round((count / 25));
					if (totalPages === 0) {
						totalPages = 1;
					}
					let newdocs: newDocs = {
						currentPage: page,
						perPage: 25,
						total: count,
						totaPages: totalPages,
						data: docs
					};
					docs = null;
					res.json(newdocs);
					newdocs = null;
					db.close();
				});
		})
		.catch((err: Error) => {
			Raven.captureException(err);
			console.error(err);
		});
});

app.get('/api/system/:system', (req: any, res: any) => {
	const system: string = req.params.system.toString();
	const page: number = parseInt(req.query.page, 10) || 1;
	if (!page) {
		console.log('No page query, sending first 25');
	}
	utils.connectDB()
		.then((db: any) => {
			const collection = db.collection('eddnHistory');
			collection
				.find({StarSystem: system})
				.skip((page - 1) * 10)
				.limit(25)
				.sort({unixTimestamp: -1})
				.toArray(async (err: Error, docs: object[]) => {
					if (err) {
						console.error(err);
						Raven.captureException(err);
					}
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
						data: docs
					};
					docs = null;
					res.json(newdocs);
					newdocs = null;
					db.close();
				});
		})
		.catch(err => {
			Raven.captureException(err);
			console.error(err);
		});
});

app.get('/api/station/:station', (req: any, res: any) => {
	const station: string = req.params.station;
	const page: number = parseInt(req.query.page, 10) || 1;
	if (!page) {
		console.log('No page query, sending first 25');
	}
	utils.connectDB()
		.then((db: any) => {
			const collection = db.collection('eddnHistory');
			collection
				.find({StationName: station})
				.skip((page - 1) * 25)
				.limit(25)
				.sort({unixTimestamp: -1})
				.toArray(async (err: Error, docs: object[]) => {
					if (err) {
						console.error(err);
						Raven.captureException(err);
					}
					const count: number = await collection.count({StationName: station});
					let totalPages: number = Math.round((count / 25));
					if (totalPages === 0) {
						totalPages = 1;
					}
					let newdocs: newDocs = {
						currentPage: page,
						perPage: 25,
						total: count,
						totaPages: totalPages,
						data: docs
					};
					docs = null;
					res.json(newdocs);
					newdocs = null;
					db.close();
				});
		})
		.catch(err => {
			Raven.captureException(err);
			console.error(err);
		});
});

app.get('/api/recent', (req: any, res: any) => {
	const page: number = parseInt(req.query.page, 10) || 1;
	utils.connectDB()
		.then((db: any) => {
			const collection = db.collection('eddnHistory');
			collection
				.find()
				.skip((page - 1) * 25)
				.limit(25)
				.sort({_id: -1})
				.toArray(async (err: Error, docs: object[]) => {
					if (err) {
						console.error(err);
						Raven.captureException(err);
					}
					const count: number = await collection.count();
					let totalPages: number = Math.round((count / 25));
					if (totalPages === 0) {
						totalPages = 1;
					}
					let newdocs: newDocs = {
						currentPage: page,
						perPage: 25,
						total: count,
						totaPages: totalPages,
						data: docs
					};
					docs = null;
					res.json(newdocs);
					newdocs = null;
				});
		})
		.catch(err => {
			Raven.captureException(err);
			console.error(err);
		});
});

app.listen(3000, () => {
	console.log('Server listening on 3000');
});
