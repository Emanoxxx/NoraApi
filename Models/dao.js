// Obtenga el servicio mysql
const mysql = require("mysql");
const noraDBCredentials = require("../../NoraDB.json");
// Agregue las credenciales para acceder a su base de datos
const connection = mysql.createConnection({
    host: noraDBCredentials.host,
    user: noraDBCredentials.user,
    password: noraDBCredentials.password,
    database: noraDBCredentials.database,
});
const pool = mysql.createPool({
    host: noraDBCredentials.host,
    user: noraDBCredentials.user,
    password: noraDBCredentials.password,
    database: noraDBCredentials.database,
});
function connectDB() {
    connection.connect(function (err) {
        // en caso de error
        if (err) {
            console.log(err.code);
            console.log(err.fatal);
            return false;
        }
    });
    return true;
}

function query(sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject({
                    Resultado: "Error",
                    Message: err,
                    Code: "DB-ERROR-01",
                    archivo: values,
                });
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject({
                            Resultado: "Error",
                            Message: err,
                            Code: "DB-ERROR-02",
                            archivo: values,
                        });
                    } else {
                        resolve({
                            Resultado: "Success",
                            Message: "Consulta exitosa",
                            Data: rows,
                            archivo: values,
                        });
                    }
                    connection.release();
                });
            }
        });
    });
}
//Tabla sonido
const getSonidos = async () => {
    var resultado = null;
    // Realizar una consulta
    $query = "SELECT * from Sonido";
    try {
        return await query($query);
    } catch (error) {
        return error;
    }
};
const getSearch = async (search) => {
    var resultado = null;
    // Realizar una consulta
    $query =
        "SELECT * from Sonido where nombre like " +
        connection.escape("%" + search + "%");
    try {
        return await query($query);
    } catch (error) {
        return error;
    }
};
const createSonido = async (sonido) => {
    var resultado = null;
    // Realizar una consulta
    $query =
        "insert into Sonido values (" +
        connection.escape(sonido) +
        "," +
        connection.escape("/" + sonido + "/").toLowerCase() +
        ")";
    console.log($query);
    try {
        return await query($query);
    } catch (error) {
        return error;
    }
};
const getSonidoByName = async (sonido) => {
    var resultado = null;
    // Realizar una consulta
    $query = "SELECT * from Sonido where nombre = " + connection.escape(sonido);
    try {
        return await query($query);
    } catch (error) {
        return error;
    }
};
const deleteSonido = async (sonido) => {
    var resultado = null;
    // Realizar una consulta
    $query = "Delete from Sonido where nombre = " + connection.escape(sonido);
    try {
        return await query($query);
    } catch (error) {
        return error;
    }
};
const updateSonido = async (sonido) => {
    var resultado = null;
    // Realizar una consulta
    $query =
        "UPDATE Sonido set nombre=" +
        connection.escape(sonido.new) +
        " where nombre = " +
        connection.escape(sonido.old);
    try {
        return await query($query);
    } catch (error) {
        return error;
    }
};
//Tabla etiquetas
const createEtiqueta = async (Etiqueta) => {
    var resultado = null;
    // Realizar una consulta
    $query =
        "insert into EtiquetaSonido values (" +
        connection.escape(Etiqueta.sonido) +
        "," +
        connection.escape(Etiqueta.etiqueta) +
        ")";
    try {
        return await query($query);
    } catch (error) {
        return error;
    }
};
const getEtiquetasBySonido = async (sonido) => {
    var resultado = null;
    // Realizar una consulta
    $query =
        "SELECT * from EtiquetaSonido where sonido = " +
        connection.escape(sonido);
    try {
        return await query($query);
    } catch (error) {
        return error;
    }
};
const deleteEtiqueta = async (sonido, etiqueta) => {
    var resultado = null;
    // Realizar una consulta
    $query =
        "Delete from EtiquetaSonido where etiqueta = " +
        connection.escape(etiqueta) +
        " and sonido = " +
        connection.escape(sonido);
    try {
        return await query($query);
    } catch (error) {
        return error;
    }
};
//Tabla Url
const createUrl = async (url) => {
    var resultado = null;
    // Realizar una consulta
    var sonido = url.sonido;
    var urlsound = url.url;
    $query =
        "insert into UrlSonido values (" +
        connection.escape(sonido) +
        "," +
        connection.escape(urlsound) +
        ")";
    try {
        return await query($query, url);
    } catch (error) {
        return error;
    }
};
const getUrlsBySonido = async (sonido) => {
    var resultado = null;
    // Realizar una consulta
    $query =
        "SELECT * from UrlSonido where sonido = " + connection.escape(sonido);
    try {
        return await query($query);
    } catch (error) {
        return error;
    }
};
const deleteUrl = async (sonido, url) => {
    var resultado = null;
    // Realizar una consulta
    $query =
        "Delete from UrlSonido where url = " +
        connection.escape(url) +
        " and sonido = " +
        connection.escape(sonido);
    try {
        return await query($query);
    } catch (error) {
        return error;
    }
};
//Obtener ruta Archivo
const obtenerArchivo = async (sonido) => {
    var resultado = null;
    // Realizar una consulta
    $query =
        "select path,url from Sonido,UrlSonido,(select sonido from EtiquetaSonido where etiqueta=" +
        connection.escape(sonido) +
        ")as etiqueta where nombre=etiqueta.sonido and UrlSonido.sonido=etiqueta.sonido ORDER BY RAND() LIMIT 1;";
    try {
        return await query($query);
    } catch (error) {
        return error;
    }
};
//Registrar usuario
const createUsuario = async(usuario) => {
    var resultado=null;
    // Realizar una consulta
    $query = 'insert into Usuario(nombre,usuario,pass,isActive,email) values('+connection.escape(usuario.nombre)+','+connection.escape(usuario.usuario)+','+connection.escape(usuario.pass)+',false,'+connection.escape(usuario.correo)+')'
    try{return await query($query);}catch(error){return error}
};
//Tabla sonido
exports.getSearch = getSearch;
exports.getSonidoByName = getSonidoByName;
exports.getSonidos = getSonidos;
exports.createSonido = createSonido;
exports.deleteSonido = deleteSonido;
exports.updateSonido = updateSonido;
//Tabla URL
exports.createUrl = createUrl;
exports.getUrlsBySonido = getUrlsBySonido;
exports.deleteUrl = deleteUrl;
//Tabla Etiquetas
exports.createEtiqueta = createEtiqueta;
exports.getEtiquetasBySonido = getEtiquetasBySonido;
exports.deleteEtiqueta = deleteEtiqueta;

