const mysql = require('mysql');

var _pool;
var _onErrorCB;

function onError(onErrorCB) {
    _onErrorCB = onErrorCB;
}

function connect(config) {
    _pool = mysql.createPool(config);
}

function execute(sql, params, options) {
    return new Promise((resolve, reject) => {
        let boundSql = prepareSql(sql, params, options);

        _pool.query({ sql: boundSql, nestTables: true }, (error, rows, fields) => {
            if (error) {
                error.sql = sql;

                if (_onErrorCB) {
                    _onErrorCB(error);
                }
            }
            resolve({ error, rows, fields, sql: boundSql });
        });
    }); 
}

function save(table, data) {
    let columns = [];
    let placeholders = [];
    let params = {};
    let pairs = [];

    for(let column in data) {
        let value = data[column];

        if (isValidValue(value)) {
            columns.push('`' + column + '`');
            placeholders.push('[' + column + ']');
            pairs.push('`' + column + '` = [' + column + ']');      
            params[column] = value;   
        }         
    }        

    let sql = 'INSERT INTO `' + table + '` (' + columns.join(', ') + ') VALUES (' + placeholders.join(', ') + ') ON DUPLICATE KEY UPDATE ' + pairs.join(', ') + ';';

    return execute(sql, params);
}

function insert(table, data) {        
    if (Array.isArray(data)) {
        return insertMultiple(table, data);
    } else {
        return insertSingle(table, data);
    }
}

function insertMultiple(table, arr) {        
    let columns = [];
    for(let column in arr[0]) {
        columns.push('`' + column + '`');
    }

    let values = [];
    let params = {};    
    for(let i = 0; i < arr.length; i++) {
        let data = arr[i];

        let placeholders = [];
        for(let column in data) {
            let value = data[column];

            if (isValidValue(value)) {
                let indexedColumn = column + '-' + i;

                placeholders.push('[' + indexedColumn + ']');
                params[indexedColumn] = value;    
            }
        }        

        values.push('(' + placeholders.join(', ') + ')');
    }

    let sql = 'INSERT INTO `' + table + '` (' + columns.join(', ') + ') VALUES ' + values.join(', ') + ';';

    return execute(sql, params);
}

function insertSingle(table, data) {        
    let columns = [];
    let placeholders = [];
    let params = {};

    for(let column in data) {
        let value = data[column];

        if (isValidValue(value)) {
            columns.push('`' + column + '`');
            placeholders.push('[' + column + ']');
            params[column] = value;   
        }         
    }        

    let sql = 'INSERT INTO `' + table + '` (' + columns.join(', ') + ') VALUES (' + placeholders.join(', ') + ');';

    return execute(sql, params);
}

function isValidValue(value) {
    let type = typeof value;

    if (value === undefined) { return false; }
    if (value !== null && type === 'object' && Object.keys(value).length) { return false; }
    if (value !== null && type === 'object' && Array.isArray(value)) { return false; }

    return true;
}

function update(table, data) {        
    let pairs = [];
    let params = {};        

    for(let column in data) {
        let value = data[column];

        if (value !== undefined) {       
            if (column !== 'id') {         
                pairs.push('`' + column + '` = [' + column + ']');                
            }
            params[column] = value; 
        }
    }    

    let sql = 'UPDATE ' + table + ' SET ' + pairs.join(', ') + ' WHERE id = [id];';
    
    return execute(sql, params);
}

function remove(table, id) {
    return execute('DELETE FROM `' + table + '` WHERE id = [id];', { id: id });
}

function prepareSql(sql, params, options) {
    for(let name in params) {
        let value = params[name];
        sql = assignParameter(sql, name, value);
    }

    if (options && options.debug) {
        console.log(sql);
    }

    return sql;
} 

function assignParameter(sql, name, value) {
    let placeholder = '[' + name + ']';
    let escapedValue = _pool.escape(value);
    let sqlAfterAssignment = sql.split(placeholder).join(escapedValue);

    return sqlAfterAssignment;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Record counting

async function count(sql) {
    let countQuery = createCountQuery(sql);

    let result = await execute(countQuery, []);

    let row = result.rows[0];
    let total = row[''].total;

    return total;
}

function createCountQuery(sql) {
    sql = trimQuery(sql);

    let start = findCoreQueryStart(sql);
    let end = findCoreQueryEnd(sql);
    let coreQuery = sql.substring(start, end);
    let selectLine = getUsableSelectLine(sql);

    let countQuery = `
        SELECT 
            COUNT(*) AS total
        FROM
            (SELECT
                ${selectLine}
                ${coreQuery}) data;`;

    return countQuery;
}

function getUsableSelectLine(sql) {
    let sqlUpper = sql.toUpperCase();

    let selectPos = sqlUpper.indexOf('SELECT');
    let fromPos = sqlUpper.indexOf('FROM');

    let selectClause = sql.substring(selectPos + 6, fromPos - 1);
    let lines = selectClause.split(`,\n`)

    let selectLine;
    for(let line of lines) {         
        line = trimWHitespace(line);     
        
        if (!line.length) { continue; }

        let firstChar = line[0];

        // Skip lines that start with upper case since it's almost always a SQL keyword like COUNT, SUM, CASE, etc.
        if (firstChar == firstChar.toUpperCase()) { continue; }
        if (firstChar === '(') { continue; }

        selectLine = line;
        break;
    }

    return selectLine;
}

function trimWHitespace(str) {
    if (str) {
        return str.replace(/^\s*|\s*$/g, '');
    } else {
        return '';
    }
}

function trimQuery(sql) {
    sql = sql.trim();

    // Remove trailing semicolon if it exists
    let lastChar = sql[sql.length-1];
    if (lastChar === ';') {
        sql = sql.substring(0, sql.length - 1);
    }

    return sql;
}

function findCoreQueryStart(sql) {
    sql = sql.toUpperCase();
    let start = sql.indexOf('FROM');

    return start;
}

function findCoreQueryEnd(sql) {
    sql = sql.toUpperCase();

    let end = sql.length - 1;    

    let lastParenPos = sql.lastIndexOf(')');
    let lastWherePos = sql.lastIndexOf('WHERE');
    let lastLimitPos = sql.lastIndexOf('LIMIT');
    let lastOrderByPos = sql.lastIndexOf('ORDER BY');        

    if (lastLimitPos < lastParenPos || lastLimitPos < lastWherePos) { lastLimitPos = end; }
    if (lastOrderByPos < lastParenPos || lastOrderByPos < lastWherePos) { lastOrderByPos = end; }

    end = Math.min(end, lastOrderByPos, lastLimitPos);

    return end;
} 

module.exports.connect = connect;
module.exports.onError = onError;
module.exports.execute = execute;
module.exports.save = save;
module.exports.insert = insert;
module.exports.update = update;
module.exports.remove = remove;
module.exports.count = count;