const mongoclient = require('mongodb').MongoClient
const express = require('express')
const app = express()
const bodyparser = require('body-parser')
let results = "";
let code = 0
app.use(bodyparser.urlencoded({ extended: true }))




mongoclient.connect('mongodb+srv://ShivanshGupta:india@2006@blogdb.xowev.mongodb.net/test?retryWrites=true&w=majority', {
    useUnifiedTopology: true
})


    .then(client => {
        console.log('Connected to database')
        const db = client.db('newpolldb')
        const yourPollCollection = db.collection('newpolls')
        // const auth = db.collection('Auth')
        // const results = db.collection('Results')
        function checkCodeExist(code){
            return yourPollCollection.findOne({code:code}).then((result)=>{
                return result!==null;
            })
        }
        app.set('view engine', 'ejs')


        app.get('/', function (req, res) {
            res.sendFile(__dirname + '/index.html')
        })
        app.set('views', __dirname + '/views');
        app.get('/success', function (req, res) {

            yourPollCollection.find().toArray()
            .then(result=>{                
                res.render('created.ejs',{Results:result})
                            
            })
        })
        
        app.get('/contact', function (req, res) {
            res.render('contact.ejs')
        })
        app.get('/viewpoll', function (req, res) {
            res.render('authentication.ejs')
        })


        app.post('/success', function (req, res) {
            let [q1o1, q1o2, q1o3, q1o4] = req.body.o1.split(",")
            let [q2o1, q2o2, q2o3, q2o4] = req.body.o2.split(",")
            let [q3o1, q3o2, q3o3, q3o4] = req.body.o3.split(",")
            let data = {
                'code': req.body.code,
                'q1': {
                    'name':req.body.q1,
                    'q1o1': {
                        'name':q1o1?q1o1:"",
                        'count':0,
                    },
                    'q1o2': {
                        'name':q1o2 ? q1o2 : "",
                        'count':0,
                    },
                    'q1o3': {
                        'name':q1o3 ? q1o3 : "",
                        'count':0,
                    },
                    'q1o4':{ 
                        'name':q1o4 ? q1o4 : "",
                        'count':0,
                    }

                },
                'q2': {
                    'name':req.body.q2,
                    'q2o1': {
                        'name':q2o1?q2o1:"",
                        'count':0,
                    },
                    'q2o2': {
                        'name':q2o2 ? q2o2 : "",
                        'count':0,
                    },
                    'q2o3': {
                        'name':q2o3 ? q2o3 : "",
                        'count':0,
                    },
                    'q2o4':{ 
                        'name':q2o4 ? q2o4 : "",
                        'count':0,
                    }

                },
                'q3': {
                    'name':req.body.q3,
                    'q3o1': {
                        'name':q3o1?q3o1:"",
                        'count':0,
                    },
                    'q3o2': {
                        'name':q3o2 ? q3o2 : "",
                        'count':0,
                    },
                    'q3o3': {
                        'name':q3o3 ? q3o3 : "",
                        'count':0,
                    },
                    'q3o4':{ 
                        'name':q3o4 ? q3o4 : "",
                        'count':0,
                    }

                }
            }
            checkCodeExist(req.body.code).then((response)=>{
                if(response){
                    console.log("code already exist")
                }else{
                    yourPollCollection.insertOne(data)

                    .then(result => {
                        console.log(result)
                        res.redirect('/success')

                    })
                }
            })
            .catch(error=>{
                console.error(error)
            })
        })

    
            


            app.post('/actualpoll',function(req,res){
                console.log(req.body.code)
                yourPollCollection.find({code:req.body.code}).toArray().then(result=>{
                    // console.log(result)
                    if(result!=null){
                        res.render('actualpoll.ejs',{data:result})
                    }
                })
                
            })
        //     app.get('/actualpoll',function(req,res){

        //         auth.find().toArray() 


        //         .then(result=>{
        //             yourPollCollection.find().toArray()
        //             .then(response=>{
        //                 console.log(response)
        //                 res.render('actualpoll.ejs',{data:{AuthResult:result,PollResult:response}})
        //             })
        //         })
        //         .catch(error=>{
        //             console.error(error)
        //         })
        //      })
             app.post('/auth',function(req,res){
                
                let q1=req.body.q1
                let q2=req.body.q2
                let q3=req.body.q3
                let code=req.body.code

                console.log(req.body)
                console.log(q1)
                let qo='q1.'+req.body.q1+'.count'
                let qtw='q2.'+q2+'.count'
                let qth='q3.'+q3+'.count'
                let data={
                }
                data[qo]=1
                data[qtw]=1
                data[qth]=1
              
                console.log(data)
                yourPollCollection.updateOne(
                    {code:req.body.code},
                    {
                    $inc:data
                },
                
                res.redirect('/submitted')
                    
                )
        })
         app.post('/results',function(req,res){
            code = req.body.code 
            yourPollCollection.find().toArray()
            .then(result=>{                
                res.render('pollresults.ejs',{Results:result, code:code})
                            
            })
         })

         app.get('/submitted',function(req,res){
            res.render('created2.ejs')
         })  
        app.get('/see-results',function(req,res){
            res.render('authentication2.ejs')
         })  
        
        //     console.log('g')
        //     results.find().toArray() 



        //     .then(result=>{
        //         auth.find().toArray()
        //         .then(response=>{
        //             yourPollCollection.find().toArray()
        //             .then(answer=>{
        //                 res.render('pollresults.ejs',{data:{Results:result,Auth:response,PollResult:answer}})
        //             })

        //         })

        //     })
        //     .catch(error=>{
        //         console.error(error)
        //     })
        //  })  

    }).catch(err=>console.error(err))
    
app.listen(3000, function (req, res) {
    console.log('The server is running')

})