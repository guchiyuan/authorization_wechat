//1.注意：选项卡 依赖 element 模块，否则无法进行功能性操作
layui.use(['element','form','jquery'], function(){
    var element = layui.element,
        form = layui.form,
        $ = layui.$;

    $(function () {
        var  getUserOpenid=localStorage.getItem("openID");
        var userMsg = sessionStorage.userMsg;
        console.log(userMsg);
        // console.log(!userMsg);

        var xmzxxmc = '';
        if(!userMsg){
            var html = template('newUserTpl',{});
            $('.layui-tab').html(html);

            form.render('select');

            //1. 渲染申请人类型
            var sqrlxmc = '';
            var sqrlxdm = '';//类型代码
            var applicantType = new MobileSelect({
                trigger: '#applicantType',
                title: '单项选择',
                wheels: [
                    {data: [
                        {id:'0',value:'甲方用户'},
                        {id:'1',value:'内部人员'}
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

            //2. 项目组信息
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
                         xmzxxmc = data[0]['value'];
                         console.log(xmzxxmc);
                     }
                 });
                }
            });

            $("#sqDm").click(function () {
                 $(".selectDiv").show()
            })

            var ssqy = '';
            // 3.获取行政区代码
                var getQData;
               $.ajax({
                   type: 'GET',
                   url: '/test/get_ssqy',
                   dataType: 'json',
                   success: function (data) {
                       console.log(data);
                       getQData=data;
                       for(var i=0;i<data.length;i++){
                           $(".selectDiv").append("<p class='yoption' oid="+data[i].dm+">"+data[i].mc+"</p>")
                       }
                   }
               });

           

            //键盘事件匹配数据

            var ppData="";
              $('#sqDm').bind('input propertychange', function() {
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
            });
            //选取行政区
            $(document).on("click",".yoption",function () {
                var getV=$(this).text()
                $("#sqDm").val(getV);
                 $(".selectDiv").hide();
                // ssqy=$(this).attr("oid");


            })




//          $('select').comboSelect()

//
//             var htmlSelect ='<option value="">请选择行政区</option>';
//             $.ajax({
//                 type: 'GET',
//                 url: '/test/get_ssqy',
//                 dataType: 'json',
//                 success: function (data) {
//                     console.log(data);
//                     data.forEach(function(v){
//                         htmlSelect+='<option value="' +v.dm+ '">' +v.mc+ '</option>';
//                     });
//            
//                     $('.selectpicker').html(htmlSelect);
//                     $('.selectpicker').selectpicker('refresh');
//                     $('.selectpicker').selectpicker({
//                         'selectedText': 'cat'
//                     });
//                     console.log(data.length);
//                     for(var i=0; i<data.length;i++){
//                         $('.dropdown-menu>li .text').eq(i+1).attr('data-dm',data[i].dm);
//                     }
//            
//            
//                     $('.selectpicker').change(function () {
//                         ssqy = $('.dropdown-menu li.selected').find('.text').attr('data-dm');
//                     });
//            
//            
//                     // if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
//                     //     $('.selectpicker').selectpicker('mobile');
//                     // }
//            
//             });



            $('body').css('overflow','hidden');
            $('sq-code .dropdown-menu input').attr('placeholder','输入行政区名称');



        }





        //3 渲染手机信息
        var tel = JSON.parse(sessionStorage.loginMsg)['tel'];
        console.log(tel);

        // $('.sq-phone input').val(tel);

        //4.表单验证
        form.verify({
            isEmpty: function(value, item){ //value：表单的值、item：表单的DOM对象
                if(/^\s*$/g.test(value)){
                    return '请把信息填写完整';
                }
            },
            isNumber: [
                /^\d+$/
                ,'申请数量只能输入数字'
            ],
            isNull:function(value, item) {
                if(value==""){
                    return '请选择行政区';
                }
            }
        });

        //5. 单击申请授权
        //定义需要的参数
        var sqr;
        var sqrdwmc;
        // var xmzxxdm;//代码
        var lxdh;
        var wxzh;
        var jsyx;
        var code;
        form.on('submit', function(){
            //判断用户是否是新用户


            sqr = $('.sq-apply-name').val();
            sqrdwmc = $('.sq-apply-company').val();
            //联系电话，第一次填写时从sessionStorage中获取，填到页面，但不显示，只为获取
            lxdh = tel;
            wxzh = $('#Ywechat').val();
            code = $('.sq-code input').val();
            jsyx = $('.sq-receive-email input').val();

            var data1 = {
                "sqr": sqr,
                "sqrlx": sqrlxdm,
                "sqrlxmc": sqrlxmc,
                "sqrdw": sqrdwmc,
                "xmzxxmc": xmzxxmc,
                "lxdh": lxdh,
                "wechat": wxzh,
                "jsyx": jsyx
            };
            // console.log(data1);




                var getxzqVal=$("#sqDm").val();
                var getxzqId=searchList(getxzqVal,getQData);
                if(getxzqId.length==1){
                    ssqy=getxzqId[0].dm
                }else{
                    ssqy=""
                    layer.msg('请正确选择行政区');
                    return;
                }

            console.log(getxzqId)
            if(sqrlxdm == ''){
                layer.msg('请选择申请人类型');
                return;
            }
            // if(ssqy == ''){
            //     layer.msg('请选择行政区');
            //     return;
            // }

            //判断授权类型，如果为不限机器，授权序列码为空
            //判断申请人类型
            if(sqrlxdm == 0 || sqrlxdm=="甲方用户"){
                //甲方用户
                var data = {
                    "sqr": sqr,
                    "sqrlx": sqrlxdm,
                    "sqrdw": sqrdwmc,
                    "lxdh": lxdh,
                    "wechat": wxzh,
                    "jsyx": jsyx,
                    "openid":getUserOpenid,
                    "ssqy":ssqy
                };
            }else {
                if(xmzxxmc != ''){
                    var data = {
                        "sqr": sqr,
                        "sqrlx": sqrlxdm,
                        "sqrdw": xmzxxmc,
                        "lxdh": lxdh,
                        "wechat": wxzh,
                        "jsyx": jsyx,
                        "openid":getUserOpenid,
                        "ssqy":ssqy
                    };
                }else {
                    layer.msg('请选择项目组信息');
                    return;
                }

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
                        //保存带sessionStorage中
                        sessionStorage.userMsg = JSON.stringify(data);
                        $(location).attr('href', '/sqxttestwx/sq/mine');
                    }else {
                        //提示错误信息
                        layer.msg(data['msg']);
                    }
                }
            });

        });
    });
});
