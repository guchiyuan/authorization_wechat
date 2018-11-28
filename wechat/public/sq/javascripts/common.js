// ip地址
function getIP() {
    // return "http://192.168.50.107:8083";
    // return "http://192.168.50.148:80";
    //return "http://192.168.2.115:3000";
    // return "http://192.168.8.145:3000";
    return "http://lkwx.gtis.com.cn";
}

//2. 获取单个地址栏参数
function getRequest(value) {
    var msg;
    if (value.indexOf("?") != -1)//url中存在问号，也就说有参数。
    {
        var str = value.substr(1);  //得到?后面的字符串
        msg = str.split("=")[1];

    }
    return msg;
}
function getRequestParam(value) {
    var msg;
    if (value.indexOf("?") != -1)//url中存在问号，也就说有参数。
    {
        var str = value.substr(1);  //得到?后面的字符串
        msg = str.split("=")[0];

    }
    return msg;
}

//3.时间戳转日期
function formatDate(now) {
    var year=now.getFullYear();
    var month=now.getMonth()+1;
    var date=now.getDate();
    if(month < 10){
        month = "0" + month;
    }
    if(date < 10){
        date = "0" + date;
    }
    // var hour=now.getHours();
    // var minute=now.getMinutes();
    // var second=now.getSeconds();
    return year+"-"+month+"-"+date;
}
// var d=new Date(1230999938);
// alert(formatDate(d));
function isLogin() {
    var url = document.location.href;
    // console.log(url.indexOf('sq/login'));
    if(url.indexOf('sq/login') == -1)
    {
        //不是登录页，判断是否登录
        var loginMsg = sessionStorage.loginMsg;
        // console.log(loginMsg);
        if(loginMsg == undefined){
            document.location.href = '/sqxttestwx/sq/login';
        }
    }
}
isLogin();