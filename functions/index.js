const functions = require('firebase-functions');
const admin=require('firebase-admin');
const express = require('express')
const app = express();
admin.initializeApp( {credential: admin.credential.cert(require('../key/admin.json'))
});


app.get('/questions',(request,response)=>{
    admin.firestore().collection("Questions")
    .get()
    .then((data) =>{
        let questions=[]
        data.forEach((docs)=>{
            questions.push(docs.data());
        });
        return response.json(questions);
    })
    .catch((err)=>console.error(err));
});

app.post('/addQuestion',(request,response)=>{
    const newQuestion=
    {
        Mentee:request.body.Mentee,
        Question:request.body.Question,
        Time:new Date().toISOString()
    };
    admin.firestore().collection('Questions')
    .add(newQuestion)
    .then((doc)=>
    {
        return response.json({message:`Document ${doc.id} is added successfully`});
    })
    .catch((err)=>{
        response.status(500).json({error:`something went wrong`});
        console.error(err);
    })
});


exports.api=functions.region('asia-south1').https.onRequest(app);