"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const RateLimit = require("express-rate-limit");
const isDev = require("is-dev");
const Raven = require("raven");
const utils_1 = require("./utils");
require("./eddn");
Raven.config('https://7c3174b16e384349bbf294978a65fb0c:c61b0700a2894a03a46343a02cf8b724@sentry.io/187248', {
    autoBreadcrumbs: true,
    captureUnhandledRejections: true
}).install();
const app = express();
const apiLimiter = new RateLimit({
    delayMs: 0,
    headers: true,
    max: 75,
    windowMs: 15 * 60 * 1000
});
if (!isDev) {
    app.use('/api/', apiLimiter);
}
app.get('/', (req, res) => {
    res.send('hello');
});
app.get('/api/cmdr/:cmdr', (req, res) => {
    const cmdr = req.params.cmdr.toString().toLowerCase();
    const page = parseInt(req.query.page, 10) || 1;
    if (!page) {
        console.log('No page query, sending first 25');
    }
    utils_1.default.connectDB()
        .then((db) => {
        const collection = db.collection('eddnHistory');
        collection
            .find({ uploader: cmdr })
            .skip((page - 1) * 10)
            .limit(25)
            .sort({ unixTimestamp: -1 })
            .toArray((err, docs) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.error(err);
                Raven.captureException(err);
            }
            let count = yield collection.count({ uploader: cmdr });
            let totalPages = Math.round((count / 25));
            if (totalPages === 0) {
                totalPages = 1;
            }
            let newdocs = {
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
        }));
    })
        .catch((err) => {
        Raven.captureException(err);
        console.error(err);
    });
});
app.get('/api/system/:system', (req, res) => {
    const system = req.params.system.toString();
    const page = parseInt(req.query.page, 10) || 1;
    if (!page) {
        console.log('No page query, sending first 25');
    }
    utils_1.default.connectDB()
        .then((db) => {
        const collection = db.collection('eddnHistory');
        collection
            .find({ StarSystem: system })
            .skip((page - 1) * 10)
            .limit(25)
            .sort({ unixTimestamp: -1 })
            .toArray((err, docs) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.error(err);
                Raven.captureException(err);
            }
            let count = yield collection.count({ StarSystem: system });
            let newdocs = {
                currentPage: page,
                perPage: 25,
                total: count,
                totaPages: Math.round((count / 25)),
                data: docs
            };
            docs = null;
            res.json(newdocs);
            newdocs = null;
            db.close();
        }));
    })
        .catch(err => {
        Raven.captureException(err);
        console.error(err);
    });
});
app.get('/api/station/:station', (req, res) => {
    const station = req.params.station;
    const page = parseInt(req.query.page, 10) || 1;
    if (!page) {
        console.log('No page query, sending first 25');
    }
    utils_1.default.connectDB()
        .then((db) => {
        const collection = db.collection('eddnHistory');
        collection
            .find({ StationName: station })
            .skip((page - 1) * 25)
            .limit(25)
            .sort({ unixTimestamp: -1 })
            .toArray((err, docs) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.error(err);
                Raven.captureException(err);
            }
            let count = yield collection.count({ StarSystem: station });
            let newdocs = {
                currentPage: page,
                perPage: 25,
                total: count,
                totaPages: Math.round((count / 25)),
                data: docs
            };
            docs = null;
            res.json(newdocs);
            newdocs = null;
            db.close();
        }));
    })
        .catch(err => {
        Raven.captureException(err);
        console.error(err);
    });
});
app.get('/api/recent', (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    utils_1.default.connectDB()
        .then((db) => {
        const collection = db.collection('eddnHistory');
        collection
            .find()
            .skip((page - 1) * 25)
            .limit(25)
            .sort({ _id: -1 })
            .toArray((err, docs) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.error(err);
                Raven.captureException(err);
            }
            let count = yield collection.count();
            let newdocs = {
                currentPage: page,
                perPage: 25,
                total: count,
                totaPages: Math.round((count / 25)),
                data: docs
            };
            docs = null;
            res.json(newdocs);
            newdocs = null;
        }));
    })
        .catch(err => {
        Raven.captureException(err);
        console.error(err);
    });
});
app.listen(3000, () => {
    console.log('Server listening on 3000');
});
