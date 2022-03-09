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
                reject({"Resultado":"Error","Message":"Error de conexion","Code":"DB-ERROR-01","archivo":values});
            }else{
                connection.query(sql, values,(err, rows)=>{
                    if (err) {
                        reject({"Resultado":"Error","Message":"Error de consulta","Code":"DB-ERROR-02","archivo":values});
                    }else{
                        resolve({"Resultado":"Succes","Message":"Consulta exitosa","Data":rows,"archivo":values});
                    }
                    connection.release();
                })
            }
        })
    })
}
//Tabla sonido
const getSonidos = async () => {
    var resultado=null;
    // Realizar una consulta
    $query = 'SELECT * from Sonido';
    try{return await query($query);}catch(error){return error}
};
const getSearch = async (search) => {
    var resultado=null;
    // Realizar una consulta
    $query = 'SELECT * from Sonido where nombre like ' + connection.escape("%"+search+"%");
    try{return await query($query);}catch(error){return error}
};
const createSonido = async(sonido) => {
    var resultado=null;
    // Realizar una consulta
    $query = 'insert into Sonido values ('+connection.escape(sonido)+','+connection.escape("/"+sonido+"/").toLowerCase()+')';
    console.log($query);
    try{return await query($query);}catch(error){return error}
};
const getSonidoByName = async(sonido) => {
    var resultado=null;
    // Realizar una consulta
    $query = 'SELECT * from Sonido where nombre = '+connection.escape(sonido);
    try{return await query($query);}catch(error){return error}
}
const deleteSonido = async(sonido) => {
    var resultado=null;
    // Realizar una consulta
    $query = 'Delete from Sonido where nombre = '+connection.escape(sonido);
    try{return await query($query);}catch(error){return error}
};
const updateSonido = async(sonido) => {
    var resultado=null;
    // Realizar una consulta
    $query = 'UPDATE Sonido set nombre='+connection.escape(sonido.new)+' where nombre = '+connection.escape(sonido.old);
    try{return await query($query);}catch(error){return error}
}
//Tabla etiquetas
const createEtiqueta = async(Etiqueta) => {
    var resultado=null;
    // Realizar una consulta
    $query = 'insert into EtiquetaSonido values ('+connection.escape(Etiqueta.sonido)+','+connection.escape(Etiqueta.etiqueta)+')';
    try{return await query($query);}catch(error){return error}
};
const getEtiquetasBySonido = async(sonido) => {
    var resultado=null;
    // Realizar una consulta
    $query = 'SELECT * from EtiquetaSonido where sonido = '+connection.escape(sonido);
    try{return await query($query);}catch(error){return error}
}
const deleteEtiqueta= async(sonido,etiqueta) => {
    var resultado=null;
    // Realizar una consulta
    $query = 'Delete from EtiquetaSonido where etiqueta = '+connection.escape(etiqueta)+' and sonido = '+connection.escape(sonido);
    try{return await query($query);}catch(error){return error}
};
//Tabla Url
const createUrl = async(url) => {
    var resultado=null;
    // Realizar una consulta
    var sonido=url.sonido;
    var urlsound=url.url;
    $query = 'insert into UrlSonido values ('+connection.escape(sonido)+','+connection.escape(urlsound)+')';
    try{return await query($query,url);}catch(error){return error}
};
const getUrlsBySonido = async(sonido) => {
    var resultado=null;
    // Realizar una consulta
    $query = 'SELECT * from UrlSonido where sonido = '+connection.escape(sonido);
    try{return await query($query);}catch(error){return error}
}
const deleteUrl = async(sonido,url) => {
    var resultado=null;
    // Realizar una consulta
    $query = 'Delete from UrlSonido where url = '+connection.escape(url)+' and sonido = '+connection.escape(sonido);
    try{return await query($query);}catch(error){return error}
};
//Obtener ruta Archivo
const obtenerArchivo = async(sonido) => {
    var resultado=null;
    // Realizar una consulta
    $query = 'select path,url from Sonido,UrlSonido where nombre = '+connection.escape(sonido)+' and sonido='+connection.escape(sonido)+' ORDER BY RAND() LIMIT 1;';
    try{return await query($query);}catch(error){return error}
};
//Tabla sonido
exports.getSearch=getSearch;
exports.getSonidoByName=getSonidoByName;
exports.getSonidos=getSonidos;
exports.createSonido=createSonido;
exports.deleteSonido=deleteSonido;
exports.updateSonido=updateSonido;
//Tabla URL
exports.createUrl=createUrl;
exports.getUrlsBySonido=getUrlsBySonido;
exports.deleteUrl=deleteUrl;
//Tabla Etiquetas
exports.createEtiqueta=createEtiqueta;
exports.getEtiquetasBySonido=getEtiquetasBySonido;
exports.deleteEtiqueta=deleteEtiqueta;

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
//Obtener ruta Archivo
exports.obtenerArchivo=obtenerArchivo;