//Tabla Usuario
const getLogin = async (user) => {
    var resultado = null;
    // Realizar una consulta
    $query =
        "select * from Usuario where usuario = BINARY " +
        connection.escape(user.usr) +
        " and pass = BINARY " +
        connection.escape(user.psw);
    resultado = await query($query);
    if ((await resultado.Data.length) > 0) {
        return true;
    } else {
        return false;
    }
    //return resultado;
};
//Tabla Usuario
exports.createUsuario=createUsuario;
exports.getLogin=getLogin;
//Obtener ruta Archivo
exports.obtenerArchivo=obtenerArchivo;

const getUserByUsername = async (username) => {
    $query =
        "select * from Usuario where usuario = BINARY " +
        connection.escape(username);
    let resultado = await query($query);
    if(resultado) {
        let user = resultado.Data[0];
        let response = { 
            id : user.id,
            email: user.email,
            nombre: user.nombre,
            username: user.usuario,
            isActive: user.isActive
        }
        return response;
    } else {
        return null
    }
};

const createUser = async (username, email, nombre, password) => {
    let $query =
        "INSERT into Usuario (usuario, email, nombre, pass, isActive) values (" +
        connection.escape(username) +
        "," +
        connection.escape(email) +
        "," +
        connection.escape(nombre) +
        "," +
        connection.escape(password) +
        "," +
        connection.escape(false) + 
        ");"

    try {
        await query($query);
        return await getUserByUsername(username)
    } catch (err) {
        console.error(err);
        return null
    }
};
//Tabla Usuario
exports.getLogin = getLogin;
exports.getUserByUsername = getUserByUsername;
exports.createUser = createUser;
//Obtener ruta Archivo
exports.obtenerArchivo = obtenerArchivo;
