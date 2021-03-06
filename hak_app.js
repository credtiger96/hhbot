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
                let text = `버스 번호 : ${ret.bus.decode} \n` +
                    `목적지 : ${ret.meta.destination.stationNm}` +
                    `\n출발지 : ${ret.meta.stationFrom.stationNm}`;
                if(!ret.meta.time_to_wait){
                    text = '현재 버스가 없습니다. 다른 노선을 찾아보시기 바랍니다.'

                }
                else if (ret.meta.time_to_wait.length == 2) {
                    text += `\n남은시간 : ${ret.meta.time_to_wait[0]}분 ${ret.meta.time_to_wait[1]}분`;
                }
                else {
                    text += `\n남은시간 : ${ret.meta.time_to_wait[0]}분`;
                }

                let res = {'text': text};

                for (var i in ret.meta.time_to_wait) {
                    console.log('this is log time :' + ret.meta.time_to_wait[i]);
                    if (ret.meta.time_to_wait[i] > 10) {
                        res = {
                            "attachment": {
                                "type": "template",
                                "payload": {
                                    "template_type": "button",
                                    "text": text,
                                    "buttons": [
                                        {
                                            "type": "postback",
                                            "title": "도착 10분 전에 알림 받기",
                                            "payload": "ALARM" + ret.meta.time_to_wait[i]
                                        }
                                    ]
                                }
                            }
                        };
                        break;
                    }

                }

                reply(res, (err) => {
                    if (err) throw err;
                });
            }
        });
    })
});

bot.on('postback', (payload, reply) => {

    console.log('payload come');
    console.log(payload);

    bot.getProfile(payload.sender.id, (err, profile) => {
        if (err) throw err;
        let gotPayload = payload.postback.payload;
        if (gotPayload.startsWith("ALARM")) {
            let t = gotPayload.replace("ALARM", "");
            setTimeout(()=>{
                reply({'text': '버스타러 갑시다.'}, (err)=>{if(err) throw  err;});
            }, (t - 10) * 60 *1000 )

            reply({'text': `네 알겠습니다. 버스 도착 10분 전에 메세지를 전송하겠습니다.`}, (err)=>{if(err) throw  err;});
        }

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


