var request = require('request');

var headers = {
    'Origin': 'http://www.gbis.go.kr',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.6,en;q=0.4',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Referer': 'http://www.gbis.go.kr/gbis2014/schBus.action?mapTabCd=3',
    'X-Requested-With': 'XMLHttpRequest',
    'Connection': 'keep-alive'
    // 'Cookie': 'myword=720-2; PHAROSVISITOR=0000601c01572eed1a531534c0a867c9; JSESSIONID=aJLhLc1R41zT2WbaUxYGI8DaXZd3IhtbMs1bifrFoMHkPflOQmdWqV2J8mDIuRWP.Gbus-WAS_servlet_engine2; _gat=1; ACEFCID=UID-57DADD4E626D6B51E9A7E7AE; weatherChange=2; _ga=GA1.3.1209589822.1473961289'

};

var dataString = 'cmd=searchRouteJson&routeId=234000026';

var options = {
    url: 'http://www.gbis.go.kr/gbis2014/schBusAPI.action',
    method: 'POST',
    headers: headers,
    body: dataString

};

const fixed_station = '아주대.아주대병원';

//request(options, callback);

function getBusList(Bus, cb) {
    options.body = 'cmd=searchRouteJson&routeId=' + Bus;
    request(options, (err, res, body) => {
        if (err) throw err;
        json_data = JSON.parse(body).result.gg;
        up_list = json_data.up.list;
        down_list = json_data.down.list;

        let ret = [up_list, down_list];
        for (i = 0; i < ret.length; i++ ){
            for (j = 0; j <ret[i].length; j++ ){
                if (ret[i][j].stationNm.indexOf(fixed_station) != -1) {
                    ret[i] = ret[i].slice(j, ret[i].length);
                    break;
                }
            }
        }
        //console.log(ret[0][0], ret[0][1], ret[1][0], ret[1][1]);
        cb(ret);
    });
}

module.exports = getBusList;
