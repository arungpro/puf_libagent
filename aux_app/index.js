require("appdynamics").profile({
   controllerHostName: process.env.CONTROLLER_HOST_NAME,
   controllerPort: process.env.CONTROLLER_HOST_PORT,
   accountName: process.env.Account_Name,
   accountAccessKey: process.env.Account_ACC_KEY,
   applicationName: 'TestMemUsage',
   tierName: 'aux_tier',
   nodeName: 'process',
   debug: true,
   libagent: true
});

const express = require('express')
const app = express()

app.get('/', function(request, response){
    process.nextTick(function() {
        response.end()
    })
    console.log('Aux get ran for awhile')
    response.send('Aux get ran for awhile')
})

app.listen('3002', function(){
    console.log('listening to post 3002......')
})
