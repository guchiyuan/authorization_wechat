//导航 依赖 element 模块，否则无法进行功能性操作
layui.use(['element','jquery','layer'], function(){
    var element = layui.element,
        layer = layui.layer,
        $ = layui.$;

    $(function () {
        //1. 判断是不是普通用户
        var checkApplyMsg = [];

        var loginMsg = sessionStorage.loginMsg;
        loginMsg = JSON.parse(loginMsg);
        if(loginMsg['role'] == 0){
            //1.1 普通用户
            $('.sq-user').removeClass('sq-hide');
        }else {
            // 1.2 获取审核信息
            $.ajax({
                type: "GET",
                url: "/test/unchecked_applications",
                dataType: "json",
                success: function(data){
                    console.log(data);
                    if(data['code']){
                        $('.sq-check-msg').html(data['msg']);
                        // layer.msg(data['msg']);
                    }else {
                        checkApplyMsg = data;
                        //渲染到页面
                        var html = template('userTpl',{data: data});
                        $('.sq-check-msg').html(html);
                        // 保存到sessionStorage中
                        var check_application_msg = {data: data};
                        sessionStorage.check_application_msg = JSON.stringify(check_application_msg);
                    }
                }
            });
        }

        //2. 单击查询
        $('#sq-search-btn').on('click',function () {
            var userName = $('.sq-search-text').val();
            var selectApplyMsg = [];
            checkApplyMsg.forEach(function (v) {
                if(v['yhm'].indexOf(userName) > -1){
                    selectApplyMsg.push(v);
                }
            });
            if(selectApplyMsg.length == 0){
                var html = '<p class="sq-search-tips">没有搜索到数据</p>';
            }else {
                var html = template('userTpl',{data: selectApplyMsg});
            }
            $('.sq-check-msg').html(html);
        });

    });

});