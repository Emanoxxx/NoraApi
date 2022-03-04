const fleSystem = require('fs');
const dao = require("../Models/dao");
class FileController
{
  subirArchivo = async (req, res, next) =>
  { 
    res.send(await insertUrl(req));
  }
  borrarArchivo = async (req, res, next) =>
  { 
    res.send(await deleteUrl(req));
  }
  borrarFolder = async (req, res, next) =>
  { 
    res.send(await deleteFolder(req));
  }
}
function deleteFolder(req){
  return new Promise(async (resolve, reject) => {
    let nombre = req.body.name;
    var consultResult= await dao.deleteSonido(nombre);
    if (consultResult.Resultado === "Succes") {
      const path = __dirname + '/../Sounds/'+(nombre).toLowerCase()+"/";
      try {
        deleteCarpeta(path); 
        consultResult={"Resultado":"Succes","ResultadoFile":"Succes","Message":"Sonido borrado","Sonido":nombre};
      } catch(err) {
        consultResult={"Resultado":"Succes","ResultadoFile":"Error","Message":"Sonido no pudo borrarse del servidor, Verifique","Code":"FL-ERROR-01","Sonido":nombre};
      }
    }
      resolve(consultResult);
  })
}


function deleteCarpeta(path) {
  let files = [];
  if( fleSystem.existsSync(path) ) {
      files = fleSystem.readdirSync(path);
      files.forEach(function(file,index){
          let curPath = path + "/" + file;
          if(fleSystem.statSync(curPath).isDirectory()) {
              deleteCarpeta(curPath);
          } else {
              fleSystem.unlinkSync(curPath);
          }
      });
      fleSystem.rmdirSync(path);
  }
}

function deleteUrl(req){
  return new Promise(async (resolve, reject) => {
    let nombre = req.body.name;
    let url = req.body.url;
    var consultResult= await dao.deleteUrl(nombre,url);
    if (consultResult.Resultado === "Succes") {
      const path = __dirname + '/../Sounds/'+(nombre).toLowerCase()+"/"+ url;
      try {
        fleSystem.unlinkSync(path);
        consultResult={"Resultado":"Succes","ResultadoFile":"Succes","Message":"Archivo borrado","Archivo":url};
      } catch(err) {
        consultResult={"Resultado":"Succes","ResultadoFile":"Error","Message":"Archivo no pudo borrarse del servidor, Verifique","Code":"FL-ERROR-01","Archivo":url};
      }
    }
      resolve(consultResult);
  })
}
function insertUrl(req){
  return new Promise(async (resolve, reject) => {
    var archivos=Object.keys(req.files);
    var arregloResultados=[];
    for (let index = 0; index < archivos.length; index++) {
      const archivo = archivos[index];
      var response = await makeFiles(req,archivo);
      if( response.status==="success"){
        var url = {"url":req.files[archivo].name,"sonido":req.body.nombre};
        var consultResult=await dao.createUrl(url);
        if(consultResult.Result==="success"){
          //res.send(consultResult);
          arregloResultados.push(consultResult);
        }else{
          //res.send(consultResult);
          arregloResultados.push(consultResult);
        }
      }else{
        arregloResultados.push({"Resultado":"Error","Message":"Error de Ficheros","Code":"Mk-ERROR-01"});
      }
    }
    resolve(arregloResultados);
  })
}
async function makeFiles(req,sonido){
  const archivo = req.files;
    const fileName = archivo[sonido].name;
    const path = __dirname + '/../Sounds/'+(req.body.nombre).toLowerCase()+"/"+ fileName;
    const carpeta=__dirname + '/../Sounds/'+(req.body.nombre).toLowerCase()+"/";
    await makeCarpetaSounds(carpeta,fileName);
    try {
      const file = await fleSystem.writeFileSync(path,archivo[sonido].data, (error) => {
        if (error) {
          console.error(error);
            return ({ status: 'error', message: error });
          }
          return ({ status: 'success', path:'/sounds/' + fileName });
       });
     } catch (e) {
      return ({ status: 'error', message: error });
     }
     return ({ status: 'success', path:'/sounds/' + fileName });
}
async function makeCarpetaSounds(carpeta,fileName){
  try {
      if (!fileExists(carpeta)) {
         await fleSystem.mkdirSync(carpeta,{recursive:true},(error) => {
          if (error) {
            console.error(error);
            return ({ status: 'error', message: error });
            }
         });
      }
    } catch (error) {
      return ({ status: 'error', message: error });
    }
    return ({ status: 'success', path:'/sounds/' + fileName });
}

function fileExists(path) {
  try {
    if (fleSystem.existsSync(path)) {
        return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}
module.exports = FileController;