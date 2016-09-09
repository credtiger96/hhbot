'use strict';

const http = require('http');
const Bot = require('messenger-bot')
const process = require('process') 
 let bot = new Bot({ 
     token: 'EAAOuqeLpZAU0BAOv49zJ5EfSzRpMtqA1td19aOdVvCxv7IsEDiK9e0X1IC5vwQsneTwEkZAnbeAnXwi5waTQoLouMofYse69P4le32VvFl8cl1mIRegZAYEkSKTUeBZB7lQDgrJq0kQXKl48CnkhByGYVtWCgF3VTTR9s4c19QZDZD', 
     verify: 'helloworld', 
     app_secret: '589d277928b56fc7c771b0697373ed3c' 
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