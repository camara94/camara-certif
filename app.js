var express = require("express");
var app = express();
var request = require("request");
var rp = require("request-promise");
var fs = require('fs'); 
var csv = require('csv-parser');

app.set("view engine", "ejs");
app.use(express.static("public"));

var options = {
    url: "http://camaratek.com/api/views/formation.php",
    json: true
};

app.get("/",function(req, res){

    console.log("Bonjour Camara");
    var certs = [];
    rp(options)
    .then(function(data) {
        for(var i=0;i<data.result.certificats.length;i++){
            certs.push(data.result.certificats);
        }

        /*certs.forEach(function (l) {
            console.log(l);
        })*/
        getdetailsfromid(certs);
    })
    .catch((err) => console.log(err));
    
    function getdetailsfromid(id){
        var urls = [];
        for(var i=0;i<certs.length;i++){
            var url = "http://camaratek.com/api/views/formation.php?id=" + (i+1);
            //console.log(url);
            urls.push(url);
            var options = {
                url: urls[i],
                json: true
            };
            var certifs = [];
            rp(options)
            .then(function(data) {
                //console.log(data.result.certificats[0].urlpng);
                certifs.push({
                    id: data.result.certificats[0].id,
                    titre: data.result.certificats[0].titre,
                    numCert: data.result.certificats[0].numCert,
                    urlpng: data.result.certificats[0].urlpng,
                    description: data.result.certificats[0].description,
                    dateCertif: data.result.certificats[0].dateCertif 
                });

                if(certifs.length == 20){
                        // console.log(movie);
                        res.render("home", {certifs: certifs});
                    }
                })
            .catch((err) => console.log(err));
        }
    }
});




/*app.get("/certifdetails/:id", function(req, res){
    var id = req.params.id;

    var options = {
        url = "http://camaratek.com/api/views/formation.php?id=" + id,
        json: true
    }

    rp(options)
    .then(function(data){
        var certif = [];
            // console.log(data)
            certif.push({
                id: data.result.certificats[0].id,
                titre: data.result.certificats[0].titre,
                numCert: data.result.certificats[0].numCert,
                urlpng: data.result.certificats[0].urlpng,
                description: data.result.certificats[0].description,
                auteur: data.result.certificats[0].auteur,
                dateCertif: data.result.certificats[0].plateforme,
                universite: data.result.certificats[0].universite  
            })

            var dict = {};
            var csvdata = [];
            fs.createReadStream("public/assets/Files/joined.csv")
            .pipe(csv())
            .on('data', function(data){
                try {
                    csvdata.push(data);
                }
                catch(err) {
                    console.log(err);
                }
            })
            .on('end',function(){
                    // console.log(csvdata);
                    for (var i=0;i<csvdata.length;i++){
                        dict[csvdata[i].imdbId] = csvdata[i].youtubeId;
                    } 
                    var trailerlink = dict[clickedmovie[0].imdbid.substring(2,).replace(/^0+/, '')];
                    res.render("moviedetails",{clickedmovie: clickedmovie, trailerlink: trailerlink}) 
                });
        });
});*/






app.get("*", function(req, res){
    res.send("Error!! Sorry, Page Not Found");
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("Movie App has started on port: " + port);
});