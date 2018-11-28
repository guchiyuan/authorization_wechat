layui.use(['layer','jquery'], function(){
    var layer = layui.layer,
        $ = layui.$;

    $(document).ready(function () {
        function getToken() {
            var token = "";
            //先判断Token获取时间是否超过25分钟，没有则不需要获取，取保存的token
            //暂时不用这个时间限制，不然后台重启导致token无效
            // var tokenobjStr = sessionStorage.tokenobj;
            // if (tokenobjStr && tokenobjStr != 'undefined') {
            //     var tokenObj = JSON.parse(tokenobjStr);
            //     if (tokenObj.time) {
            //         var millisecond = diffMillisecond(tokenObj.time, new Date().Format("yyyy-MM-dd hh:mm:ss"));
            //         var diffMinute = Math.floor(millisecond / (1000 * 60));
            //         if (diffMinute <= 25 && tokenObj.token)
            //             token = tokenObj.token;
            //     }
            // }
            if (!token) {
                var requestparam = {
                    "head": {
                        "origin": "1"
                    },
                    "data": {
                        "userName": "wx",
                        "userPwd": "123456"
                    }
                };
                // var requestparam = getApiUser()

                var ip = getIP() + "/estateplat-olcommon/test/v1/tokenModel/getToken";
                console.log(ip);
                $.ajax({
                    url: ip,
                    // url: "http://192.168.50.103:8088/estateplat-olcommon/test/v1/tokenModel/getToken",
                    contentType: "application/json;charset=UTF-8",
                    data: JSON.stringify(requestparam),
                    type: "POST",
                    async: false,
                    success: function (data) {
                        console.log(data);
                        if (data && data.head["code"] == "0000") {
                            token = data.data['token'];
                            //保存token
                            sessionStorage.tokenobj = JSON.stringify(data.data);
                        } else {
                            alert(data.head["msg"]);
                        }
                    }
                });
            }
            return token;
        }

        var token = getToken();
        var requestparam = {
            "head": {
                "origin": "1",
                "token": token
            },
            "data": {
                "url": window.location.href
            }
        };
        var config = {};
        $.ajax({
            url: getIP() + "/estateplat-olcommon/test/v1/scanModel/getJssdkConfig",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify(requestparam),
            type: "POST",
            async: false,
            success: function (data) {
                // alert(JSON.stringify(data));
                if (data && data.head["code"] == '0000')
                    config = data.data;
                console.log(config);
                console.log(data);
            }
        });

        if (!$.isEmptyObject(config)) {
            // alert(JSON.stringify(config));
            //调用微信扫一扫
            wx.config({
                //debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: config.appId, // 必填，公众号的唯一标识
                timestamp: config.timestamp, // 必填，生成签名的时间戳
                nonceStr: config.nonceStr, // 必填，生成签名的随机串
                signature: config.signature,// 必填，签名
                jsApiList: ['checkJsApi','scanQRCode'] // 必填，需要使用的JS接口列表
            });

            wx.ready(function () {
                // alert("ready");
                // $.hideLoading();
            });

            wx.error(function (res) {
                alert("error");
                // layer.open({
                //     title: '提示',
                //     content: '微信接口调用权限获取失败,请联系管理员'
                // });
                // $.alert("微信接口调用权限获取失败,请联系管理员");
            });

        } else {
            alert("失败");
            // layer.open({
            //     title: '提示',
            //     content: '微信接口调用权限获取失败,请联系管理员'
            // });
            // $.alert("微信接口调用权限获取失败,请联系管理员");
        }
    });

    $(".sq-get-code").on('click',function () {
        // layer.msg('请稍后');
        // alert('请稍后');
        wx.scanQRCode({
            desc: 'scanQRCode desc',
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                alert(result);
            }
        });
    })
});
// $(document).ready(function () {
//     function getToken() {
//         var token = "";
//         //先判断Token获取时间是否超过25分钟，没有则不需要获取，取保存的token
//         //暂时不用这个时间限制，不然后台重启导致token无效
//         // var tokenobjStr = sessionStorage.tokenobj;
//         // if (tokenobjStr && tokenobjStr != 'undefined') {
//         //     var tokenObj = JSON.parse(tokenobjStr);
//         //     if (tokenObj.time) {
//         //         var millisecond = diffMillisecond(tokenObj.time, new Date().Format("yyyy-MM-dd hh:mm:ss"));
//         //         var diffMinute = Math.floor(millisecond / (1000 * 60));
//         //         if (diffMinute <= 25 && tokenObj.token)
//         //             token = tokenObj.token;
//         //     }
//         // }
//         if (!token) {
//             var requestparam = {
//                 "head": {
//                     "origin": "1",
//                     "sign": "54665465454"
//                 },
//                 "data": {
//                     "userName": "wx",
//                     "userPwd": "123456"
//                 }
//             };
//             // var requestparam = getApiUser()
//
//             var ip = getIP() + "/estateplat-olcommon/test/v1/tokenModel/getToken";
//             console.log(ip);
//             $.ajax({
//                 url: ip,
//                 // url: "http://192.168.50.103:8088/estateplat-olcommon/test/v1/tokenModel/getToken",
//                 contentType: "application/json;charset=UTF-8",
//                 data: JSON.stringify(requestparam),
//                 type: "POST",
//                 async: false,
//                 success: function (data) {
//                     if (data && data.head["code"] == "0000") {
//                         token = data.data['token'];
//                         //保存token
//                         sessionStorage.tokenobj = JSON.stringify(data.data);
//                     } else {
//                         $.alert(data.head["msg"]);
//                     }
//                 }
//             });
//         }
//         return token;
//     }
//
//     var token = getToken();
//     var requestparam = {
//         "head": {
//             "origin": "1",
//             "token": token
//         },
//         "data": {
//             "url": window.location.href
//         }
//     };
//     var config;
//     $.ajax({
//         url: getIP() + "/estateplat-olcommon/test/v1/scanModel/getJssdkConfig",
//         contentType: "application/json;charset=UTF-8",
//         data: JSON.stringify(requestparam),
//         type: "POST",
//         async: false,
//         success: function (data) {
//             if (data && data.head["code"] == '0000')
//                 config = data.data;
//             console.log(config);
//             console.log(data);
//         }
//     });
//
//     if (!$.isEmptyObject(config)) {
//         //调用微信扫一扫
//         wx.config({
//             //debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//             appId: config.appId, // 必填，公众号的唯一标识
//             timestamp: config.timestamp, // 必填，生成签名的时间戳
//             nonceStr: config.nonceStr, // 必填，生成签名的随机串
//             signature: config.signature,// 必填，签名
//             jsApiList: ['checkJsApi','scanQRCode'] // 必填，需要使用的JS接口列表
//         });
//
//         wx.ready(function () {
//             // $.hideLoading();
//         });
//
//         wx.error(function (res) {
//             layer.open({
//                 title: '提示'
//                 ,content: '微信接口调用权限获取失败,请联系管理员'
//             });
//             // $.alert("微信接口调用权限获取失败,请联系管理员");
//         });
//
//     } else {
//         layer.open({
//             title: '提示'
//             ,content: '微信接口调用权限获取失败,请联系管理员'
//         });
//         // $.alert("微信接口调用权限获取失败,请联系管理员");
//     }
// });
//
// 	function scan(){
// 		var errorMsg = validateData();
// 		if (errorMsg != null && errorMsg != '') {
// 		    $("#message").html(errorMsg);
// 			return;
// 		}
//         layer.msg('请稍后');
// 		wx.scanQRCode({
// 		    desc: 'scanQRCode desc',
// 		    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
// 		    scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
// 		    success: function (res) {
// 		        var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
// 		    	submitScan(result);
// 		    	setTimeout('$.hideLoading()',1000);
// 			}
// 	 });
// 	}

