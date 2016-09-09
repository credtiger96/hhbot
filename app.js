'use strict';

const http = require('http');
const Bot = require('messenger-bot')
const process = require('process') 
 let bot = new Bot({ 
     token: 'EAAZAafXETcwABAFz2qNcr1OyWRQukdS0LlNO9MUjbRsOvDgWfp7QcZAg4XaZBVoHJrl2FU5ZAMGo44UmBVRqV8ZCClUwTgXn0Jf4om2JQ8mbBZATzTTIFPOoENG1DW5cYK94I8CtKYnm9yRHSj7BLwQkjnP1Y0ui8W2rdBXvBxiQZDZD',
     verify: 'hhbot',
     app_secret: '15fefb7616c05e773ceed7badd94dd15'
    }) 
bot.on('error', (err) => { 
    console.log('error event : ' + err.message) 
}) 
bot.on('message', (payload, reply) => {
    let text = "default"
    if (payload.message.text)
         text = payload.message.text 
    console.log(payload.message);
    if (payload.message.attachments){
        text += payload.message.attachments[0].payload.coordinates.lat
        console.log(payload.message.attachments[0].payload.coordinates)
    } 
    bot.getProfile(payload.sender.id, (err, profile) => {
        if (err){
            console.log(err.message)
            //throw err
        } 
        reply({text}, (err) => { 
            if (err) {
                console.log(err.message) 
                //throw err
            }
            setTimeout(function(){bot.sendMessage(payload.sender.id,"test", function (err,info){
                if(err)console.log(err.message);
                else console.log("fff" + info);
            })}, 2000);

             console.log(`${profile.first_name} ${profile.last_name}: ${text}`) 
            }) 
        }) 
    }) 
http.createServer(bot.middleware()).listen(process.env.PORT, () => {
    console.log(`server listen on ${process.env.PORT}`);
})