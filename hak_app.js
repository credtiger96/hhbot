'use strict';
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const Bot = require('messenger-bot');
const process = require('process');
const query_analysis = require('./query_analysis/query_analysis');

let bot = new Bot({
    token: 'EAAZAafXETcwABAFz2qNcr1OyWRQukdS0LlNO9MUjbRsOvDgWfp7QcZAg4XaZBVoHJrl2FU5ZAMGo44UmBVRqV8ZCClUwTgXn0Jf4om2JQ8mbBZATzTTIFPOoENG1DW5cYK94I8CtKYnm9yRHSj7BLwQkjnP1Y0ui8W2rdBXvBxiQZDZD',
    verify: 'hhbot',
    app_secret: '15fefb7616c05e773ceed7badd94dd15'
});


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
        if (err) {
            console.log('getProfile error : ' +  err.message);
            throw err;
        }

        query_analysis(payload.message.text, (err, ret) => {
           if (err) {
               reply({'text': ret}, (err) => {
                   if (err) throw err;
               });
           }
           else {
               let res = `버스 번호 : ${ret.bus.decode} \n` +
                   `목적지 : ${ret.meta.destination.stationNm}` +
                   `\n출발지 : ${ret.meta.stationFrom.stationNm}`;
               if (ret.meta.time_to_wait.length == 2) {
                   res += `\n남은시간 : ${ret.meta.time_to_wait[0]}분 ${ret.meta.time_to_wait[1]}분`;
               }
               else {
                   res += `\n남은시간 : ${ret.meta.time_to_wait[0]}분`;
               }

               console.log(res);
               reply({'text': res}, (err) => {
                   if (err) throw err;
               });
           }
        });
    })
});

bot.on('postback', (payload, reply) => {

    console.log('payload come');
    console.log(payload);
    const QUICK_PAYLOAD = 'PPPP';
    let res = {};
    if (payload.postback.payload == 'how_to_postback')
    {
        res.text = KR_GREETING_MSG;
    }
    else if (payload.postback.payload == 'show_bus_list') {
        res.text = 'Choose Bus Number';
        res.quick_replies= [
            {
                content_type: 'text',
                title: '720',
                payload:QUICK_PAYLOAD
            },{
                content_type: 'text',
                title: '720-1',
                payload:QUICK_PAYLOAD
            }
        ]
    }

    bot.getProfile(payload.sender.id, (err, profile) => {
        if (err) throw err;

        reply(res, (err) => {
            if (err) throw err;
            console.log(`Greeting to ${profile.first_name} ${profile.last_name}`)

        })
    })

});


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


