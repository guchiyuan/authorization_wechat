//1.注意：选项卡 依赖 element 模块，否则无法进行功能性操作
layui.use(['element','form','jquery'], function(){
    var element = layui.element,
        form = layui.form,
        $ = layui.$;

    $(function () {
        // var ip = getIP();
        // console.log(ip);
        var getUserOpenid=localStorage.getItem("openID")
        console.log(getUserOpenid)
        //1.先获取用户申请信息，渲染到页面
        $.ajax({
            type: "GET",
            url: "/test/get_userInfo",
            data:{
                "openid":getUserOpenid
            },
            dataType: "json",
            success: function(data){
                console.log(data);
                if(data['newUser'] == 0){
                    //不是新用户
                    var html = template('oldUserTpl',data);
                    $('.layui-tab').html(html);
                }else {
                    var html = template('newUserTpl',{});
                    $('.layui-tab').html(html);

                    form.render('select');

                    //2.1 项目组信息
                    var projectUrl = "/test/get_option/xmzxx";
                    var projectName = $('.sq-project select');
                    var proFilter = "proFilter";
                    renderSel(projectUrl,projectName,proFilter);
                }
            }
        });

        //1.2 渲染手机信息
        var tel = JSON.parse(sessionStorage.loginMsg)['tel'];
        console.log(tel);

        // $('.sq-phone input').val(tel);


        //2.初始化下拉框配置项
        /**
         * @param url ip地址
         * @param select_name 内容添加到select
         * @param selFilter 动态渲染的Filter
         */
        function renderSel(url,select_name,selFilter) {
            $.ajax({
                type: "GET",
                url: url,
                dataType: "json",
                success: function(data){
                    console.log(data);
                    var dataTpl = {"data":data};
                    var html = template('selTpl',dataTpl);
                    $(select_name).html(html);
                    form.render('select',selFilter);
                }
            });
        }



        //3.表单验证
        form.verify({
            isEmpty: function(value, item){ //value：表单的值、item：表单的DOM对象
                if(/^\s*$/g.test(value)){
                    return '请把信息填写完整';
                }
            },
            isNumber: [
                /^\d+$/
                ,'申请数量只能输入数字'
            ]
        });

        //4.申请人类型选择问题
        form.on('select(applicant-type)', function(data){
            // console.log(data.value); //得到被选中的值（编号）
            if(data.value == 1){
                // 公司员工
                $('.sq-applicant-company').addClass('sq-hide');
                $('.sq-team').removeClass('sq-hide');
            }else {
                $('.sq-applicant-company').removeClass('sq-hide');
                $('.sq-team').addClass('sq-hide');
            }
        });

        //5. 单击申请授权
        //定义需要的参数
        var sqr;
        var sqrlxmc;
        var sqrlxdm;//类型代码

        var sqrdwmc;

        var xmzxxmc;
        var xmzxxdm;//代码

        var lxdh;
        var wxzh;
        var jsyx;
        var code;


        form.on('submit', function(){
            // var getUserOpenid=localStorage.getItem("openID")
            console.log(getUserOpenid)
            //判断用户是否是新用户
            sqr = $('.sq-apply-name').val() || $('.sq-apply-name').text();

            sqrlxmc = $('.sq-applicant-type .layui-this').text();
            sqrlxdm = $('.sq-applicant-type .layui-this').attr('lay-value') || $('.sq-apply-type').data('id');

            sqrdwmc = $('.sq-apply-company').val() || $('.sq-apply-dw').text();

            xmzxxmc = $('.sq-project .layui-this').text() || $('.sq-apply-dw').text();
            xmzxxdm = $('.sq-project .layui-this').attr('lay-value');

            //联系电话，第一次填写时从sessionStorage中获取，填到页面，但不显示，只为获取
            lxdh = tel;
            wxzh = $('.sq-wechat input').val() || $('.sq-apply-wechat').text();
            code = $('.sq-code input').val() || $('.sq-apply-code').text();
            jsyx = $('.sq-receive-email input').val() || $('.sq-apply-tel').text();

            var data1 = {
                "sqr": sqr,
                "sqrlx": sqrlxdm,
                "sqrlxmc": sqrlxmc,
                "sqrdw": sqrdwmc,
                "xmzxxmc": xmzxxmc,
                "xmzxxdm": xmzxxdm,
                "lxdh": lxdh,
                "wxzh": wxzh,
                "jsyx": jsyx,
                "openid":getUserOpenid
            };
            console.log(data1);

            //判断授权类型，如果为不限机器，授权序列码为空
            //判断申请人类型
            if(sqrlxdm == 0 || sqrlxdm=="甲方用户"){
                //甲方用户
                var data = {
                    "sqr": sqr,
                    "sqrlx": sqrlxdm,
                    "sqrdw": sqrdwmc,
                    "lxdh": lxdh,
                    "wxzh": wxzh,
                    "jsyx": jsyx,
                    "openid":getUserOpenid,
                    "ssqy":code
                };
            }else {
                var data = {
                    "sqr": sqr,
                    "sqrlx": sqrlxdm,
                    "sqrdw": xmzxxmc,
                    "lxdh": lxdh,
                    "wxzh": wxzh,
                    "openid":getUserOpenid,
                    "jsyx": jsyx,
                    "ssqy":code
                };
            }
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
                        layer.msg("申请成功");
                        $(location).attr('href', '/sqxttestwx/sq');
                    }else {
                        //提示错误信息
                        layer.msg(data['msg']);
                    }
                }
            });

        });
    });
});
