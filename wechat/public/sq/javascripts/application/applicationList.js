//导航 依赖 element 模块，否则无法进行功能性操作
layui.use(['element','jquery','layer'], function(){
    var element = layui.element,
        $ = layui.$,
        layer = layui.layer;

    $(function () {
        // var ip = getIP();
        // 1.获取授权申请历史页面
        $.ajax({
            type: "GET",
            url: "/test/user_history",
            data: {
                "shzt": "",
                "page": "1",
                "pageSize": "15"
            },
            dataType: "json",
            success: function(data){
                console.log(data);
                if(data['code']){
                    $('.sq-all').html("<p>"+data['msg']+"</p>");
                }else {
                    //渲染到页面
                    var html = template('userTpl',{data: data});
                    $('.sq-all').html(html);
                    // 保存到sessionStorage中
                    var user_application_history = {data: data};
                    sessionStorage.user_application_history = JSON.stringify(user_application_history);
                }
            }
        });

        //待审核
        $.ajax({
            type: "GET",
            url: "/test/user_history",
            data: {
                "shzt": "2",
                "page": "1",
                "pageSize": "5"
            },
            dataType: "json",
            success: function(data){
                console.log(data);
                if(data['code']){
                    $('.sq-wait').html("<p>"+data['msg']+"</p>");
                }else {
                    //渲染到页面
                    var html = template('userTpl',{data: data});
                    $('.sq-wait').html(html);
                    // // 保存到sessionStorage中
                    // var user_wait_history = {data: data};
                    // sessionStorage.user_wait_history = JSON.stringify(user_wait_history);
                }
            }
        });

        //已审核
        $.ajax({
            type: "GET",
            url: "/test/user_history",
            data: {
                "shzt": "8",
                "page": "1",
                "pageSize": "5"
            },
            dataType: "json",
            success: function(data){
                console.log(data);
                if(data['code']){
                    $('.sq-end').html("<p>"+data['msg']+"</p>");
                }else {
                    //渲染到页面
                    var html = template('userTpl',{data: data});
                    $('.sq-end').html(html);
                    // 保存到sessionStorage中
                    // var user_end_history = {data: data};
                    // sessionStorage.user_end_history = JSON.stringify(user_end_history);
                }
            }
        });

        //不予办理
        $.ajax({
            type: "GET",
            url: "/test/user_history",
            data: {
                "shzt": "9",
                "page": "1",
                "pageSize": "5"
            },
            dataType: "json",
            success: function(data){
                console.log(data);
                if(data['code']){
                    $('.sq-not').html("<p>"+data['msg']+"</p>");
                }else {
                    //渲染到页面

                    var html = template('userTpl',{data: data});
                    $('.sq-not').html(html);
                    // 保存到sessionStorage中
                    // var user_not_history = {data: data};
                    // sessionStorage.user_not_history = JSON.stringify(user_not_history);
                }
            }
        });

        //2.单击右上角的‘+’
        $('.add').on('click',function () {
            //先看sessionStorage中是否有userMsg
            var userMsg = sessionStorage.userMsg;
            console.log(userMsg);
            userMsg = JSON.parse(userMsg);
            if(userMsg['zt'] == 4){
                //跳转至 新增授权申请页面
                $(location).attr('href', '/sqxttestwx/sq/applicationMsg');
            }else {
                //判断认证状态，未通过，提示 通过认证才能申请授权
                layer.msg("通过认证才能申请授权");
            }

        });

        var page = 1;
        var waitPage = 1;
        var sucPage = 1;
        var errPage = 1;
        $(window).on('scroll',function(){
            // if($(document).height() > $(window).height()){
            //     console.log($(window).height());
            // }
            if ($(document).height() > $(window).height() && $(window).scrollTop() == $(document).height() - $(window).height()) {
                if($('.layui-this').text() == "全部"){
                    page++;
                    var data = {
                        "shzt": "",
                        "page": page,
                        "pageSize": "5"
                    }
                }else if($('.layui-this').text() == "待审核"){
                    waitPage++;
                    var data = {
                        "shzt": "2",
                        "page": waitPage,
                        "pageSize": "5"
                    }
                }else if($('.layui-this').text() == "审核完成"){
                    sucPage++;
                    var data = {
                        "shzt": "8",
                        "page": sucPage,
                        "pageSize": "5"
                    }
                }else if($('.layui-this').text() == "不予办理"){
                    errPage++;
                    var data = {
                        "shzt": "9",
                        "page": errPage,
                        "pageSize": "5"
                    }
                }
                console.log('aaa');
                //当滚动条到底时,这里是触发内容
                $('.loader').removeClass('sq-hide');
                //异步请求数据,局部刷新dom
                $.ajax({
                    type: "GET",
                    url: "/test/user_history",
                    data: data,
                    dataType: "json",
                    success: function(data){
                        console.log(data);
                        if(data['code']){
                            $(window).scrollTop($(window).scrollTop() - 20);
                            layer.msg('暂时没有更多数据');
                            $('.loader').addClass('sq-hide');
                        }else {
                            //渲染到页面
                            var user_application_history = sessionStorage.user_application_history;
                            user_application_history = JSON.parse(user_application_history);
                            data.forEach(function (v) {
                                user_application_history['data'].push(v);
                            });
                            console.log(user_application_history);
                            var html = template('userTpl',user_application_history);
                            $('.sq-all').html(html);
                            // 保存到sessionStorage中
                            var user_application_history = user_application_history;
                            sessionStorage.user_application_history = JSON.stringify(user_application_history);
                        }

                    }
                });
            }
        });

    });

});