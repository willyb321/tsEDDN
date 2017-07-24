require('dotenv').config();
export interface Conf {
	mongoURL: string;
}

const config: Conf = {
	mongoURL: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DB}`
};

export default config;
