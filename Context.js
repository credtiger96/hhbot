/**
 * Created by HongBeom Choi on 9/9/2016.
 */
module.exports = class Context {
    constructor (state){
        this.state = state;
    }
    setState (state){
        this.state = state;
    }
    getState(){
        return this.state;
    }
};
