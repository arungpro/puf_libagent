# puf_libagent
Simple performance tester for nodejs libagent mode


## About App
I have cluster of 4 instance serving the request and have been using agent v4.5.3. To make it bit complicatedr,
I added few endpoints like

1. /
2. /http - call other serviice
3. /mysql - does table create, insert few rows, updates few rows, delete those rows and the table
4. /redis - key-value creation, updation, deletion
5. /all - do 1, 2, 3, 4 sequentially

## Installation:
Clone this app.
Change below values of main_app and aux_app in docker_composer.yml
```
CONTROLLER_HOST_NAME: '<Host>'
CONTROLLER_HOST_PORT: '8090'
Account_Name: '<acc name>'
Account_ACC_KEY: '1afacb63-b7b2-xxx-be54-xxxxx'
```
## Start container
```
docker-compose build
docker-compose up
```

## Open to keep an eye on
```docker stats```

## Drive continuous load using tool like siege on seperate windows parallelly
```
siege -c 50 -t 15M http://localhost:3000/
siege -c 50 -t 15M http://localhost:3000/http
siege -c 50 -t 15M http://localhost:3000/redis
siege -c 50 -t 15M http://localhost:3000/mysql
siege -c 50 -t 15M http://localhost:3000/all
```
