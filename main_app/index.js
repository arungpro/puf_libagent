require("appdynamics").profile({
    controllerHostName: process.env.CONTROLLER_HOST_NAME,
    controllerPort: process.env.CONTROLLER_HOST_PORT,
    accountName: process.env.Account_Name,
    accountAccessKey: process.env.Account_ACC_KEY,
    applicationName: 'TestMemUsage',
    tierName: 'main_tier',
    nodeName: 'process',
    debug: true,
    libagent: true
});

const express = require('express')
const app = express()
const rest_request = require('request')

const mysql = require('./helpers/mysql.js')

const redis = require('./helpers/redis.js')


app.get('/', function(request, response){
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

app.get('/http', function(request, response){
    console.log('hit to http endpoint')

    rest_request('http://aux_app:3002', function (error, resp, body) {
        if(error) {
            response.status(500)
            response.send('failed!! in calling the aux service')
        } else {
            response.send('Successful!! in calling the aux service')
        }
    })
})

app.get('/redis', function(request, response){
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

                        rest_request('http://aux_app:3002', function (error, resp, body) {
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
