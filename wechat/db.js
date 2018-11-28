var mysql = require('mysql');
// var db = {};
var connection = mysql.createConnection({
    host: '192.168.50.14',
    user: 'gtis',
    password: 'gtis',
    database: 'mytest_db',
    port: 3306
});

connection.connect();

connection.query('SELECT * from s_sj_dwxx', function (error, results, fields) {
    if (error) throw error;
    for(var i=0;i<results.length;i++){
        console.log('The results is: '+results[i]);
    }
    console.log(results)
});


//
// connection.connect(function(err){
//     if(err){
//         console.log(err);
//         return;
//     }
// });
// db.query = function sqlback(sqllan,fn){
//     var sql = sqllan;
//     if(!sql) return;
//     connection.query(sql,function(err,rows,fields){
//         if(err){
//             console.log(err);
//             return;
//         }
//         /*fn(rows);*/
//         return rows;
//     });
//     connection.end(function(err){
//         if(err){
//             return;
//         }else{
//             console.log('连接关闭');
//         }
//     });
// }
// module.exports = db;