require("appdynamics").profile({
    controllerHostName: "ec2-52-64-15-64.ap-southeast-2.compute.amazonaws.com",
    //controllerHostName: 'aruganga-m-l2db.local',
    controllerPort: 8090,
    accountName: 'customer1',
    //accountAccessKey: '1afacb63-b7b2-4d04-be54-bf173dde4c0e',
    accountAccessKey: 'cc85737f-7626-41a2-81d6-2c72250f07d3',
    applicationName: 'mysql',
    tierName: 'nodejs_mysql',
    nodeName: 'process',
    debug: true,
    libagent: true,
    logging: {
        logfiles: [
             {'filename': 'nodejs_agent_%N.log', 'level': 'TRACE'},
             {'filename': 'nodejs_agent_%N.protolog', 'level': 'TRACE', 'channel': 'protobuf'}
         ]
     }
 });
 
 const express = require('express')
 const app = express()
 const rest_request = require('request')
 
 const mysql = require('./helpers/mysql.js')
 
 const redis = require('./helpers/redis.js')
 
 
 app.get('/service', function(request, response){
     console.log('Pong')
     response.send('pong')
 })
 
 app.get('/mysql', function(request, response){
     console.log('hit to mysql endpoint')
     mysql.performAllAction(
         function(err){
             console.error('Failed with error', err)
         },
         function(data){
             console.log(data)
             response.json(data)
         }
     )
 })
 
 app.get('/service/http?reg=2000', function(request, response){
     console.log('hit to http endpoint')
 
     rest_request('http://localhost:3002', function (error, resp, body) {
         if(error) {
             response.status(500)
             response.send('failed!! in calling the aux service')
         } else {
             response.send('Successful!! in calling the aux service')
         }
     })
 })

 app.get('/exception', function(req, resp) {
    if(Math.random() >= 0.5) {
      //throw new Error('MY error');
       try {
         throw new Error('MY error');
       } catch(err) {
         console.log(err)
         resp.status(500)
         resp.render('error', { error: err })
       }
    } else {
      resp.send("Heloo World");
    }
 });
 
 app.get('/service/redis?reg=0', function(request, response){
     console.log('hit to redis endpoint')
     redis.performAllAction(
         function(err){
             console.error('Failed with error', err)
         },
         function(data) {
             response.json(data)
         }
     )
 })
 
 app.get('/all', function(request, response){
     console.log('hit to all endpoint')
     var myjson = new Object()
     try {
         mysql.performAllAction(
             function(err){ 
                 console.error('Failed with error', err)
             },
             function(data){
                 myjson['mysql'] = data
                 redis.performAllAction(
                     function(err){ 
                         console.error('Failed with error', err)
                     },
                     function(data){
                         myjson['redis'] = data
 
                         rest_request('http://localhost:3002', function (error, resp, body) {
                             if(error) {
                                 myjson.http = 'failed!! in calling the aux service'
                             } else {
                                 myjson.http = 'Successful!! in calling the aux service'
                             }
                             response.json(myjson)
                         }
                     )
                 }
             )
         })
     } catch(err) {
         console.error('Failed with error', err)
     }
 })
 
 mysql.init(
     function(err){
         console.error('Failed with error', err)
         process.exit(1)
     },
     function(){
         app.listen('3000', function(){
             console.log('listening to port 3000......')
         })
     }
 )
 
