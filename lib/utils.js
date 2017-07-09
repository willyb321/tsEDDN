"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const config_1 = require("./config");
function connectDB() {
    return new Promise((resolve, reject) => {
        mongodb_1.MongoClient.connect(config_1.default.mongoURL, (err, db) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(db);
            }
        });
    });
}
const utils = {
    connectDB
};
exports.default = utils;
