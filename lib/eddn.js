"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const Raven = require("raven");
const zmq = require("zeromq");
const zlib = require("zlib");
const utils_1 = require("./utils");
const sock = zmq.socket('sub');
sock.connect('tcp://eddn.edcd.io:9500');
console.log('Worker connected to port 9500');
Raven.config('https://7c3174b16e384349bbf294978a65fb0c:c61b0700a2894a03a46343a02cf8b724@sentry.io/187248', {
    autoBreadcrumbs: true,
    captureUnhandledRejections: true
}).install();
utils_1.default.connectDB()
    .then((db) => {
    sock.subscribe('');
    sock.on('message', (topic) => {
        onMessage(topic, db);
    });
})
    .catch((err) => {
    Raven.captureException(err);
    console.error(err);
});
function onMessage(topic, db) {
    zlib.inflate(topic, (err, res) => {
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
        let message = JSON.parse(res.toString());
        if (message.message.event) {
            message.message.uploader = message.header.uploaderID.toString().toLowerCase();
            message.message.unixTimestamp = moment(message.message.timestamp).valueOf();
            message.message.software = `${message.header.softwareName}@${message.header.softwareVersion}`;
            const collection = db.collection('eddnHistory');
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
                });
            });
        }
    });
}
