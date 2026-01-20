const logger = (req, res, next) => {
	console.log(`[${new Data().toISOString()}]`);
	next();
};

export default logger;
