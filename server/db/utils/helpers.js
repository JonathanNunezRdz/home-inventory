/**
 * @typedef {import("knex").Knex.CreateTableBuilder} KnexTable
 */

/**
 * @param {KnexTable} table
 */
function addDefaultColumns(table) {
	table.timestamps(false, true);
	table.datetime('deleted_at');
}
exports.addDefaultColumns = addDefaultColumns;

/**
 * Create a simple table with serial id and a name.
 * @param {import("knex").Knex} knex - Knex object
 * @param {string} tableName - Name of the table
 * @returns {Promise<void>}
 */
function createNameTable(knex, tableName) {
	return knex.schema.createTable(tableName, (table) => {
		table.increments().notNullable();
		table.string('name').notNullable().unique();
		addDefaultColumns(table);
	});
}
exports.createNameTable = createNameTable;

/**
 * Create a foreign key column with the format `foreignTableName_id` to foreign table `foreignTableName`
 * @param {KnexTable} table
 * @param {string} foreignTableName
 */
function references(table, foreignTableName) {
	table
		.integer(`${foreignTableName}_id`)
		.unsigned()
		.references('id')
		.inTable(foreignTableName)
		.onDelete('CASCADE');
}
exports.references = references;

/**
 * Create a "url" column to table
 * @param {KnexTable} table
 * @param {string} columnName
 */
function url(table, columnName = 'image') {
	table.string(`${columnName}_url`, 2000);
}
exports.url = url;

/**
 * Create an email column in current table
 * @param {KnexTable} table - CreateTableBuilder
 */
function email(table) {
	return table.string('email', 254);
}
exports.email = email;
