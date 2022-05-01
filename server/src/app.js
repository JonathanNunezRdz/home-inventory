const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');

const { notFound, errorHandler } = require('./middlewares');

const app = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use(compression());
app.use(helmet());

app.get('/', (req, res) => {
	res.json({
		message: 'Home Inventory API',
	});
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
