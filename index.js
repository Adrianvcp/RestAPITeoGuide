var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const PORT = process.env.PORT || 3000;

//Req. Documentacion
const swaggerOptions = {
    swaggerDefinition: {
      // Like the one described here: https://swagger.io/specification/#infoObject
      info: {
        title: 'TeoGuide Nodejs Documentacion',
        version: '1.0.0',
        description: 'Documentacion del restful en nodejs de teoguide',
        contact:{
            name:"Amazing Developer"
        },
        servers: ["http://localhost:5000"]
        
      }
    },
    // List of files to be processes. You can also set globs './routes/*.js'
    apis: ['index.js'],
  };

const swaggerDocs = swaggerJsdoc(swaggerOptions);

//Crd. Api Google Visio
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient({
    keyFilename: './TeoGuide-2517cc5884b2.json'
});
  

//Cred BD
var con = mysql.createConnection({
    host:'remotemysql.com',
    user:'rapzajWRTH',
    password:'7XZy5ZqrH2',
    port: 3306,
    database:'rapzajWRTH'
});


var app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));



app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerDocs))

//ROUTES
/**
 *  @swagger
 *  /centro:
 *    get:
 *      description: Obtiene todos los centros Turisticos
 *      responses:
 *          '200':
 *              description: Exito
 */
//get all centros 
app.get("/centro",(req,res,next)=>{
    con.query('SELECT * FROM centrohistortico recurso',function(error,result,fields){
        con.on('error',function (err) {
            console.log('[MY SQL ERROR]',err);
        });

        if (result && result.length) {
            res.end(JSON.stringify(result));
        }else{
            res.end(JSON.stringify("No  hay centros en la BD"));
        }

    });
});



/**
 *  @swagger
 *  /buscarFoto:
 *    get:
 *      description: Obtiene centro Turistico mediante la foto
 *      responses:
 *          '200':
 *              description: Exito
 */
//get buscarporfoto 
app.get("/buscarFoto",(req,res,next)=>{
/*     client
        .labelDetection('img/08c.el-pensador-pequeño-1.jpg')
        .then(results => {
            const labels = results[0].labelAnnotations;

            console.log('Labels:');
            labels.forEach(label => console.log(label));
            console.log('Results');
            console.log(results);
        })
        
        .catch(err => {
            console.error('ERROR:', err);
        }); */

    client
        .webDetection('img/08c.el-pensador-pequeño-1.jpg')
        .then(response => {
            const labels = response[0].webDetection.webEntities;
            //var rst = []
            console.log("Resultado");
            labels.forEach(label => console.log(label.description));

            //console.log(labels[0].description)
            con.query("SELECT * FROM centrohistortico WHERE nNombre like '"+labels[0].description +"'",function(error,result,fields){
                con.on('error',function (err) {
                    console.log('[MY SQL ERROR]',err);
                });

                if (result && result.length) {
                    res.end(JSON.stringify(result));
                }else{
                    res.end(JSON.stringify("No  hay centros en la BD"));
                }
            });


        })
        .catch(err => {
          console.error(err);
        });
    

        
});


/**
 *  @swagger
 *  /login:
 *    get:
 *      description: Ingreso al sistema con 2 parametros de entradad
 *      responses:
 *          '200':
 *              description: Exito
 */
//LogIn
app.post("/login",(req,res,next)=>{
    var post_data = req.body;
    var correo = post_data.correo;
    var pass = post_data.pass;
    var query = "SELECT * FROM usuario WHERE tCorreo = '"+correo+"' AND tContraseña = '"+pass+"'";
    
    con.query(query,function(error,result,fields) {
        con.on('error',function (err) {
            console.log('[MY SQL ERROR]',err);
        });
        
        if (result && result.length) {
            res.end(JSON.stringify(result));
        }
        else{
            res.end(JSON.stringify("Usuario no encontrado"));
        }
    })    
});

/**
 *  @swagger
 *  /centro/idcentro:
 *    get:
 *      description: Obtiene el centro Turistico mediante el id(1,2,3,etc)
 *      responses:
 *          '200':
 *              description: Exito
 */
//get centros por idCentroH
app.get("/centro/:idcentroh",(req,res,next)=>{
    con.query('SELECT * FROM centrohistortico where idCentroH=?',[req.params.idcentroh],function(error,result,fields){
        con.on('error',function (err) {
            console.log('[MY SQL ERROR]',err);
        });

        if (result && result.length) {
            res.end(JSON.stringify(result));
        }else{
            res.end(JSON.stringify("No centro here"));
        }

    });
});

/**
 *  @swagger
 *  /perfil/1:
 *    get:
 *      description: Obtiene el perfil del centro Turistico mediante el id(1,2,3,etc)
 *      responses:
 *          '200':
 *              description: Exito
 */
//get perfil Centro historico(con recursos) por idCentroH
app.get("/perfil/:idcentroh",(req,res,next)=>{
    con.query('SELECT * FROM centrohistortico c INNER JOIN recurso r where c.idCentroH=?',[req.params.idcentroh],function(error,result,fields){
        con.on('error',function (err) {
            console.log('[MY SQL ERROR]',err);
        });
        if (result && result.length) {
            res.end(JSON.stringify(result));
        }else{
            res.end(JSON.stringify("No centro "));
        }

    });
});

/**
 *  @swagger
 *  /usuario/1:
 *    get:
 *      description: Obtiene al usuario mediante el id(1,2,3,etc)
 *      responses:
 *          '200':
 *              description: Exito
 */
