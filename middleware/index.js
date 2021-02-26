const middlewares = {
	asyncErrorHandler: (req, res, next) => {
			Promise.resolve(req, res, next).catch(next);
            console.log("well");
	},
};

export default middlewares