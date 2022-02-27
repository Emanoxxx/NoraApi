

var express = require("express"); //llamamos a Express
var app = express();
const dao = require("./Models/dao.js");
app.use(express.json());

var port = process.env.PORT || 8080; // establecemos nuestro puerto

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


app.post("/login", async (req, res) => {
    if (!req.body || !req.body.usr || !req.body.psw) {
        res.json({
            mensaje: "Se requieren los parametros completos.",
            error: "MISSING_PARAM",
        });
        return;
    }
    let user = req.body.usr;
    let password = req.body.psw;
    if(await dao.getLogin({
        "usr":user,
        "psw":password
    })){
        res.json({"Resultado":"Succes","Message":"Hola "+user+"!!!","Data":req.body});
    }else{
        res.json({"Resultado":"Error","Message":"Usuario "+user+" o Credenciales Incorrectas.","Data":req.body});
    }
    
})

app.post("/saludar", async (req, res) => {
    let user = req.body.usr;
    res.json({"Resultado":"Succes","Message":"Hola "+user+"!!!"});
})
app.post("/AddSound", async (req, res) => {
    res.json({"Resultado":"Succes","Message":"Hola !!!"});
})
app.post("/RemoveSound", async (req, res) => {
    res.json({"Resultado":"Succes","Message":"Hola !!!"});
})

// iniciamos nuestro servidor
app.listen(port);
console.log("API escuchando en el puerto " + port);