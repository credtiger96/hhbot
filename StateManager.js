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

    do(id, profile, cb) {
        let userState;
        let text="default";
        // if the user is not in our tree, insert user and give state 0
        if (!(userState = this.stateTree.get(id))){
            this.stateTree.insert(id,new Context(0));
        }

        switch (userState.getState()){
            case 0 :
                text = "hello world!";
                break;
            default :
                text = "error, unexpected state."

        }



        cb(text);

    }

}

module.exports = StateManager;
