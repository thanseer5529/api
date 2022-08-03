// https://student-details-test-api.herokuapp.com/ 

const express = require("express");
var mongo = require("mongoose");
// var Obj=mongo.Types.ObjectId();

const fp = require("express-fileupload")
const app = express();

// app.use(express.json());

app.use(fp())
const db = require("../src/db/connection");

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`connection established on ${port}`);
});

db.db_connect();

//welcome message
app.get("/", (req, res) => {
    res.send("welcome to my student api");
});

app.post("/student", async (req, res) => {
    var body = req.body;

    let require = ["name", "place"];
    console.log(req.body);
    err = require.filter((value) => {

        if (!(Object.keys(body).includes(value))) {
            return value;
        }
    });
    console.log(err);

    if (err.length <= 0) {
        let record = await db.get_db_status().collection("user").findOne({ name: req.body.name, place: req.body.place });
        if (record) {
            res.json({ message: "student all ready exist", record: record });
        } else {
            db.get_db_status()
                .collection("user")
                .insertOne(req.body, (err, data) => {
                    if (err) res.json({ message: "error occured in add new student", error: err });
                    else res.json({ message: "new stduent added ", status: data });
                });
        }
    } else {
        res.json({ message: "required field was not found", required: err });
    }
});

//list all students;

app.get("/students", async (req, res) => {
    let record = await db.get_db_status().collection("user").find().project({}).toArray();
    if (record.length <= 0) res.json({ message: "there is no student" });
    else res.json(record);
});

app.patch("/student", async (req, res) => {
    let required = ["name", "place"];
    let keys = Object.keys(req.body);
    err = required.filter((value) => {
        return !keys.includes(value);
    });

    if (err.length <= 0) {
        let record = await db.get_db_status().collection("user").findOne({ name: req.body.name, place: req.body.place });
        console.log(record);
        if (record) {
            res.json({ message: "record alredy exist", record: record })
        } else {
            id = req.body.id;
            delete req.body.id;
            db.get_db_status()
                .collection("user")
                .updateOne({ _id: mongo.Types.ObjectId(id) }, { $set: req.body }, (err, data) => {
                    if (!err) {
                        res.json(data);
                    } else {
                        res.json({ message: "error occured", error: err });
                    }
                });
        }
    } else {
        res.json({ message: "required field was not found", required: err });
    } 
}); 
app.delete("/student/:id", (req, res) => {
    db.get_db_status()
        .collection("user")
        .deleteOne({ _id: mongo.Types.ObjectId(req.params.id) }, (err, data) => {
            if (!err) {
                res.json({ message: "deleted", status: data });
            } else {
                res.json({ message: "error occured in deletiion", error: err });
            }
        });
});
