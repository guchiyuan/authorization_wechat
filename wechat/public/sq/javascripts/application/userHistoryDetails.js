//导航 依赖 element 模块，否则无法进行功能性操作
layui.use(['jquery','layer'], function(){
    var $ = layui.$,
        layer = layui.layer;

    $(function () {
        //1. 获取地址栏参数
        var url = decodeURI(location.search);
        var urlMsg = getRequest(url);
        var urlParam = getRequestParam(url);
        console.log(urlParam);
        console.log(urlMsg);

        var user_application_history = sessionStorage.user_application_history;
        user_application_history = JSON.parse(user_application_history);
        console.log(user_application_history);

        var data = [];
        var xzqData=[];
        user_application_history['data'].forEach(function (v) {

            var xksList = v['sqxlm'].split(',');
            console.log(xksList)
            v['xksList'] = xksList[xksList.length-1];

            if(v['index'] == urlMsg){
                xzqData=v['xzqdm'].split(",");
                v['xzqdmMc'] = '';
                $.ajax({
                    type: "GET",
                    url: "/test/xzqmc",
                    async: false,
                    data: {
                        "xzqdm": xzqData
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
                            for (var i=0;i<data.length;i++){
                                v['xzqdmMc'] +=data[i]['mc']+"  ";
                            }
                        }
                    }
                });
                data.push(v);
            }
        });
        console.log(data);

        //3.渲染到页面
        var html = template('DetailsTpl',{data: data});
        $('.sq-check-msg').html(html);

        //4.点击‘<’回到列表页
        $('.back').on('click',function () {
            $(location).attr('href', '/sqxttestwx/sq/myApply');
        });

        //5.单击 授权许可数的图标
        $('.sqxk-num i').on('click',function () {
            layer.open({
                title: '提示'
                ,content: '允许同时连接的最大客户端数量'
            });
        });
        var shzt=data[0].shzt;

        //6. 单击 撤销申请
        $('#sq-revoke').on('click',function () {
            var remokeParam = {
                "index": urlMsg,
                "shzt":shzt
            };
            console.log(remokeParam)
            layer.open({
                type: 1,
                content: '<p class="tip">您确定要撤销申请吗？</p>' +
                '<div class="layui-layer-btn layui-layer-btn-">' +
                '<a class="layui-layer-btn0">确定</a>' +
                '<a class="layui-layer-btn1">取消</a>' +
                '</div>',
                yes: function () {
                    $.ajax({
                        type: "POST",
                        url: "/test/revokeApplication",
                        data: remokeParam,
                        dataType: "json",
                        success: function(data){
                            console.log(data);
                            if(data['code'] == "0000"){
                                //1.提示撤销成功，返回列表页
                                layer.msg('撤销申请成功，即将跳转至申请列表页面', function(){
                                     $(location).attr('href', '/sqxttestwx/sq/myApply');
                                });
                            }else {
                                //提示错误信息
                                layer.msg(data['msg']);

                            }
                        },
                        error:function (data) {
                            console.log(data)
                        }
                    });
                }
            });
        });

    });

});