/**
 * Created by HongBeom Choi on 9/9/2016.
 */
let RedBlackTree = require('redblack');
let Context = require('./Context');

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

    do(payload, profile, cb) {
        let userContext;

        let id = payload.sender.id;
        let text = payload.message.text;

        let res="default";

        // if the user is not in our tree, insert user and give state 0
        if (!(userContext = this.stateTree.get(id))){
            userContext = new Context(0);
            this.stateTree.insert(id,userContext);
        }

        switch (userContext.getState()){
            case 0 :
                res = text +  "hello world!";
                userContext.setState(1);
                break;
            case 1 :
                res = text +  "hell choseon!";
                userContext.setState(0);
                break;
            default :
                res = "error, unexpected state."
        }



        cb(null, res);

    }

}

module.exports = StateManager;