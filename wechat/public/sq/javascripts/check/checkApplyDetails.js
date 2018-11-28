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
        var check_application_msg = sessionStorage.check_application_msg;
        check_application_msg = JSON.parse(check_application_msg);
        console.log(check_application_msg);

	     var data = [];
         var userData=[];
         var xzqData=[];
        check_application_msg['data'].forEach(function (v) {
            console.log(v);
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

                var xksList = v['sqxlm'].split(',');
                v['xksList'] = xksList;
                data.push(v);
                
            }
        });
        
        userData=data;
        //临时授权超过2次 给出审核人员提醒
		$.ajax({
    		type:"get",
    		url:"/test/get_temporary_amount",
    		async:true,
    		data:{
    			"yhrzxxIndex":data[0]['index']
    		},
    		success:function(data){
    			console.log(data);
    			if(data['amount']>2){
    				layer.msg("临时授权超过2次");
    			}
    		}
    	});
    	
    	
		
		
        //3.渲染到页面
        var html = template('DetailsTpl',{data: data});
        $('.sq-check-msg').html(html);
		console.log(data);
	console.log(userData);
 	var yblzt=parseInt(userData[0].blzt);

        //4.通过认证
        $('#sq-adopt').on('click',function () {
		
            
            console.log('adopt');
            layer.open({
                type: 1,
                content: '<p class="tip">您确定要通过申请吗？</p>' +
                '<div class="layui-layer-btn layui-layer-btn-">' +
                '<a class="layui-layer-btn0">确定</a>' +
                '<a class="layui-layer-btn1">取消</a>' +
                '</div>',
                yes: function () {

                    $.ajax({
                        type: "POST",
                        url: "/test/checked_applications",
                        data: {
                            "index": urlMsg,
                            "cpdm":userData[0]['cpdm'],
                            "xmddm":userData[0]['xmddm'],
                            "sftg": "1",
                            "shyj": ""
                        },
                        dataType: "json",
                        success: function (data) {
                            console.log(data);
                            //渲染到页面
                            if (data['code'] == "0000") {
                            	
                            	//发送日志
                            	$.ajax({
					        		type:"post",
					        		url:"/test/save_rzjl",
					        		async:true,
					        		data:{
					        			"sqr":userData[0]['yhm'],
					        			"sqlx":userData[0]['sqlx'],
					        			"sqxks":userData[0]['sqxks'],
					        			"sqxx_index":userData[0]['index'],
					        			"sqrdw":userData[0]['dwmc'],
					        			"xzqdm":userData[0]['xzqdmMc'],
					        			"lxdh":userData[0]['lxdh'],
					        			"cpmc":userData[0]['cpmc'],
					        			"sqsl":userData[0]['sqsl'],
					        			"yxdz":userData[0]['yxdz'],
					        			"blzt": yblzt,
					        			"bljg":1
					        		},
					        		success:function(data){
					        			console.log(data)
					        		}
					        	});
                            	
                            	
                                //审核通过成功
                                // 2.跳转至用户信息审核页面
                                layer.msg('审核通过成功，即将跳转至申请信息审核列表页面', function () {
                                     $(location).attr('href', '/sqxttestwx/sq/checkApplyMsg');
                                });

                            } else {
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
        var getRefuseRe='';
        $('#sq-refuse').on('click',function () {
        	
            var reason = '';
            layer.open({
                type: 1,
                title:'拒绝原因',
                content: '<p class="reason">请填写拒绝原因</p>' +
                '<div id="" class="layui-layer-content layui-form sq-refuse-reason">'+
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
                        url: "/test/application_reject_reason",
                        dataType: "json",
                        success: function(data){
                            console.log(data);
                            data.forEach(function (v) {
                                $('.sq-refuse-reason select').append('<option value="'+ v +'">'+ v +'</option>');
                            });
                            form.render('select');

                            form.on('select(refuse-reason)', function(data){
                            	getRefuseRe=data.value;
                                console.log(data.value); //得到被选中的值
                                //把被选中的值赋给textarea
                                $('.sq-refuse-reason textarea').val(data.value);
                            });
                        }
                    });
                },
                yes: function(){
                    //do something
                    console.log(userData);
                    reason = $('.sq-refuse-reason textarea').val();
                  	
                    if(reason != ''){
                        layer.open({
                            type: 1,
                            content: '<p class="tip">您确定要拒绝申请吗？</p>' +
                            '<div class="layui-layer-btn layui-layer-btn-">' +
                            '<a class="layui-layer-btn0">确定</a>' +
                            '<a class="layui-layer-btn1">取消</a>' +
                            '</div>',
                            yes: function () {
                                $.ajax({
                                    type: "POST",
                                    url: "/test/checked_applications",
                                    data: {
                                        "index": urlMsg,
                                        "sftg": "0",
                                        "cpdm":userData[0]['cpdm'],
                            			"xmddm":userData[0]['xmddm'],
                                        "shyj": reason
                                    },
                                    dataType: "json",
                                    success: function(data){
                                    	
                                    	$.ajax({
							        		type:"post",
							        		url:"/test/save_rzjl",
							        		async:true,
							        		data:{
							        			"sqr":userData[0]['yhm'],
							        			"sqxx_index":userData[0]['index'],
							        			"sqrdw":userData[0]['dwmc'],
							        			"sqlx":userData[0]['sqlx'],
					        					"sqxks":userData[0]['sqxks'],
							        			"xzqdm":userData[0]['xzqdmMc'],
							        			"lxdh":userData[0]['lxdh'],
							        			"cpmc":userData[0]['cpmc'],
							        			"sqsl":userData[0]['sqsl'],
							        			"yxdz":userData[0]['yxdz'],
							        			"blzt": yblzt,
							        			"bljg":0,
							        			'bz':reason
							        		},
							        		success:function(data){
							        			console.log(data)
							        		}
							        	});
                                    	
                                    	
                                    	
                                    	
                                        console.log(reason);
                                        //渲染到页面
                                        if(data['code'] == "0000"){
                                            //拒绝审核成功
                                            // 2.跳转至xx页面
                                            layer.msg('拒绝审核成功，即将跳转至申请信息审核列表页面', function(){
                                                $(location).attr('href', '/sqxttestwx/sq/checkApplyMsg');
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