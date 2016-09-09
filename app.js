'use strict';
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const Bot = require('messenger-bot');
const process = require('process');
const StateManager = require('./StateManager')

const GREETING_MSG = "안녕하세요! HHbot 이에요. 저는 여러분의 위치를 기반으로 버스의 정보를 제공하려 해요.  본 서비스는 여러분의 위치정보를 필요로해요. 아! PC로는 어려울 것 같아요."
const CMSG = 'hello world'

let bot = new Bot({
    token: 'EAAZAafXETcwABAFz2qNcr1OyWRQukdS0LlNO9MUjbRsOvDgWfp7QcZAg4XaZBVoHJrl2FU5ZAMGo44UmBVRqV8ZCClUwTgXn0Jf4om2JQ8mbBZATzTTIFPOoENG1DW5cYK94I8CtKYnm9yRHSj7BLwQkjnP1Y0ui8W2rdBXvBxiQZDZD',
    verify: 'hhbot',
    app_secret: '15fefb7616c05e773ceed7badd94dd15'
});

// maybe it needs to be singleton
let stateManager = new StateManager();

bot.on('error', (err) => {
    console.log(err.message)
})

bot.on('message', (payload, reply) => {
    //let text
    // temporal GPS test
     /*
    if (payload.message.attachments){
        text = payload.message.attachments[0].payload.coordinates.lat + ', ' +
            payload.message.attachments[0].payload.coordinates.long;
    }
*/
    bot.getProfile(payload.sender.id, (err, profile) => {
        if (err) throw err;

        stateManager.do(payload, profile, (err, text)=>{
            if (err) throw err;

            reply({ text }, (err) => {
                if (err) throw err;
                console.log(`We replied : ${profile.first_name} ${profile.last_name}: ${text}`)
            });
        });


    })
})

bot.on('postback', (payload, reply) => {

    bot.getProfile(payload.sender.id, (err, profile) => {
        if (err) throw err;

        reply({ text: CMSG }, (err) => {
            if (err) throw err;
            console.log(`Greeting to ${profile.first_name} ${profile.last_name}`)

        })
    })
})


let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/', (req, res) => {
    return bot._verify(req, res)
})

app.post('/', (req, res) => {
    bot._handleMessage(req.body)
    res.end(JSON.stringify({status: 'ok'}))
})

http.createServer(app).listen(process.env.PORT, () => {
    console.log(`server listen on ${process.env.PORT}`)
});
