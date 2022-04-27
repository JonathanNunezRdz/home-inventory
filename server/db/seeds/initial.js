const crypto = require('crypto');
const bcrypt = require('bcrypt');
const orderedTableNames = require('../../src/constants/orderedTableNames');
const tableNames = require('../../src/constants/tableNames');
const countries = require('../../src/constants/countries');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async (knex) => {
	// Deletes ALL existing entries

	await orderedTableNames.reduce(async (promise, tableName) => {
		await promise;
		console.log('Clearing', tableName);
		return knex(tableName).del();
	}, Promise.resolve());

	const password = crypto.randomBytes(15).toString('hex');
	const user = {
		email: 'jonas@jonas.com',
		name: 'jonas',
		password: await bcrypt.hash(password, 12),
	};

	const [addedUser] = await knex(tableNames.user).insert(user).returning('*');

	console.log('User created', password);
	console.log('User added', addedUser);

	await knex(tableNames.country).insert(countries);
	await knex(tableNames.state).insert([
		{
			name: 'NL',
		},
	]);
};
