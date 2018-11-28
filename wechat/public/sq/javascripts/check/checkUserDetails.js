//导航 依赖 element 模块，否则无法进行功能性操作
layui.use(['jquery','layer','form'], function(){
    var $ = layui.$,
        form = layui.form,
        layer = layui.layer;
	
    $(function () {
        //1. 获取地址栏参数
        var url = decodeURI(location.search);
        var urlMsg = getRequest(url);
        console.log(urlMsg);

        //2.获取sessionStorage中的用户信息
        var check_user_msg = sessionStorage.check_user_msg;
        check_user_msg = JSON.parse(check_user_msg);
        console.log(check_user_msg);
		var yUserData=[];
        var data = [];
        var Yxmddm;
        check_user_msg['data'].forEach(function (v) {
            Yxmddm=v['xzqdm'];

            if(v['index'] == urlMsg){
                v['xzqdmMc'] = '';
                $.ajax({
                    type: "GET",
                    url: "/test/xzqmc",
                    async: false,
                    data: {
                        "xzqdm": [v['xzqdm']]
                    },
                    dataType: "json",
                    success: function(data){
                        console.log(data);
                        //渲染到页面
                        if(data.msg){
                            //提示错误信息
                            console.log(data['msg']);
                            // layer.msg(data['msg']);
                        }else {
                            v['xzqdmMc'] = data[0]['mc'];
                        }
                    }
                });
                data.push(v);
                
            }
        });
       console.log(data);
		yUserData=data;
        //3.渲染到页面
        var html = template('DetailsTpl',{data: data});
        $('.sq-check-msg').html(html);

        //4.通过认证
        $('#sq-adopt').on('click',function () {
        	 console.log(yUserData);
            layer.open({
                type: 1,
                content: '<p class="tip">您确定要通过认证吗？</p>' +
                '<div class="layui-layer-btn layui-layer-btn-">' +
                '<a class="layui-layer-btn0">确定</a>' +
                '<a class="layui-layer-btn1">取消</a>' +
                '</div>',
                yes: function () {
                    // console.log(Yxmddm)
                    $.ajax({
                        type: "POST",
                        url: "/test/checked_users",
                        data: {
                            "index": urlMsg,
                            "sftg": "1",
                            "xmddm":Yxmddm,
                            "shyj": ""
                        },
                        dataType: "json",
                        success: function(data){
                            console.log(data);
                            //渲染到页面
                            if(data['code'] == "0000"){
                                //审核通过成功
                                // 2.跳转至用户信息审核页面
                                layer.msg('审核通过成功，即将跳转至用户审核页面', function(){
                                     $(location).attr('href', '/sqxttestwx/sq/checkUser');
                                });

                            }else {
                                //提示错误信息
                                layer.msg(data['msg']);
                            }
                        }
                    });
                }
            });

        });


        // 5.拒绝认证
        //获取不通过原因
        $('#sq-refuse').on('click',function () {
            var reason = '';
            layer.open({
                type: 1,
                title:'拒绝原因',
                content: '<p class="reason">请填写拒绝原因</p>' +
                '<div id="" class="layui-layer-content layui-form sq-refuse-reason" lay-filter="refuse">'+
                '<div class="layui-input-block">'+
                '<select name="interest" lay-filter="refuse-reason">'+
                '<option value="0">可选择拒绝原因</option>'+
                '</select>'+
                '</div>'+
                '<textarea class="layui-layer-input"></textarea>'+
                '</div>'+
                '<div class="layui-layer-btn layui-layer-btn-">'+
                '<a class="layui-layer-btn0">确定</a>'+
                '<a class="layui-layer-btn1">取消</a>'+
                '</div>',
                success: function () {
                    $.ajax({
                        type: "GET",
                        url: "/test/user_reject_reason",
                        dataType: "json",
                        success: function(data){
                            console.log(data);
                            data.forEach(function (v) {
                                $('.sq-refuse-reason select').append('<option value="'+ v +'">'+ v +'</option>');
                            });
                            form.render('select');

                            form.on('select(refuse-reason)', function(data){
                                console.log(data.value); //得到被选中的值
                                //把被选中的值赋给textarea
                                $('.sq-refuse-reason textarea').val(data.value);
                            });
                        }
                    });
                },
                yes: function(){
                    console.log('yes');
                    reason = $('.sq-refuse-reason textarea').val();
                    console.log(reason);
                    if(reason != ''){
                        layer.open({
                            type: 1,
                            content: '<p class="tip">您确定要拒绝认证吗？</p>' +
                            '<div class="layui-layer-btn layui-layer-btn-">' +
                            '<a class="layui-layer-btn0">确定</a>' +
                            '<a class="layui-layer-btn1">取消</a>' +
                            '</div>',
                            yes: function () {
                                $.ajax({
                                    type: "POST",
                                    url: "/test/checked_users",
                                    data: {
                                        "index": urlMsg,
                                        "sftg": "0",
                                        "xmddm":Yxmddm,
                                        "shyj": reason
                                    },
                                    dataType: "json",
                                    success: function(data){
                                        console.log(data);
                                        //渲染到页面
                                        if(data['code'] == "0000"){
                                            //拒绝审核成功
                                            // 2.跳转至xx页面
                                            layer.msg('拒绝审核成功，即将跳转至用户审核页面', function(){
                                                $(location).attr('href', '/sqxttestwx/sq/checkUser');
                                            });

                                        }else {
                                            //提示错误信息
                                            layer.msg(data['msg']);
                                        }
                                    }
                                });
                            }
                        });
                    }
                    else {
                        layer.msg('请填写拒绝原因');
                        // layer.close(index); //如果设定了yes回调，需进行手工关闭

                    }

                }
            });

        });

    });

});