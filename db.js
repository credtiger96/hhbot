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
var db = firebase.database();
var hhbotRef = db.ref("hhbot");

hhbotRef.child('midfhjfksdhkjfhdkfjdshk').set({state : 1});
hhbotRef.child('midfhjfksdhkjfhdkfjdshk').update({get : 1});
hhbotRef.child('midfhjfksdhkjfhdkfjdshk1234').set({state : 0});
hhbotRef.child('midfhjfksdhkjfhdkfjdshk44124').set({state : 2});
hhbotRef.child('124').set({state : 2});

hhbotRef.orderByChild('state').equalTo('124').once('value', function(data){
    console.log(data.key + data.val());
});