//get profile(usuario) por id
app.get("/profile/:idusuario",(req,res,next)=>{
    con.query('SELECT * FROM usuario u INNER JOIN redessociales r where u.idUsuario=?',[req.params.idusuario],function(error,result,fields){
        con.on('error',function (err) {
            console.log('[MY SQL ERROR]',err);
        });
        if (result && result.length) {
            res.end(JSON.stringify(result));
        }else{
            res.end(JSON.stringify("No profile "));
        }
    });
});

//get
app.post("/usuario",(req,res,next)=>{
    var post_data = req.body;
    var correo_search = post_data.search;
    var query = "SELECT * FROM usuario WHERE tCorreo LIKE '%"+correo_search+"%'";
    
    con.query(query,function(error,result,fields) {
        con.on('error',function (err) {
            console.log('[MY SQL ERROR]',err);
        });
        
        if (result && result.length) {
            res.end(JSON.stringify(result));
        }
        else{
            res.end(JSON.stringify("Usuario no encontrado"));
        }
    })    
});


/**
 *  @swagger
 *  /cronograma:
 *    get:
 *      description: Obtiene todos los cronogramas regisrados
 *      responses:
 *          '200':
 *              description: Exito
 */
//get all Cronograma
app.get("/Cronograma",(req,res,next)=>{
    con.query('SELECT * FROM Cronograma',function(error,result,fields){
        con.on('error',function (err) {
            console.log('[MY SQL ERROR]',err);
        });

        if (result && result.length) {
            res.end(JSON.stringify(result));
        }else{
            res.end(JSON.stringify("No hay Cronogramas en la BD"));
        }

    });
});

/**
 *  @swagger
 *  /usuarios:
 *    get:
 *      description: Obtiene todos los usuarios
 *      responses:
 *          '200':
 *              description: Exito
 */
//get all Usuarios
app.get("/usuarios",(req,res,next)=>{
    con.query('SELECT * FROM usuario',function(error,result,fields){
        con.on('error',function (err) {
            console.log('[MY SQL ERROR]',err);
        });

        if (result && result.length) {
            res.end(JSON.stringify(result));
        }else{
            res.end(JSON.stringify("No hay usuarios en la BD"));
        }

    });
});

/**
 *  @swagger
 *  /centro:
 *    get:
 *      description: Obtiene todos los formatos para los recusos(.mp3,.avi,etc)
 *      responses:
 *          '200':
 *              description: Exito
 */
//get all formato
app.get("/formato",(req,res,next)=>{
    con.query('SELECT * FROM formato',function(error,result,fields){
        con.on('error',function (err) {
            console.log('[MY SQL ERROR]',err);
        });

        if (result && result.length) {
            res.end(JSON.stringify(result));
        }else{
            res.end(JSON.stringify("No hay formatos en la BD"));
        }

    });
});

/**
 *  @swagger
 *  /centro:
 *    get:
 *      description: Obtiene todos los idiomas
 *      responses:
 *          '200':
 *              description: Exito
 */
//get all idioma
app.get("/idioma",(req,res,next)=>{
    con.query('SELECT * FROM idioma',function(error,result,fields){
        con.on('error',function (err) {
            console.log('[MY SQL ERROR]',err);
        });

        if (result && result.length) {
            res.end(JSON.stringify(result));
        }else{
            res.end(JSON.stringify("No hay idiomas en la BD"));
        }

    });
});

/**
 *  @swagger
 *  /centro:
 *    get:
 *      description: Obtiene todos los recursos
 *      responses:
 *          '200':
 *              description: Exito
 */
//get all Recursos
app.get("/recursos",(req,res,next)=>{
    con.query('SELECT * FROM recursos',function(error,result,fields){
        con.on('error',function (err) {
            console.log('[MY SQL ERROR]',err);
        });

        if (result && result.length) {
            res.end(JSON.stringify(result));
        }else{
            res.end(JSON.stringify("No hay recursos en la BD"));
        }

    });
});

app.post("/filter",(req,res,next)=>{
    var post_data = req.body;
    var array = JSON.parse(post_data.data);
    var query = "SELECT * FROM manga WHERE ID IN (SELECT MangaID FROM mangacategory";
    if (array.length > 0) {
        query+=" GROUP BY MangaID";
        if (array.length == 1) 
            query+=" HAVING SUM(CASE WHEN CategoryID = "+array[0]+ " THEN 1 ELSE 0 END) > 0)";
        else{
            for (var i =0; i < array.length; i++) {
                if(i==0)
                    query +="HAVING SUM (CASE WHEN CategoryID="+array[0]+ " THEN 1 ELSE 0 END)>0 AND";
                else if(i==array.length-1)
                    query +="SUM (CASE WHEN CategoryID="+array[i]+ " THEN 1 ELSE 0 END)>0)";
                else
                    query +="SUM (CASE WHEN CategoryID="+array[i]+ " THEN 1 ELSE 0 END)>0 AND";
            }
        }
    }
    con.query(query,function(error,result,fields) {
        con.on('error',function (err) {
            console.log('[MY SQL ERROR]',err);
        });
        
        if (result && result.length) {
            res.end(JSON.stringify(result));
        }
        else{
            res.end(JSON.stringify("No comic here"));
        }
    })
});

function base64Image(src) {
    var data = fs.readFileSync(src).toString('base64');
    return util.format('data:%s;base64,%s', mime.lookup(src), data);
  }

app.listen(PORT,()=>{
    console.log('Teoguide REST  FULL ON ' + PORT);
})