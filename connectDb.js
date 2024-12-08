var fs = require('fs');
const { config } = require('./serverCfg');
const { Connection, Request, TYPES } = require('tedious');

const connection = new Connection(config);

// Event listener for connection events

function requestQuery(sqlQuery) {
    connection.on('connect', (err) => {
        if (err) {
            console.error('Connection Failed:', err);
        } else {
            console.log('Connected successfully!');
            // executeStatement(); // Proceed only if the connection is successful
            executeQuery(sqlQuery);
        }
    });
        
    connection.connect();
}
//
function executeQuery(sqlQuery) {
    // SQL Insert Query
    // Create a new SQL request
    const request = new Request(sqlQuery, (err) => {
        if (err) {
            console.error('Error executing query:', err);
        } else {
            console.log('Query executed successfully!');
        }
        // Close the connection after the query is executed
        connection.close();
    });

    if (sqlQuery.toLowerCase().includes('select')) {
        console.log("The query is a SELECT query.");
        const rows = [];
    
        let tableName = 'Output'; // Default file name if no table name is detected

        // Extract table name from the query using regex
        const match = sqlQuery.match(/select\s+\*\s+from\s+(\w+)/i);
        if (match && match[1]) {
            tableName = match[1]; // Capture table name
        }
        // Event listener for each row of the result set
        request.on('row', (columns) => {
            const rowData = {};
            columns.forEach((column) => {
                rowData[column.metadata.colName] = column.value; // Map column name to value
            });
            rows.push(rowData);
        });
    
        // Event listener when the query is complete
        request.on('requestCompleted', () => {
            console.table(rows); // Log the rows as a table
            const jsonResult = JSON.stringify(rows, null, 1); // Pretty print JSON with indentation

        // Log JSON to console
            console.log('JSON Result:', jsonResult);

        // Optional: Save JSON to a file
            const fileName = `database\\${tableName}.json`;
            fs.writeFile(fileName, jsonResult, (err) => {
                if (err) {
                    console.error('Error writing JSON to file:', err);
                } else {
                    console.log(`JSON saved to ${fileName}`);
                }
            });
        });
    } else {
        console.log("The query is not a SELECT query.");
    }

    // Open the connection and execute the query
    connection.execSql(request);

}

module.exports = { requestQuery };