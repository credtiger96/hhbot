/**
 * Created by HongBeom Choi on 9/9/2016.
 */
let RedBlackTree = require('redblack');
let Context = require('./Context');
const request = require('request');
const Strings = require('./res/Strings');
let instance  = null;

class StateManager {

    constructor (){
        if (!instance){
            instance = this;
        }
        this.stateTree = RedBlackTree.tree();
        console.log('State Tree and State Manager Generated.');
        return instance;
    }

    do(payload, profile, reply) {

        let userContext;

        let id = payload.sender.id;
        let text = payload.message.text;

        let res={};

        // if the user is not in our tree, insert user and give state 0
        if (!(userContext = this.stateTree.get(id))){
            userContext = new Context(0);
            this.stateTree.insert(id,userContext);
        }

        switch (userContext.getState()){
            case 0 :
                res.text = Strings.KR_NEED_LOCATION.replace('{name}', profile.first_name);
                userContext.setState(1);
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
                                "Berkeley,CA&zoom=14&size=400x400&key=AIzaSyD39ZWgG0NdYf1ZdiA" +
                                "KZg-9pPHRORSqBUA"
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
                            title : '웹으로 보기',
                            payload : 'showMap'

                        },{
                            type: 'postback',
                            title: '노선 보기',
                            payload: 'show_bus_list'
                        }
                    ];

                    res.attachment.payload.text = Strings.KR_VALIDATE_LOCATION + Strings.KR_NEED_BUSNUM;
                    userContext.setState(2);
                }else {
                    res.text = Strings.KR_INVALIDATE_LOCATION;
                }
                break;
            case 2 :
                if (payload.message.text == '720') res.text = 'olleh';
                else {
                    res.text = Strings.KR_INVALIDATE_BUSNUM;
                }
                userContext.setState(0);
                break;
            default :
                userContext.setState(0);
                res.text = "error, unexpected state."
        }
        console.log(res);
        reply(res, (err) => {
            if (err) {
                console.log(err.message);
                throw err;
            }
            console.log(`We replied : ${profile.first_name} ${profile.last_name}: ${text}`)
        });

    }

}

module.exports = StateManager;
