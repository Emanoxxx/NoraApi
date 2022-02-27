// Obtenga el servicio mysql
const mysql = require('mysql');
const noraDBCredentials = require('../../NoraDB.json');
// Agregue las credenciales para acceder a su base de datos
const connection = mysql.createConnection({
    host     : noraDBCredentials.host,
    user     : noraDBCredentials.user,
    password : noraDBCredentials.password,
    database : noraDBCredentials.database
});
const pool = mysql.createPool({
    host     : noraDBCredentials.host,
    user     : noraDBCredentials.user,
    password : noraDBCredentials.password,
    database : noraDBCredentials.database
});
function connectDB(){
    connection.connect(function(err) {
        // en caso de error
        if(err){
            console.log(err.code);
            console.log(err.fatal);
            return false;
        }
    });
    return true;
}

function query(sql,values){
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err,connection){
            if (err) {
                reject({"Resultado":"Error","Message":"Error de conexion","Code":"DB-ERROR-01"});
            }else{
                connection.query(sql, values,(err, rows)=>{
                    if (err) {
                        reject({"Resultado":"Error","Message":"Error de consulta","Code":"DB-ERROR-02"});
                    }else{
                        resolve({"Resultado":"Succes","Message":"Consulta exitosa","Data":rows});
                    }
                    connection.release();
                })
            }
        })
    })
}
//Tabla Usuario
const getLogin = async(user) => {
    var resultado=null;
    // Realizar una consulta
    $query = 'select * from Usuario where nombre = BINARY '+connection.escape(user.usr)+' and pass = BINARY '+connection.escape(user.psw);
    resultado=await query($query);
    console.log(resultado.Data);
    if(resultado.Data.length > 0){
        return true;
    }else{
        return false;
    }
    //return resultado;
};
//Tabla Usuario
exports.getLogin=getLogin;



