/**
 * HHBOT BUS FIND Qeury Analysis module
 * @author : dogfooter <gkstnrkf@gmail.com>
 */
const getRoute = require('./getRoute');
const getBusList = require('./getBusList');

const BUS_REGEX_PAT = /\d{1,4}-?\d{0,3}/;

function query_analysis(query, cb) {
    let dest = query.slice(0,3);
    let busNum = query.match(BUS_REGEX_PAT);
    let ret = null;
    let err = null;

    if(!busNum) {
        err = 'Input right Bus Number in Query';
        cb(-1, err);
        return;
    }
    else {
        busNum = busNum[0];
    }

    getBusList((ret) => {
        let busList = ret.busStationInfo;
        let busArrival = ret.busArrivalInfo;
        let Bus = null;
        

        for (let i = 0; i < busList.length; i++){
            if (busList[i].routeName == busNum){ // 버스 번호가 쿼리 문장에 있으면 참을 반환
                Bus = busList[i].routeId;
                break;
            }
        }

        if (!Bus){
            err = 'Input right Bus Number in Query';
            return cb(-1, err);
        }


        getRoute(Bus, (ret) => {
            let stationList = ret;
            let stationFrom = null; 
            let stationTo = null;
            let time_to_wait = null;

            for (let i = 0; i < 2; i++){
                for (let j = 0; j < stationList[i].length; j++){
                    if ((u = stationList[i][j].stationNm.indexOf(dest)) != -1){
                        //console.log(stationList[i][j].stationNm.substring(u,stationList[i][j].stationNm.length));
                        stationFrom = stationList[i][0];
                        stationTo = stationList[i][j];
                        break;
                    }
                }
            }

            if (stationFrom && stationTo){
                for (let i = 0; i < busArrival.length; i++ ) {
                    if (busArrival[i].routeId == Bus){
                        //console.log(Bus);
                        time_to_wait = [busArrival[i].predictTime1, busArrival[i].predictTime2];
                        break;
                    }
                }
            }


            ret_v = {
                'bus': {
                    'decode': busNum,
                    'encode': Bus
                },
                'meta': {
                    'stationFrom': stationFrom,
                    'destination': stationTo,
                    'time_to_wait': time_to_wait
                }
            }

            return cb(0, ret_v);


        });

    });
    
}

module.exports = query_analysis;

// useage

/*
query_analysis('수원역가는 730번', (err, ret) => {
    if (err) console.log(ret);
    console.log (ret);
});
*/