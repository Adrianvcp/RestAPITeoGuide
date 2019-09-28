var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;
var con = mysql.createConnection({
    host:'us-cdbr-iron-east-02.cleardb.net',
    user:'b5f6ca89d2404e',
    password:'010d55c9',
    port: 3306,
    database:'heroku_ffe31819dfbd5d2'
});



var app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));




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


app.listen(PORT,()=>{
    console.log('Teoguide REST  FULL ON ' + PORT);
})