const express = require('express');
const {json} = require("express");
const app = express();
app.use(express.json());
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("api.db");



app.get("/", function (req, res, next){
    res.send("Please access /api/");
});

//WORKING
app.get("/api", async function (req, res, next){
    console.log('Return whole collection JSON to user')

    var sql = "select * from movies"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"RETRIEVAL SUCCESSFUL",
            "data":rows
        })
    });

});

//WORKING
app.put("/api/", async function (req, res, next){
   console.log('PUT route hit | ATTEMPTING TO REPLACE COLLECTION')
    const deleteMovies = await db.run("DELETE FROM movies");

   console.log(req.body)
    var data = await db.prepare("INSERT INTO movies VALUES(?,?,?)");

    req.body.forEach(async function(row){
        console.log(row['title']);
        await data.run(row['title'], row['release_year'], row['time_viewed']);
    })
    data.finalize();

    res.json({
        "Message": "REPLACE COLLECTION SUCCESSFUL"
    });

});

//WORKING
app.post("/api/", async function (req, res, next){
   console.log('POST route hit | ATTEMPTING TO INSERT RECORD');
   console.log('title: ',req.body.title);

    var insertedData;
   try{
        var data = await db.prepare("INSERT INTO movies VALUES(?,?,?)");
        await data.run(req.body.title, req.body.release_year, req.body.time_viewed);
        data.finalize();
        insertedData = {
            "Message": "CREATE ENTRY SUCCESSFUL",
            "Inserted Movies":{
                "title": req.body.title,
                "release_year": req.body.release_year,
                "time_viewed": req.body.time_viewed
            }
        }
    }catch(Exception){
        console.log(Exception);
    }

    res.json(insertedData);
});

//WORKING
app.delete("/api/", async function (req, res, next){
   console.log('DELETE route hit | ATTEMPTING TO DELETE COLLECTION');
   const data = await db.run("DELETE FROM movies");
   res.json({"Message": "DELETE COLLECTION SUCCESSFUL"});
});

//WORKING
app.get("/api/:id", async function (req, res, next){
    console.log("ID route working")
    console.log('Return specific record with ID here')
    //
    var movie = await db.get("SELECT * FROM movies WHERE rowid = ?", req.params.id, function (err, row){
        if(err){

            res.status(400).json({"Message": err.message})
            console.log(err);
        }
        console.log(row);
        res.json({
            "Message": "RETRIEVAL SUCCESSFUL",
            "movie":row
        });
    });
});

//WORKING
app.put("/api/:id", async function (req, res, next){
    console.log('PUT route hit | ATTEMPTING TO REPLACE SPECIFIC MOVIE WITH ID OF: ', req.params.id);

    params =[req.body.title, req.body.release_year, req.body.time_viewed, req.params.id]
    console.log(req.params.id);
    await db.run("UPDATE movies SET title = ?, release_year = ?, time_viewed = ? WHERE rowid = ?", params, function (err, results){
        if(err){
            console.log(err)
        }
        res.json({
            "Message": "UPDATE ITEM SUCCESSFUL",
            "Updated Record":{
                "rowid": req.params.id,
                "title": req.body.title,
                "release_year": req.body.release_year,
                "time_viewed":req.body.time_viewed
            }
        })
    });

});

//WORKING
app.delete("/api/:id", async function (req, res, next){
    console.log('DELETE route hit | ATTEMPTING TO DELETE ITEM FROM COLLECTION');
    const data = await db.run("DELETE FROM movies WHERE rowid = (?)")
    res.json({"Message": "DELETE ITEM SUCCESSFUL"});
});

async function dropTable(){
    await db.run("DROP TABLE IF EXISTS movies")

}

async function startup(){

    console.log('trying to drop movies table');

    //call drop tables method, was having issues with drop table not being done all the time when called inline
    //yeah its still happening, but it only happens if the db file already exists, no issues if i delete it every time,
    //but then whats the point in dropping the table if im just going to delete the file
    var a = await dropTable();

    console.log(a);

        // console.log('trying to create movies table');
    await db.run("CREATE TABLE movies (title text, release_year text, time_viewed text)");
        // console.log('movies table created');


    const server = app.listen(3000, function() {
        console.log("Example app listening....");
    });
}

startup();
