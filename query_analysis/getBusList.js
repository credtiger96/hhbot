const request = require('request');

let headers = {
    'Origin': 'http://www.gbis.go.kr',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.6,en;q=0.4',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.92 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Referer': 'http://www.gbis.go.kr/gbis2014/schBus.action?mapTabCd=1',
    'X-Requested-With': 'XMLHttpRequest',
    'Connection': 'keep-alive'
    // 'Cookie': 'PHAROSVISITOR=00004fee01570f1da75f36e9c0a867c9; ACEFCID=UID-57D2B892EA4906C8526E5EF1; weatherChange=2; JSESSIONID=Qx1gZaZzZhfrzcH9YeXYfqHtL16naw5JgGgQUY5LVK3a7FFoQtcIshjSIKQsuTGx.Gbus-WAS_servlet_engine3; _ga=GA1.3.524032906.1473427599; _gat=1; myword=%EC%95%84%EC%A3%BC%EB%8C%80.%EC%95%84%EC%A3%BC%EB%8C%80%EB%B3%91%EC%9B%90%EC%9E%85%EA%B5%AC.%ED%95%9C%EA%B5%AD%EC%9E%90...%2C720-2%2C%EC%95%84%EC%A3%BC%EB%8C%80'
};

let dataString = 'cmd=searchBusStationJson&stationId=202000005';
;
let options = {
    url: 'http://www.gbis.go.kr/gbis2014/schBusAPI.action',
    method: 'POST',
    headers: headers,
    body: dataString
};

function getBusList(cb) {
    request(options, (err, res, body) => {
        if (err) throw err;
        let json_data = []
        json_data.push(JSON.parse(body).result);


        options.body = 'cmd=searchBusStationJson&stationId='+'203000066';
        request(options, (err, res, body)=>{
            json_data.push(JSON.parse(body).result); 
            cb(json_data);
        });

        
    });
}

module.exports = getBusList;
