//导航 依赖 element 模块，否则无法进行功能性操作
layui.use(['element','jquery','layer'], function(){
    var element = layui.element,
        $ = layui.$;
    var layer = layui.layer;

    $(function () {
        //1. 判断是不是普通用户
        var checkUserMsg = [];
        var loginMsg = sessionStorage.loginMsg;
        loginMsg = JSON.parse(loginMsg);
        if(loginMsg['role'] == 0){
            //1.1 普通用户
            $('.sq-user').removeClass('sq-hide');
        }else {
            //1.2 管理员 获取审核信息
            $.ajax({
                type: "GET",
                url: "/test/unchecked_users",
                dataType: "json",
                success: function(data){
                    console.log(data);
                    if(data['code']){
                        $('.sq-check-msg').html("<p>暂无待审核信息</p>");
                        //提示错误信息
                        // layer.msg(data['msg']);
                    }else {
                        //渲染到页面
                        checkUserMsg = data;
                        var html = template('userTpl',{data: data});
                        $('.sq-check-msg').html(html);
                        // 保存到sessionStorage中
                        var check_user_msg = {data: data};
                        sessionStorage.check_user_msg = JSON.stringify(check_user_msg);
                    }
                }
            });
        }

        //2. 单击查询
        $('#sq-search-btn').on('click',function () {
            var userName = $('.sq-search-text').val();
            var selectUserMsg = [];
            checkUserMsg.forEach(function (v) {
                if(v['yhm'].indexOf(userName) > -1){
                    selectUserMsg.push(v);
                }
            });
            if(selectUserMsg.length == 0){
                var html = '<p class="sq-search-tips">没有搜索到数据</p>';
            }else {
                var html = template('userTpl',{data: selectUserMsg});
            }
            $('.sq-check-msg').html(html);
        });

    });

});