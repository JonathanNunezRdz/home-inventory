const tableNames = require('../../src/constants/tableNames');
const { addDefaultColumns, references, url } = require('../utils/helpers');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
	await knex.schema.table(tableNames.state, (table) => {
		table.string('code');
		references(table, tableNames.country);
	});

	await knex.schema.table(tableNames.country, (table) => {
		table.string('code');
	});

	await knex.schema.createTable(tableNames.size, (table) => {
		table.increments().notNullable();
		table.string('name').notNullable();
		table.float('length');
		table.float('width');
		table.float('height');
		table.float('volume');
		references(table, tableNames.shape);
		addDefaultColumns(table);
	});

	await knex.schema.createTable(tableNames.item, (table) => {
		table.increments().notNullable();
		table.string('name');
		table.text('description');
		table.string('sku', 50);
		table.boolean('sparks_joy').defaultTo(false);
		references(table, tableNames.user);
		references(table, tableNames.item_type);
		references(table, tableNames.company);
		references(table, tableNames.size);
		addDefaultColumns(table);
	});

	await knex.schema.createTable(tableNames.item_info, (table) => {
		table.increments().notNullable();
		table.dateTime('purchase_date').notNullable();
		table.dateTime('expiration_date');
		table.dateTime('last_used');
		table.float('purchase_price').notNullable().defaultTo(0);
		table.float('msrp').notNullable().defaultTo(0);
		references(table, tableNames.user);
		references(table, tableNames.item);
		references(table, tableNames.company, false, 'retailer');
		references(table, tableNames.inventory_location);
		addDefaultColumns(table);
	});

	await knex.schema.createTable(tableNames.item_image, (table) => {
		table.increments().notNullable();
		url(table);
		references(table, tableNames.item);
		addDefaultColumns(table);
	});

	await knex.schema.createTable(tableNames.related_item, (table) => {
		table.increments().notNullable();
		references(table, tableNames.item);
		references(table, tableNames.item, false, 'related_item');
		addDefaultColumns(table);
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
	await knex.schema.dropTable(tableNames.related_item);
	await knex.schema.dropTable(tableNames.item_info);
	await knex.schema.dropTable(tableNames.item);
	await knex.schema.dropTable(tableNames.size);

	await knex.schema.table(tableNames.country, (table) => {
		table.dropColumn('code');
	});
	await knex.schema.table(tableNames.state, (table) => {
		table.dropColumn('country_id');
		table.dropColumn('code');
	});
};
