var express = require("express"); //llamamos a Express
const router = express.Router();

const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const FileController = require("./controllers/FileController");
const fileController = new FileController();
var app = express();
const dao = require("./Models/dao.js");
const service = require("./controllers/services");
const middleware = require("./controllers/middleware");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload());
app.use("/api", router);

app.use(express.static(__dirname));

var port = process.env.PORT || 8080; // establecemos nuestro puerto

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.get("/prueba", (req, res) => {
    res.send("Lo lograste");
});


app.post("/login", async (req, res) => {
    if (!req.body || !req.body.usr || !req.body.psw) {
        res.json({
            mensaje: "Se requieren los parametros completos.",
            error: "MISSING_PARAM",
        });
        return;
    }
    let username = req.body.usr;
    let password = req.body.psw;
    if (
        await dao.getLogin({
            usr: username,
            psw: password,
        })
    ) {
        let result = await dao.getUserByUsername(username);
        let user = {
            Resultado: "Success",
            id: result.Data[0].id,
            username: result.Data[0].username,
            nombre: result.Data[0].nombre,
            email: result.Data[0].email,
            isActive: result.Data[0].isActive,
            isAdmin: result.Data[0].isAdmin,
            token: service.createToken(username),
        };
        res.json(user);
    } else {
        res.json({
            Resultado: "Error",
            Message: "Usuario " + username + " o Credenciales Incorrectas.",
            Data: req.body,
        });
    }
});

app.post("/register", async (req, res) => {
    if (
        !req.body ||
        !req.body.username ||
        !req.body.email ||
        !req.body.nombre || 
        !req.body.password
    ) {
        res.json({
            mensaje: "Parametros incompletos.",
            error: "MISSING_PARAM",
        });
        return;
    }

    let username = req.body.username;
    let email = req.body.email;
    let nombre = req.body.nombre;
    let password = req.body.password;

    let response = await dao.createUser(username, email, nombre, password)
    if(response) {
        res.send(response);
    } else {
        res.status(500).send({message: "unable to create user"});
    }
});

//Consultas a base de datos
//Selects
app.post("/getSonidos",  async (req, res) => {
    await res.send(await dao.getSonidos());
});
app.post("/getSearch",  async (req, res) => {
    await res.send(await dao.getSearch(req.body.search));
});
app.post("/getSonidoByName",  async (req, res) => {
    await res.send(await dao.getSonidoByName(req.body.name));
});
app.post("/getEtiquetasBySonido",  async (req, res) => {
    await res.send(await dao.getEtiquetasBySonido(req.body.name));
});
app.post("/getUrlsBySonido",  async (req, res) => {
    await res.send(await dao.getUrlsBySonido(req.body.name));
});
//Inserts
app.post("/insertSonido",  async (req, res) => {
    await res.send(await dao.createSonido(req.body.name));
});
app.post("/inserEtiqueta",  async (req, res) => {
    await res.send(await dao.createEtiqueta(req.body.Etiqueta));
});
//Delets
app.post("/deleteSonido",  async (req, res) => {
    await res.send(await dao.deleteSonido(req.body.name));
});
app.post("/deleteEtiqueta",  async (req, res) => {
    await res.send(await dao.deleteEtiqueta(req.body.name, req.body.etiqueta));
});
//obtenerArchivo
app.post("/obtenerArchivo",  async (req, res) => {
    await res.send(await dao.obtenerArchivo(req.body.name));
});
app.post("/saludar",  async (req, res) => {
    let user = req.body.usr;
    res.json({ Resultado: "Succes", Message: "Hola " + user + "!!!" });
});
app.post("/AddSound", fileController.subirArchivo);
app.post("/RemoveSound", fileController.borrarArchivo);
app.post("/RemoveFolderSonido", fileController.borrarFolder);
app.get("/", (req, res) => res.send("ok"));
// iniciamos nuestro servidor
app.listen(port);
console.log("API escuchando en el puerto " + port);
