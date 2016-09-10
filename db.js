/**
 * Created by credt on 9/10/2016.
 */
'use strict';

let firebase = require('firebase');

firebase.initializeApp( {
    serviceAccount: './hhbot-fbc2bb37d1af.json',
    databaseURL: "https://hhbot-143008.firebaseio.com/"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
let instance;
let db = firebase.database();

class DB {
    constructor (){
        if (!instance){
            instance = this;
        }
        this.userRef = db.ref('hhbot/users');
        return instance;
    }
    setState(mid, stateNum, cb){
        this.userRef.child(mid).update({state : stateNum});
        if (cb) cb();
    }
    getState(mid, cb){
        this.userRef.orderByKey().equalTo(mid).once('value', (snapshot)=>{
            if (!snapshot.val()) return 0;
            if (cb) cb(snapshot.val()[mid]['state']);
            // return value == callback parameter

            return snapshot.val()[mid]['state'];
        });
    }
}

module.exports = new DB();
/*
 let userRef = db.ref('hhbot/users');

 userRef.child('midfhjfksdhkjfhdkfjdshk').set({state : 1});
 userRef.child('midfhjfksdhkjfhdkfjdshk').update({get : 1});
 userRef.child('midfhjfksdhkjfhdkfjdshk1234').set({state : 0});
 userRef.child('midfhjfksdhkjfhdkfjdshk44124').set({state : 2});
 userRef.child('124').set({state : 2});

 userRef.orderByKey().equalTo('124').once('value', function(data){
 console.log(data.val()['124']);
 });
 */