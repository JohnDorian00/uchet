let sqlite3 = require('sqlite3').verbose(),
    db = null;

const defTables = [
    {
        name: "Settings",
        fieldsString: "(SettingsID INTEGER PRIMARY KEY UNIQUE, directorOfInstitut TEXT, " +
            "nameOfInstitut TEXT, nameOfKafedra TEXT, shortNameOfKafedra TEXT, stavka TEXT, zavedKafedroy TEXT)"
    },
    
    {
        name: "Jobs",
        fieldsString: "(JobsID INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, Name TEXT, Note TEXT)"
    },
    
    {
        name: "Streams",
        fieldsString: "(StreamsID INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, Name TEXT, Institut TEXT, StQuantity INTEGER ," +
            "           BudjetSt INTEGER, UnBudgetSt INTEGER, YearID INTEGER, Note TEXT)"
    },
    
    {
        name: "TeachersJobs",
        fieldsString: "(TeachersJobsID INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, Name TEXT, Note Text)"
    },
    
    {
        name: "Disciplines",
        fieldsString: "(DisciplinesID INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, Name TEXT, Note TEXT)"
    },
    
    {
        name: "Teachers",
        fieldsString: "(TeachersID INTEGER PRIMARY KEY AUTOINCREMENT, TeachersJobsID INTEGER, FIO TEXT, Degree TEXT, " +
            "Status TEXT, Rate TEXT, Note Text, FOREIGN KEY(TeachersJobsID) REFERENCES TeachersJobs(TeachersJobsID) ON DELETE SET NULL)"
    },
];

// let db = new sqlite3.Database(':memory:');
// connect('test.db');
//
//
// db.serialize(function () {
//     db.run("CREATE TABLE lorem (info TEXT)");
//
//     var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//     for (var i = 0; i < 10; i++) {
//         stmt.run("Ipsum " + i);
//     }
//     stmt.finalize();
//
//     db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
//         console.log(row.id + ": " + row.info);
//     });
// });
//
// close();

// Создание бд
async function createAndConnect(path) {
    if (db) {
        await close();
    }
    return new Promise((resolve) => {
        if (typeof path !== 'string' && !path) return resolve('Указан нетекстовый путь к файлу')
        
        db = new sqlite3.Database(path, (err) => {
            if (err) {
                console.log(err);
                db = null;
                resolve("Не удалось создать/подключиться к бд");
            } else {
                let pathArr = path.split("\\");
                if (pathArr.length === 1) {
                    const {ipcRenderer} = require('electron');
                    let env = JSON.parse(ipcRenderer.sendSync('get-real-path'));
                    let absloutePath = env.PORTABLE_EXECUTABLE_DIR || env.INIT_CWD;
                    path = absloutePath + "\\" + path;
                }
                localStorage.setItem('path', path);
                localStorage.setItem('name', pathArr[pathArr.length - 1]);
                console.log('connect to db');
                return resolve(err);
            }
        });
        // db.configure("busyTimeout", 0);
    })
}

// Подключение к бд
async function connect(path) {
    let localSavePath = localStorage.getItem('path');
    if (db) {
        await close();
    }
    return new Promise((resolve) => {
        if (typeof path !== 'string' && !localSavePath) return resolve('Указан нетекстовый путь к файлу')
        if (!path && localSavePath) path = localSavePath;
        //  sqlite3.OPEN_READWRITE
        db = new sqlite3.Database(path, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                localStorage.removeItem('path');
                localStorage.removeItem('name');
                db = null;
                return resolve("Не удалось подключиться к бд");
            } else {
                let pathArr = path.split("\\");
                if (pathArr.length === 1) {
                    const {ipcRenderer} = require('electron');
                    let env = JSON.parse(ipcRenderer.sendSync('get-real-path'));
                    let absloutePath = env.PORTABLE_EXECUTABLE_DIR || env.INIT_CWD;
                    path = absloutePath + "\\" + path;
                }
                localStorage.setItem('path', path);
                localStorage.setItem('name', pathArr[pathArr.length - 1]);
                console.log('connect to db');
                return resolve(err);
            }
        });
        // db.configure("busyTimeout", 0);
    })
}

