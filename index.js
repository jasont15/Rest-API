const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

// Creates simple example medical data that can be manipulated with HTTP requests

let patients = new Object();
patients["123212345"] = ["Levi", "Johnson", "555-435-7892"]
patients["121382903"] = ["Erin", "Peterson", "555-435-7892"]

let records = new Object();
records["123212345"] = "Status: Healthy"
records["121382903"] = "Status: Slight Cold"

//Gets patient medical records
app.get("/records", (req, res) => {
    // Verifies patient exists
    if (records[req.headers.ssn] === undefined) {
        res.status(404).send({"msg" : "Patient not found."})
        return;
    }

    // Verify SSN matches first and last name
    if (req.headers.firstname == patients[req.headers.ssn][0] && req.headers.lastname == patients[req.headers.ssn][0]){
        if(req.body.reasonforvisit === "medicalrecords") {
            // Returns medical records
            res.status(200).send(records[req.headers.ssn]);
            return;
        }
        else {
            // Returns error
            res.status(501).send({"msg":"Unable to complete request at this time: " + req.body.reasonforvisit})
            return;
        }
    }
    else {
        res.status(401).send({"msg": "First or Last Name didn't match SSN."})
        return;
    }
    // Returns appropriate record
    res.status(200).send({"msg": "HTTP GET = Success!"});
});

// Creates a new patient
app.post("/", (req, res) => {

    // Create patient in database
    patients[req.headers.ssn] = [req.headers.firstname, req.headers.lastname, req.headers.phone]
    res.status(200).send(patients)
});

// Updates existing patient phone number
app.put("/", (req, res) => {
    // Verifies patient exists
    if (records[req.headers.ssn] === undefined) {
        res.status(404).send({"msg" : "Patient not found."})
        return;
    }
     // Verify SSN matches first and last name
     if (req.headers.firstname == patients[req.headers.ssn][0] && req.headers.lastname == patients[req.headers.ssn][0]){
       // Update the phone number and return the patient info 
       patients[req.headers.ssn] = [req.headers.firstname, req.headers.lastname, req.body.phone];
       res.status(200).send(patients[req.headers.ssn]);
       return;
    }
    else {
        res.status(401).send({"msg": "First or Last Name didn't match SSN. (Trying to update phone number)"})
        return;
    }

    // Make sure 
    res.status(200).send({"msg": "HTTP PUT - SUCCESS!"})
});

// Delete a patient's records
app.delete("/", (req, res) => {
    // Verifies patient exists
    if (records[req.headers.ssn] === undefined) {
        res.status(404).send({"msg" : "Patient not found."})
        return;
}

    // Verifies SSN matches first and last name
    if (req.headers.firstname == patients[req.headers.ssn][0] && req.headers.lastname == patients[req.headers.ssn][0]){
        // Deletes patient and medical records from database
        delete patients[req.headers.ssn]
        delete records[req.headers.ssn]

        res.status(200).send(patients)
        return;
}
    // Returns error code
    else {
        res.status(401).send({"msg": "First or Last Name didn't match SSN."})
        return;
}
});

app.listen(3000);