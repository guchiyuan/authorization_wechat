$(function () {
    var getUserOpenid=localStorage.getItem("openID");
    var loginMsg = sessionStorage.loginMsg;
    loginMsg = JSON.parse(loginMsg);
    var tel = loginMsg['tel'];
    $('.sq-phone').text(tel);

    var userMsg = sessionStorage.userMsg;
    console.log(userMsg);
    //if(userMsg == undefined){
        //1.获取用户信息，看是否已经认证通过
        $.ajax({
            type: "GET",
            url: "/test/get_userInfo",
            dataType: "json",
            data:{
              "openid": getUserOpenid
            },
            success: function(data){
                console.log(data);
                if(data['newUser'] == 0){
                    //不是新用户
                    sessionStorage.userMsg = JSON.stringify(data);
                    if(data['zt'] == 4){
                        $('.sq-zt').text("认证成功");
                    }else if(data['zt'] == 9){
                        $('.sq-zt').text("认证失败");
                    }else if(data['zt'] == 2){
                        $('.sq-zt').text("初审通过");
                    }else {
                        $('.sq-zt').text("待认证");
                    }

                }else {
                    //新用户 跳转至 我的信息 页面
                    $(location).attr('href', '/sqxttestwx/sq/userMsg');
                }
            }
        });

    //}else {
        //userMsg = JSON.parse(userMsg);
        //if(userMsg['zt'] == 4){
           // $('.sq-zt').text("通过认证");
        //}else if(userMsg['zt'] == 9){
           // $('.sq-zt').text("未通过认证");
        //}else {
           // $('.sq-zt').text("待认证");
       // }
    //}

    //点击我的信息
    $('#myMsg').on('click',function () {
        var userMsg = sessionStorage.userMsg;
        if(userMsg){
            //如果是老用户，跳转时修改邮箱页面
            $(location).attr('href', '/sqxttestwx/sq/updateEmail');
        }else {
            //跳转至新增用户信息页面
            $(location).attr('href', '/sqxttestwx/sq/userMsg');
        }
    });

    //点击退出登录
    $('#loginOut').on('click',function () {
        layer.open({
            content: '您确定要退出登录吗？',
            className: 'popupBg',
            btn: ['确定', '取消' ],
            yes: function (){
                $.ajax({
                    type: "GET",
                    url: "/test/logout",
                    dataType: "json",
                    success: function(data){
                        console.log(data);
                        if(data['code'] == 0){
                            //退出成功
                            //删除存储的用户信息
                            sessionStorage.removeItem('loginMsg');
                            sessionStorage.removeItem('userMsg');
                            //跳转至登录页面
                            // $(location).attr('href', 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdbc7eb74fd2614fd&redirect_uri=http://lkwx.gtis.com.cn/sqxttestwx/sq/login&response_type=code&scope=snsapi_base&state=123');
                            $(location).attr('href', 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9f3b7c80d6875f00&redirect_uri=http://lkwx.gtis.com.cn/sqxttestwx/sq/login&response_type=code&scope=snsapi_base&state=123');
                        }else {
                            //提示错误信息
                            layer.msg(data['msg']);
                        }
                    }
                });
                layer.close();
            }
        });
    });



});




