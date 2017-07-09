export interface Conf {
	mongoURL: string;
}
const config: Conf = {
	mongoURL: 'mongodb://localhost:54373/eddn'
};

export default config;
