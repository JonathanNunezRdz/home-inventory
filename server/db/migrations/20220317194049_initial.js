const tableNames = require('../../src/constants/tableNames');
const {
	addDefaultColumns,
	createNameTable,
	url,
	references,
	email,
} = require('../utils/helpers');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
	// First create all independent tables (no FKs)
	await Promise.all([
		knex.schema.createTable(tableNames.user, (table) => {
			table.increments().notNullable();
			table.string('name').notNullable();
			table.string('password', 127).notNullable();
			table.datetime('last_login');
			email(table).notNullable().unique();
			addDefaultColumns(table);
		}),
		createNameTable(knex, tableNames.item_type),
		createNameTable(knex, tableNames.country),
		createNameTable(knex, tableNames.state),
		createNameTable(knex, tableNames.shape),
		knex.schema.createTable(tableNames.inventory_location, (table) => {
			table.increments().notNullable();
			table.string('name').notNullable().unique();
			table.string('description', 1000);
			url(table);
			addDefaultColumns(table);
		}),
	]);

	// Then create tables in order of dependecy (FKs)
	await knex.schema.createTable(tableNames.address, (table) => {
		table.increments().notNullable();
		table.string('street_address_1', 100).notNullable();
		table.string('street_address_2', 100);
		table.string('city', 50).notNullable();
		table.string('zipcode', 15).notNullable();
		table.float('latitude').notNullable();
		table.float('longitude').notNullable();
		references(table, tableNames.state, false);
		references(table, tableNames.country);
	});

	await knex.schema.createTable(tableNames.company, (table) => {
		table.increments().notNullable();
		table.string('name').notNullable();
		table.string('description', 1000);
		url(table, 'logo');
		url(table, 'website');
		email(table);
		references(table, tableNames.address);
		addDefaultColumns(table);
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
	await knex.schema.dropTable(tableNames.company);
	await knex.schema.dropTable(tableNames.address);
	await Promise.all(
		[
			tableNames.user,
			tableNames.item_type,
			tableNames.country,
			tableNames.state,
			tableNames.shape,
			tableNames.inventory_location,
		].map((tableName) => knex.schema.dropTable(tableName))
	);
};
