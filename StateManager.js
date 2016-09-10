/**
 * Created by HongBeom Choi on 9/9/2016.
 */
//let RedBlackTree = require('redblack');
let Context = require('./Context');
const request = require('request');
const Strings = require('./res/Strings');
const db = require('./db');
let instance  = null;

class StateManager {

    constructor (){
        if (!instance){
            instance = this;
        }

        return instance;
    }

    do(payload, profile, reply) {


        let id = payload.sender.id;
        let text = payload.message.text;

        let res={};

        // if the user is not in our tree, insert user and give state 0
        /*
        if (!(userContext = this.stateTree.get(id))){
            userContext = new Context(0);
            this.stateTree.insert(id,userContext);
        }*/

        db.getState(id, (state)=>{
            switch (state){
                case 0 :
                    res.text = Strings.KR_NEED_LOCATION.replace('{name}', profile.first_name);
                    db.setState(id,1);
                    break;
                case 1 :
                    if (payload.message.attachments && payload.message.attachments[0].payload.coordinates){
                        console.log(payload.message.attachments)
                        let _lat = payload.message.attachments[0].payload.coordinates.lat;
                        let _long = payload.message.attachments[0].payload.coordinates.long;
                        let _url = `http:\/\/maps.google.com/maps?q=loc:${_lat},${_long}`;

                        // sending static google map image
                        reply({
                            attachment: {
                                type: "image",
                                payload: {
                                    url: "https://maps.googleapis.com/maps/api/staticmap?center=" +
                                    "37.2789278,127.0437552" +
                                    "&zoom=19&size=400x400" +
                                    "&key=AIzaSyD39ZWgG0NdYf1ZdiAKZg-9pPHRORSqBUA" +
                                    "&markers=color:red%7Clabel:B%7C37.2789278,127.0437552"
                                }
                            }
                        });
                        res.attachment = {};
                        res.attachment.type = '';
                        res.attachment.type = 'template';
                        res.attachment.payload = {};
                        res.attachment.payload.template_type = 'button';
                        res.attachment.payload.buttons = [
                            {
                                type : 'postback',
                                title : '웹으로 보기', // 지도는 보여줄것이므로 웹으로 보기가 적절
                                payload : 'showMap'

                            },{
                                type: 'postback',
                                title: '버스 보기',// 버스 보기가 더 적절한것 같음.
                                payload: 'show_bus_list'
                            }
                        ];

                        res.attachment.payload.text = Strings.KR_VALIDATE_LOCATION;
                        db.setState(id,2);
                    }else {
                        res.text = Strings.KR_INVALIDATE_LOCATION;
                    }
                    break;
                case 2 :
                    if (payload.message.text == '720') res.text = 'olleh';
                    else {
                        res.text = Strings.KR_INVALIDATE_BUSNUM;
                    }
                    db.setState(id,0);
                    break;
                default :
                    db.setState(id,0);
                    res.text = "error, unexpected state."
            }
            console.log(res);
            reply(res, (err) => {
                if (err) {
                    console.log(err.message);
                    throw err;
                }
                console.log(`Bot replied : ${profile.first_name} ${profile.last_name}: ${text}`)
            });

        })


    }

}

module.exports = StateManager;
