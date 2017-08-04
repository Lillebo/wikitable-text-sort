if (process.argv.length < 3) {
	throw new Error('Missing input file argument');
}

const sortByColumn = process.argv[3] || 0;

if (isNaN(sortByColumn)) {
	throw new Error('Invalid sort index');
}

const fs = require('fs');
const inputFileName = process.argv[2];

fs.readFile(inputFileName, 'utf8', (error, data) => {

	if (error) throw error;

	processTable(data);
});

/*
* Parse WikiText into rows, cells
*/
function processTable(data) {

	let tableData = data.split('\r\n');
	let rows = data.split('\n|-');
		rows.shift();

	let headers = rows.shift();

	for (let i = 0; i < rows.length; i++) {

		let cells = rows[i].split('\n| ');

		// Sanitize cells for carriage return & newline

		for (let j = 0; j < cells.length; j++) {
			cells[j] = cells[j].replace(/(\r\n)$/g, '');
			cells[j] = cells[j].replace(/(\r)$/g, '');
		}

		rows[i] = cells;

	}

	// Remove trailing }
	rows[rows.length-1].pop();

	rows.sort((a, b) => {
		if (getCellText(a[sortByColumn]) < getCellText(b[sortByColumn])) {
			return -1;
		}
		if (getCellText(a[sortByColumn]) > getCellText(b[sortByColumn])) {
			return 1;
		}
		return 0;
	});

	outputSorted(tableData, headers, rows);

};

/*
* Extract as pure as possible text value from cells
*/
function getCellText(value) {

	if (!value) {
		return undefined;
	}

	/*
	* Test for existence of "data-sort-value" attribute
	*/
	var dataSortValue = value.match(/data-sort-value=".+"/g);
	if (dataSortValue) {
		dataSortValue = dataSortValue[0];
		dataSortValue = dataSortValue.replace(/data-sort-value="/g, '');
		dataSortValue = dataSortValue.substr(0, dataSortValue.length-1);

		return dataSortValue;
	}

	/*
	* Remove linked page title, and only use link text
	* Example: [[Microsoft Windows|Windows]] = "Windows"
	*/
	value = value.replace(/\[\[[a-z|A-z|0-9 ]+\|/g, '');

	/*
	* Remove {{cite}}s
	*/
	value = value.replace(/{{cite.*}}/g, '');

	/*
	* Remove <ref>s
	*/
	value = value.replace(/<ref>.*<\/ref>/g, '');

	/*
	* Remove magic link keywords
	* Exmaple: {{flag:Uganda}} = "Uganda"
	*/
	value = value.replace(/{{[a-z]*:/g, '');

	return value;
}

/*
* Output sorted rows into txt file
*/
function outputSorted(tableData, headers, rows) {

	let outputString = tableData[0];

	outputString += '\n|-' + headers;

	for (let i = 0; i < rows.length; i++) {
		let rowString = rows[i].join('\n| ');
		outputString += '\n|-' + rowString;
	}

	outputString += '\n|}';

	const outputFileName = inputFileName.replace('.txt', '-sorted.txt');

	fs.writeFile('output/'+outputFileName, outputString, (error) => {
		if (error) throw error;

		console.log('Sorting complete!');
	});
}