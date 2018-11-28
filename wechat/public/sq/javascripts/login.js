//主动加载jquery模块
layui.use(['jquery', 'form'], function () {
	var $ = layui.$,
		form = layui.form;

	$(function () {
		//从url中获取code
		function getQueryString(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;
		}
		var ycode = getQueryString('code');

		if (!ycode) {
			layer.msg("请勿在此页继续操作,移步至国图软件公众号进行登录");
		}
		//使用code获取openid
		var getOpenId = "";
		$.ajax({
			type: 'get',
			url: '/test/get_wx_openid',
			data: {
				"code": ycode
			},
			async: false,
			dataType: 'json',
			success: function (res) {
				console.log(res)
				getOpenId = res.openid;
			}
		})
		console.log(getOpenId);
		localStorage.setItem("openID", getOpenId);



		//先判断是否保存有用户信息
		var phoneMsg = localStorage.phoneMsg;
		if (phoneMsg != undefined) {
			phoneMsg = JSON.parse(phoneMsg);
			$('#phone-num').val(phoneMsg['tel']);
		}

		//表单验证
		form.verify({
			username: function (value, item) { //value：表单的值、item：表单的DOM对象
				var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;

				if (value == '') {
					return '请输入手机号';
				} else if (!myreg.test(value)) {
					return '手机号格式不正确';
				}
			},
			yzcode: function (value, item) {
				if(value==""){
					return "请填写验证码";	
				}
			}
		});

		var InterValObj; //timer变量，控制时间
		var count = 60; //间隔函数，1秒执行
		var curCount; //当前剩余秒数
		var code = ''; //验证码

		$('.btn-code').on('click', function () {
			curCount = count;
			var telNum = $('#phone-num').val();
			console.log(telNum);

			//设置button效果，开始计时
			$(this).addClass("layui-btn-disabled");
			$(this).html(+curCount + "S再获取");
			InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次

			$.ajax({
				type: 'POST',
				url: '/test/send_authcode',
				data: {
					'phone': telNum
				},
				dataType: 'json',
				success: function (res) {
					// console.log(res);
					if (res.code == '0002') {
						layer.msg(res.msg);
					}
					if (res.code == '0000') {
						layer.msg(res.msg + ',请注意查收');
					}
				}
			});
		});

		//timer处理函数
		function SetRemainTime() {
			if (curCount == 0) {
				window.clearInterval(InterValObj); //停止计时器
				$(".btn-code").removeClass("layui-btn-disabled"); //启用按钮
				$(".btn-code").html("获取验证码");
				code = ""; //清除验证码。如果不清除，过时间后，输入收到的验证码依然有效
			} else {
				curCount--;
				$(".btn-code").html(+curCount + "秒再获取");
			}
		}

		//监听表单提交
		// var ip = getIP();
		form.on('submit', function () {
			var tel = $('#phone-num').val();
			console.log(tel);
			var code = $('#code-input').val();

			$.ajax({
				type: "POST",
				url: "/test/login",
				data: {
					"phone": tel,
					"captcha": code
				},
				dataType: "json",
				success: function (data) {
					console.log(data);
					if (data['role']) {
						//普通用户
						//1.在sessionStorage中保存登录信息
						var loginMsg = {
							tel: tel,
							role: data['role']
						};
						sessionStorage.loginMsg = JSON.stringify(loginMsg);

						var phoneMsg = {
							tel: tel
						};
						localStorage.phoneMsg = JSON.stringify(phoneMsg);
						// 2.跳转至用户授权申请页面
						$(location).attr('href', '/sqxttestwx/sq/mine');
					} else {
						//提示错误信息
						layer.msg(data['msg']);
					}
				}
			});
		});

	});

});