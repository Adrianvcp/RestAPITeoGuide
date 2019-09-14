var express = require('express');
var mysql = require('mysql');

var con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    port: 3307,
    database:'teoguideDB'
});


var app = express();


//get all centros
app.get("/centro",(req,res,next)=>{
    con.query('SELECT * FROM centrohistortico',function(error,result,fields){
        con.on('error',function (err) {
            console.log('[MY SQL ERROR]',err);
        });

        if (result && result.length) {
            res.end(JSON.stringify(result));
        }else{
            res.end(JSON.stringify("No hay centros en la BD"));
        }

    });
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

//get centros by idCentroH
app.get("/centro/:idCentroH",(req,res,next)=>{
    con.query('SELECT * FROM centro where idCentroH=?',[req.params.idCentroH],function(error,result,fields){
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



app.listen(3000,()=>{
    console.log('Teoguide REST FUL ON 3000');
})