// Закрыть подключение к бд
function close() {
    return new Promise((resolve) => {
        if (db) {
            db.close((err) => {
                console.log(err);
                db = null;
                localStorage.removeItem('path');
                localStorage.removeItem('name');
                console.log('db close')
                return resolve(err);
            });
        } else {
            return resolve();
        }
    })
}

// tableName, findElems
function getTable(tableName) {
    let defErr = 'Ошибка чтения бд:';
    return new Promise((resolve, reject) => {
        if (!db) {
            return resolve(defErr + "нет подключения к базе данных");
        }
        if (!tableName || typeof tableName !== 'string') return resolve(defErr + "не указана таблица в бд");
        db.all("SELECT * FROM " + tableName, (err, rows) => {
            if (err) reject(new Error(defErr + err))
            else {
                return resolve({data: rows})
            }
        });
    })
}

// Добавить или обновить строки
function addRows(tableName, rows) {
    let defErr = 'Ошибка записи бд:';
    return new Promise((resolve) => {
        if (!db) {
            return resolve(defErr + "нет подключения к базе данных");
        }
        
        if (!tableName || typeof tableName !== 'string') {
            return resolve(defErr + "не указана таблица в бд");
        }
        
        // row = {col1: val1, col2: val2, ...}
        if (rows && !Array.isArray(rows)) {
            rows = [rows]
        } else if (!rows) {
            return resolve(defErr + "указан не массив/одиночный объект");
        }
        
        let cols = Object.keys(rows[0]),
            promises = [],
            sql;
        
        // Обновить строку если есть айди
        if (cols.indexOf('id') !== -1) {
            let tmpVals = "(";
            // tmpCols = "",
            cols.forEach((item) => {
                if (typeof item === 'string' && (item.toLowerCase()).indexOf('id')) {
                    // tmpCols += item + " = ?, ";
                    tmpVals += '?, ';
                }
            })
            cols.pop();
            // cols = tmpCols.slice(0, -2);
            tmpVals = tmpVals.slice(0, -2) + ")";
            // tmpCols = undefined;
            sql = "UPDATE " + tableName + " SET " + cols.toString() + " WHERE " + tableName + "ID" + " = ?;"
            sql = "INSERT OR REPLACE INTO " + tableName + "(" + cols + ")" + " VALUES " + tmpVals;
        } else {
            // Добавить строку как новую
            let tmpVals = "";
            cols.forEach(() => {
                tmpVals += '?, ';
            })
            tmpVals = tmpVals.slice(0, -2) + ")";
            cols = cols.toString();
            sql = "INSERT INTO " + tableName + "(" + cols + ")" + " VALUES " + tmpVals;
        }
        
        
        console.log(sql);
        
        let stmt = db.prepare(sql);
        
        rows.forEach((item) => {
            if (item.id) {
                delete item.id
            }
            
            let values = Object.values(item);
            
            
            promises.push(new Promise((resolve2) => {
                stmt.run(values, (err) => {
                    console.log(err);
                    return resolve2(err);
                });
            }));
        })
        
        Promise.all(promises).then((err) => {
            stmt.finalize();
            return resolve(err);
        })
    })
}

// Выполнить запрос
async function run(sql) {
    let defErr = 'Ошибка исполнения sql:'
    return new Promise((resolve) => {
        if (!db) {
            return resolve(defErr + "нет подключения к базе данных");
        }
        if (typeof sql !== 'string' || !sql) return resolve('Указан нетекстовый запрос');
        
        console.log(sql);
        
        db.run(sql, (err) => {
            return resolve(err)
        })
    })
}

function getPath() {
    if (db) {
        return db.filename
    } else {
        return null
    }
}

function isConnected() {
    return Boolean(db)
}

function getDB() {
    return db
}

function initDefaultDateBase() {
    return new Promise((resolve) => {
        if (!db) return resolve("Нет подключения к базе данных");
        let promises = [];
        
        
        defTables.forEach((item) => {
            promises.push(new Promise((resolve2) => {
                console.info(item.name);
                db.run("CREATE TABLE IF NOT EXISTS " + item.name + item.fieldsString, [], (err) => {
                    resolve2(err);
                });
            }))
        })
        
        Promise.all(promises).then((err) => {
            resolve(err);
        })
    })
}


export {run, connect, createAndConnect, close, getPath, getDB, isConnected, getTable, addRows, initDefaultDateBase};
