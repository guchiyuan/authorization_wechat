//1.注意：选项卡 依赖 element 模块，否则无法进行功能性操作
layui.use(['element','form','jquery','layer'], function(){
    var element = layui.element,
        form = layui.form,
        $ = layui.$,
        layer = layui.layer;

    $(function () {
        // var ip = getIP();
        // console.log(ip);
        //定义返回回来的原本的参数
        var getSqr;
        var getSqrlxmc;

        var getSqrdwmc;
        var getWxzh;
        var getJsyx;
        var getSsqy;
        var lxdh;
        //定义修改后的参数
        var sqrlxmc = '';
        var xxzxxmc = '';

        var sqr = '';
        var sqrdw = '';
        var wechat = '';
        var ssqy = '';
        var jsyx = '';
        var updateUser="";

        var sqrlxdm = '';
        var getUserOpenid=localStorage.getItem("openID");

        var oldUserInfo;
        //1.先获取用户申请信息，渲染到页面
        $.ajax({
            type: "GET",
            url: "/test/get_userInfo",
            dataType: "json",
            data:{
                "openid": getUserOpenid
            },
            success: function(data){
                oldUserInfo=data;
                console.log(data);
                if(data['code'] == "0000"){
                    if(data['newUser'] == 0){
                        //不是新用户
                        var html = template('oldUserTpl',data);
                        $('.layui-tab').html(html);
                        //赋值
                        getSqr = data['sqr'];
                        getSqrlxmc = data['sqrlx'];
                        if(data['sqrlx'] == '内部用户'){
                            sqrlxdm = 1;
                        }else if(data['sqrlx'] == '甲方用户'){
                            sqrlxdm = 0;
                        }

                        getSqrdwmc = data['sqrdw'];
                        sqrlxmc = data['sqrlx'];
                        lxdh = data['lxdh'];

                        if(getSqrlxmc == '内部用户'){
                            xxzxxmc = data['sqrdw'];
                        }else {
                            sqrdw = data['sqrdw'];
                        }

                        getSsqy = data['ssqy'];
                        getWxzh = data['wechat'];
                        getJsyx = data['jsyx'];




                        form.render('select');
                        //1.1 渲染申请人类型
                        var applicantType = new MobileSelect({
                            trigger: '#applicantType',
                            title: '单项选择',
                            wheels: [
                                {data: [
                                    {id:'0',value:'甲方用户'},
                                    {id:'1',value:'内部用户'}
                                ]}
                            ],
                            position:[0,1],
                            callback:function(indexArr, data){
                                console.log(data); //返回选中的json数据
                                sqrlxmc = data[0]['value'];
                                sqrlxdm = data[0]['id'];
                                console.log(sqrlxdm);
                                //1.1 申请人类型选择问题
                                if(sqrlxdm == 1){
                                    // 公司员工
                                    $('.sq-applicant-company').addClass('sq-hide');
                                    $('.sq-team').removeClass('sq-hide');
                                }else {
                                    $('.sq-applicant-company').removeClass('sq-hide');
                                    $('.sq-team').addClass('sq-hide');
                                }
                            }
                        });

                        //1.2 项目组信息
                        $.ajax({
                            type: "GET",
                            url: "/test/get_option/xmzxx",
                            dataType: "json",
                            success: function(data){
                                console.log(data);
                                var xmzList = [];
                                data.forEach(function (v) {
                                    var one = {};
                                    one['id'] = v['dm'];
                                    one['value'] = v['mc'];
                                    xmzList.push(one);
                                });

                                var project = new MobileSelect({
                                    trigger: '#project',
                                    title: '单项选择',
                                    wheels: [
                                        {data: xmzList}
                                    ],
                                    position:[0,1],
                                    callback:function(indexArr, data){
                                        console.log(data); //返回选中的json数据
                                        xxzxxmc = data[0]['value'];
                                        console.log(xxzxxmc);
                                    }
                                });

                            }
                        });
                    }else {
                        //跳转至我的信息
                        $(location).attr('href', '/sqxttestwx/sq/userMsg');
                    }
                }
                else {
                    //提示错误信息
                    layer.msg(data['msg']);
                }
            }
        });

        //在数组中模糊查询
        function searchList(str, container) {
            var newList = [];
            //新的列表
            var startChar = str.charAt(0);
            //开始字符
            var strLen = str.length;
            //查找符串的长度
            for (var i = 0; i < container.length; i++) {
                var obj = container[i];
                var isMatch = false;
                for (var p in obj) {
                    if (typeof (obj[p]) == "function") {
                        obj[p]();
                    } else {
                        var curItem = "";
                        if (obj[p] != null) {
                            curItem = obj[p];
                        }
                        for (var j = 0; j < curItem.length; j++) {
                            if (curItem.charAt(j) == startChar)
                            {
                                if (curItem.substring(j).substring(0, strLen) == str)
                                {
                                    isMatch = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (isMatch) {
                    newList.push(obj);
                }
            }
            return newList;
        }
        $(document).on("click","#sqDm",function () {
            $(".selectDiv").show();
        })
        // $("#sqDm").click(function () {
        //
        //     alert(1)
        // })

        var getQData;
        $.ajax({
            type: 'GET',
            url: '/test/get_ssqy',
            dataType: 'json',
            success: function (data) {
                // console.log(data);
                getQData=data;
                for(var i=0;i<data.length;i++){
                    $(".selectDiv").append("<p class='yoption' oid="+data[i].dm+">"+data[i].mc+"</p>")
                }
            }
        });

        var ppData="";
        $(document).on("input propertychange","#sqDm",function () {
            $(".selectDiv").html("");
            var getSqV=$("#sqDm").val();
            ppData= searchList(getSqV,getQData)
            for(var i=0;i<ppData.length;i++){
                $(".selectDiv").append("<p class='yoption' oid="+ppData[i].dm+">"+ppData[i].mc+"</p>")
            }
            var optionleng=$(".selectDiv").find(".yoption").length;
            if(optionleng!=0){
                $(".selectDiv").show();
            }else{
                $(".selectDiv").hide();
            }
        })

        //选取行政区
        $(document).on("click",".yoption",function () {
            var getV=$(this).text()
            $("#sqDm").val(getV);
            $(".selectDiv").hide();
            // ssqy=$(this).attr("oid");


        })

        //5. 单击申请授权
        form.on('submit', function(){
            var data = {};
            var getxzqVal=$("#sqDm").val();
            var getxzqId=searchList(getxzqVal,getQData);
            if(getxzqId.length==1){
                ssqy=getxzqId[0].dm
            }else{
                ssqy=""
                layer.msg('请正确选择行政区');
                return;
            }

            sqr = $('.sq-apply-sqr').val();
            sqrdw = $('.sq-apply-company').val();
            wechat = $('.sq-apply-wechat').val();
            // ssqy = $('.sq-apply-code').val();
            jsyx = $('.sq-apply-email').val();
            // if(oldUserInfo.sqr!=sqr || oldUserInfo.sqrlx!=$("#applicantType").text() || oldUserInfo.sqrdw!=$("#project").text() || oldUserInfo.ssqy!=ssqy ){
            //     updateUser=1;
            // }else{
            //     updateUser=0;
            // }

    	    if(ssqy=="" || $("#sqDm").val()==""){
                layer.msg("请选择行政区");
                return;
            }

            if(sqrlxmc == getSqrlxmc){
                if(sqrlxdm == 0){
                    //甲方用户
                    if(sqr == getSqr && sqrdw == getSqrdwmc && ssqy == getSsqy){
                        //没有修改
                        data = {
                            "sqr": sqr,
                            "sqrlx": sqrlxdm,
                            "sqrdw": sqrdw,
                            "wechat": wechat,
                            "jsyx": jsyx,
                            "ssqy": ssqy,
                            "lxdh": lxdh,
                            "sfnbcy": '0',
                            "openid": getUserOpenid,
                            "updateUser": '0'
                        };
                        console.log(data);
                        $.ajax({
                            type: "POST",
                            url: "/test/submit_userInfo",
                            data: data,
                            dataType: "json",
                            success: function(data){
                                console.log(data);
                                if(data['code'] == "0000"){
                                    //1.提示申请成功，返回首页
                                    layer.msg("保存成功");
                                    $(location).attr('href', '/sqxttestwx/sq/mine');
                                }else {
                                    //提示错误信息
                                    layer.msg(data['msg']);
                                }
                            }
                        });
                    }else {
                        if(sqrdw == ''){
                            layer.msg('请输入申请人（单位）');
                        }else {
                            data = {
                                "sqr": sqr,
                                "sqrlx": sqrlxdm,
                                "sqrdw": sqrdw,
                                "wechat": wechat,
                                "jsyx": jsyx,
                                "ssqy": ssqy,
                                "lxdh": lxdh,
                                "sfnbcy": '0',
                                "openid": getUserOpenid,
                                "updateUser": '1'
                            };
                            //需要重新认证，用户确认
                            layer.open({
                                type: 1,
                                content: '<p class="tip">将会重新认证，您确定要保存吗？</p>' +
                                '<div class="layui-layer-btn layui-layer-btn-">' +
                                '<a class="layui-layer-btn0">确定</a>' +
                                '<a class="layui-layer-btn1">取消</a>' +
                                '</div>',
                                yes: function () {

                                    console.log(data)
                                    $.ajax({
                                        type: "POST",
                                        url: "/test/submit_userInfo",
                                        data: data,
                                        dataType: "json",
                                        success: function(data){
                                            console.log(data);
                                            if(data['code'] == "0000"){
                                                //1.提示申请成功，返回首页
                                                layer.msg("保存成功");
                                               $(location).attr('href', '/sqxttestwx/sq/mine');
                                            }else {
                                                //提示错误信息
                                                layer.msg(data['msg']);
                                            }
                                        }
                                    });
                                }
                            });
                        }

                    }
                }else if(sqrlxdm == 1){
                    //内部员工
                    if(sqr == getSqr && xxzxxmc == getSqrdwmc && ssqy == getSsqy){
                        //没有修改
                        data = {
                            "sqr": sqr,
                            "sqrlx": sqrlxdm,
                            "sqrdw": xxzxxmc,
                            "wechat": wechat,
                            "jsyx": jsyx,
                            "ssqy": ssqy,
                            "lxdh": lxdh,
                            "sfnbcy": '1',
                            "openid": getUserOpenid,
                            "updateUser": '0'
                        };
                        console.log(data);
                        $.ajax({
                            type: "POST",
                            url: "/test/submit_userInfo",
                            data: data,
                            dataType: "json",
                            success: function(data){
                                console.log(data);
                                if(data['code'] == "0000"){
                                    //1.提示申请成功，返回首页
                                    layer.msg("保存成功");
                                    $(location).attr('href', '/sqxttestwx/sq/mine');
                                }else {
                                    //提示错误信息
                                    layer.msg(data['msg']);
                                }
                            }
                        });
                    }else {
                        if(xxzxxmc == ''){
                            layer.msg('请选择项目组信息');
                        }else {
                            data = {
                                "sqr": sqr,
                                "sqrlx": sqrlxdm,
                                "sqrdw": xxzxxmc,
                                "wechat": wechat,
                                "jsyx": jsyx,
                                "ssqy": ssqy,
                                "lxdh": lxdh,
                                "sfnbcy": '1',
                                "openid": getUserOpenid,
                                "updateUser": '1'
                            };
                            //需要重新认证，用户确认
                            layer.open({
                                type: 1,
                                content: '<p class="tip">将会重新认证，您确定要保存吗？</p>' +
                                '<div class="layui-layer-btn layui-layer-btn-">' +
                                '<a class="layui-layer-btn0">确定</a>' +
                                '<a class="layui-layer-btn1">取消</a>' +
                                '</div>',
                                yes: function () {
                                    console.log(data);
                                    $.ajax({
                                        type: "POST",
                                        url: "/test/submit_userInfo",
                                        data: data,
                                        dataType: "json",
                                        success: function(data){
                                            console.log(data);
                                            if(data['code'] == "0000"){
                                                //1.提示申请成功，返回首页
                                                layer.msg("保存成功");
                                                 $(location).attr('href', '/sqxttestwx/sq/mine');
                                            }else {
                                                //提示错误信息
                                                layer.msg(data['msg']);
                                            }
                                        }
                                    });
                                }
                            });
                        }

                    }
                }
            }else {
                if(sqrlxdm == 0){
                    //甲方用户
                    if(sqrdw == ''){
                        layer.msg('请填写申请人（单位）');
                    }else {
                        data = {
                            "sqr": sqr,
                            "sqrlx": sqrlxdm,
                            "sqrdw": sqrdw,
                            "wechat": wechat,
                            "jsyx": jsyx,
                            "ssqy": ssqy,
                            "lxdh": lxdh,
                            "sfnbcy": '0',
                            "openid": getUserOpenid,
                            "updateUser": '1'
                        };
                        //需要重新认证，用户确认
                        layer.open({
                            type: 1,
                            content: '<p class="tip">将会重新认证，您确定要保存吗？</p>' +
                            '<div class="layui-layer-btn layui-layer-btn-">' +
                            '<a class="layui-layer-btn0">确定</a>' +
                            '<a class="layui-layer-btn1">取消</a>' +
                            '</div>',
                            yes: function () {
                                console.log(data);
                                $.ajax({
                                    type: "POST",
                                    url: "/test/submit_userInfo",
                                    data: data,
                                    dataType: "json",
                                    success: function(data){
                                        console.log(data);
                                        if(data['code'] == "0000"){
                                            //1.提示申请成功，返回首页
                                            layer.msg("保存成功");
                                            $(location).attr('href', '/sqxttestwx/sq/mine');
                                        }else {
                                            //提示错误信息
                                            layer.msg(data['msg']);
                                        }
                                    }
                                });
                            }
                        });
                    }

                }
                if(sqrlxdm == 1){
                    //内部员工
                    if(xxzxxmc == ''){
                        layer.msg('请填写项目组信息');
                    }else {
                        data = {
                            "sqr": sqr,
                            "sqrlx": sqrlxdm,
                            "sqrdw": xxzxxmc,
                            "wechat": wechat,
                            "jsyx": jsyx,
                            "ssqy": ssqy,
                            "lxdh": lxdh,
                            "sfnbcy": '1',
                            "openid": getUserOpenid,
                            "updateUser": '1'
                        };
                        //需要重新认证，用户确认
                        layer.open({
                            type: 1,
                            content: '<p class="tip">将会重新认证，您确定要保存吗？</p>' +
                            '<div class="layui-layer-btn layui-layer-btn-">' +
                            '<a class="layui-layer-btn0">确定</a>' +
                            '<a class="layui-layer-btn1">取消</a>' +
                            '</div>',
                            yes: function () {
                                console.log(data);
                                $.ajax({
                                    type: "POST",
                                    url: "/test/submit_userInfo",
                                    data: data,
                                    dataType: "json",
                                    success: function(data){
                                        console.log(data);
                                        if(data['code'] == "0000"){
                                            //1.提示申请成功，返回首页
                                            layer.msg("保存成功");
                                              $(location).attr('href', '/sqxttestwx/sq/mine');
                                        }else {
                                            //提示错误信息
                                            layer.msg(data['msg']);
                                        }
                                    }
                                });
                            }
                        });
                    }

                }
            }



        });
    });
});
