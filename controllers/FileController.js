const fleSystem = require('fs');
class FileController
{
  subirArchivo = async (req, res, next) =>
  {
    const 
  }
}
async function makeFile(req){
  const archivo = req.files;
    const fileName = archivo["audio0"].name;
    const path = __dirname + '/../Sounds/'+req.body.nombre +"/"+ fileName;
    console.log(archivo["audio0"]);
    const carpeta=__dirname + '/../Sounds/'+req.body.nombre +"/";
    await makeCarpeta(carpeta);
    try {
      const file = await fleSystem.writeFile(path,archivo["audio0"].data, (error) => {
        if (error) {
          console.error(error);
          res.writeHead(500, {
            'Content-Type': 'application/json'
          });
          res.end(JSON.stringify({ status: 'error', message: error }));
            return;
          }
          return res.status(200).send({ status: 'success', path:'/uploads/' + fileName });
       });
     } catch (e) {
       res.status(500).json({
         error: true,
         message: e.toString()
       });
     }
}
async function makeCarpeta(carpeta){
  try {
      if (!fileExists(carpeta)) {
        console.log("no exists: " + carpeta);
         await fleSystem.mkdirSync(carpeta,{recursive:true},(error) => {
          if (error) {
            console.error(error);
            res.writeHead(500, {
              'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({ status: 'error', message: error }));
              return;
            }
         });
      }
    } catch (error) {
      
    }
    return;
}
function fileExists(path) {
  try {
    return fs.statSync(path).isFile();
  } catch (e) {
    return false;
  }
}
module.exports = FileController;