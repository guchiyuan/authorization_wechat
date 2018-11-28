//1.注意：选项卡 依赖 element 模块，否则无法进行功能性操作
layui.use(['element', 'form', 'jquery'], function() {
	var element = layui.element,
		form = layui.form,
		$ = layui.$;

	//获取YYYY-MM-DD格式的日期
	// var nowDate = new Date();
	// var year = nowDate.getFullYear();
	// var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1)
	//     : nowDate.getMonth() + 1;
	// var day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate
	//     .getDate();
	// var dateStr = year + "-" + month + "-" + day;

	// var nowDate = new Date();
	// var year = nowDate.getFullYear();
	// var month = nowDate.getMonth() + 1;
	// var day = nowDate.getDate();
	var uuidv1 = require('uuidv1');

	// new Mdate("deadline", {
	// 	beginYear: year,
	// 	beginMonth: month,
	// 	beginDay: day,
	// 	endYear: year + 10,
	// 	endMonth: month,
	// 	endDay: day,
	// 	format: "-"
	// });

	$(function() {


		var getNum = parseInt($('.sq-reply-num input').val());
		//1. 渲染授权类型
		var sqlx = ''; //dm
		$("#authType").click(function() {
			var authType = new MobileSelect({
				trigger: '#authType',
				title: '单项选择',
				wheels: [{
					data: [{
							id: '1',
							value: '单机授权'
						},
						{
							id: '2',
							value: '服务器授权'
						}
					]
				}],
				position: [0, 1],
				callback: function(indexArr, data) {
					console.log(data); //返回选中的json数据
					sqlx = data[0]['id'];
					console.log(sqlx);
					//1.1 选择授权类型，如果是服务器授权：授权许可数显示，不能使用加密狗
					if(sqlx == 1) {
						//单击授权
						if(userType == "内部用户"){
							$("#moreAuthProduct").parent().removeClass("ycontrol-Hide"); //放出地籍多选
							$("#authProduct").parent().addClass("ycontrol-Hide");  //隐藏单选
						}
                       
						
						$('.sq-license-num').addClass('sq-hide');
						$('.sq-encryption').removeClass('sq-hide');
						if($('.sq-encryption .layui-form-radioed div').text() == "是") {
							$(".encryption-dog").show();
						}
						
					} else {
						$("#moreAuthProduct").parent().addClass("ycontrol-Hide"); //放出地籍多选
                        $("#authProduct").parent().removeClass("ycontrol-Hide");  //隐藏单选
						
						$('.sq-license-num').removeClass('sq-hide');
						$('.sq-encryption').addClass('sq-hide');

						$(".encryption-dog").hide();

					}
				}
			});
		})

		//1.1 渲染是否为甲方使用
		var isJfUse = '';
		$("#jfUse").click(function() {
			var jfUse = new MobileSelect({
				trigger: '#jfUse',
				title: '单项选择',
                wheels: [{
                    data: [{
                        id: '0',
                        value: '否'
                    },
                        {
                            id: '1',
                            value: '是'
                        }
                    ]
                }],
				position: [0, 1],
				callback: function(indexArr, data) {
					console.log(data); //返回选中的json数据
                    isJfUse = data[0]['id'];
					console.log(isJfUse);
					if(isJfUse == 1) {
                        $("#cityLine").parent().addClass("ycontrol-Hide");
                        $("#city").parent().removeClass("ycontrol-Hide");

                        $('.sq-business-name').removeClass('sq-hide');
						$('.sq-business-person').removeClass('sq-hide');
						
						$("#moreAuthProduct").parent().addClass("ycontrol-Hide");
                        $("#authProduct").parent().removeClass("ycontrol-Hide");
					

					} else {
						if(sqlx == 1){
                            $("#moreAuthProduct").parent().removeClass("ycontrol-Hide");
							$("#authProduct").parent().addClass("ycontrol-Hide");
						}
		
						$('.sq-business-name').addClass('sq-hide');
						$('.sq-business-person').addClass('sq-hide');

                        $("#cityLine").parent().removeClass("ycontrol-Hide");
                        $("#city").parent().addClass("ycontrol-Hide");


					}
				}
			})
		})

		//商务联系人
		 var list = [];
		$("#businessContact").click(function() {
			// debugger
			if(list.length!=0) {
				var mybusiness = new MobileSelect({
					trigger: '#businessContact',
					title: '单项选择',
					wheels: [{
						data: list
					}]
				});
			} else {
				layer.msg("所选行政区无商务联系人");
				$("#businessContact").text("请选择商务联系人")
			}
		})


		$.ajax({
			type: "GET",
			url: "/test/xzqdm",
			data: {
				"xzqjb": "1"
			},
			dataType: "json",
			async: false,
			success: function(data) {
				console.log(data);

				var provenceList = [];
				data.forEach(function(v) {
					var pro = {};
					pro['id'] = v['dm'];
					pro['value'] = v['mc'];
					provenceList.push(pro);
				});
				$("#provence").click(function() {
                    $("#areaLine").next().find("input").val("");
					var provence = new MobileSelect({
						trigger: '#provence',
						title: '单项选择',
						wheels: [{
							data: provenceList
						}],
						position: [0, 1],
						callback: function(indexArr, data) {
							console.log(data); //返回选中省的json数据
							proName = data[0]['id'];
							xzqdmList = [];
							xzqdmList.push(proName);
							console.log(xzqdmList)

							var district = [];
							console.log(proName)
							$.ajax({
								type: "GET",
								url: "/test/xzqdm",
								data: {
									"xzqjb": "2",
									"xzqdm": xzqdmList[0]
								},
								dataType: "json",
								async: false,
								success: function(data) {
									$("#city").text("");
                                    $("#areaLine").next().find("input").val("");
									console.log(data);
									data.forEach(function(v) {
										district.push({
											"id": v['dm'],
											"text": v['mc']
										});

									});

									var radioCityList = [];
									district.forEach(function(v) {
										var pro = {};
										pro['id'] = v['id'];
										pro['value'] = v['text'];
										radioCityList.push(pro);
									});
									console.log(radioCityList);

									// setCityData.updateWheel(0, radioCityList);
									$("#city").click(function() {

										var setCityData = new MobileSelect({
											trigger: '#city',
											title: '单项选择',
											wheels: [{
												data: radioCityList
											}],
											position: [0, 0],
											callback: function(indexArr, data) {
												 var darea = [];
												var cityIdNumber = Number(data[0].id);
												xzqdmList[0] = cityIdNumber;
												console.log(xzqdmList)
												//获得商务联系人的参数
												$.ajax({
													type: "GET",
													url: "/test/get_swlxr",
													data: {
														"xzqdm": cityIdNumber
													},
													dataType: "json",
													async: false,
													success: function(data) {
														console.log(data);
														var businessList = [];
														data.forEach(function(v) {
															businessList.push({
																"id": v['dm'],
																"value": v['mc']
															});
														});
														console.log(businessList)
														list = businessList;
														$("#businessContact").text("请选择商务联系人")

													}
												});

												//单选城市下获取区域数据
												$.ajax({
													type: "GET",
													url: "/test/xzqdm",
													data: {
														"xzqjb": "3",
														"xzqdm": cityIdNumber
													},
													dataType: "json",
													async: false,
													success: function(data) {
														console.log(data);
														data.forEach(function(v) {
															darea.push({
																"id": v['dm'],
																"text": v['mc']
															});
														});
													}
												});
												console.log(darea)
												var dareaList = [];

												$('#areaLine').combotree({
													valueField: "id", //Value字段
													textField: "text", //Text字段
													multiple: true,
													data: darea,
													onCheck: function(record) {
														console.log(record);
														console.log(record['checkState']);
														if(record['checkState'] == 'checked') {
															dareaList.push(record.id);
														} else {
															var n = dareaList.indexOf(record.id);
															if(n != -1) {
																dareaList.splice(n, 1);
															}
														}
														if(dareaList.length != 0) {
															xzqdmList = dareaList;
														} else {
															xzqdmList = cityList;
														}
													}
												});

											}

										})
									})
								}
							});

							//城市复选下拉框
							console.log(xzqdmList)

							var cityList = [];
							$('#cityLine').combotree({
								valueField: "id", //Value字段
								textField: "text", //Text字段
								multiple: true,
								data: district,
								onCheck: function(record) {
									console.log(record)
									if(record['checkState'] == 'checked') {
										cityList.push(record.id);
									} else {
										var n = cityList.indexOf(record.id);
										if(n != -1) {
											cityList.splice(n, 1);
										}
									}
									console.log(cityList);
									if(cityList.length != 0) {
										xzqdmList = cityList;
									} else {
										xzqdmList = [];
										xzqdmList.push(proName);
									}

									$.ajax({
										type: "GET",
										url: "/test/get_swlxr",
										data: {
											"xzqdm": cityList[0]
										},
										dataType: "json",
										async: false,
										success: function(data) {

											console.log(data);
											var businessList = [];
											data.forEach(function(v) {
												businessList.push({
													"id": v['dm'],
													"value": v['mc']
												});
											});
											console.log(businessList)
											list = businessList;
											$("#businessContact").text("请选择商务联系人");

										}
									});

									if(cityList.length == 1) {
										console.log(cityList[0]);

										//cityList = [];
										var area = [];
										$.ajax({
											type: "GET",
											url: "/test/xzqdm",
											data: {
												"xzqjb": "3",
												"xzqdm": cityList[0]
											},
											dataType: "json",
											async: false,
											success: function(data) {
												console.log(data);
												data.forEach(function(v) {
													area.push({
														"id": v['dm'],
														"text": v['mc']
													});
												});
											}
										});

										//复选下拉框
										var areaList = [];
										$('#areaLine').combotree({
											valueField: "id", //Value字段
											textField: "text", //Text字段
											multiple: true,
											data: area,
											onCheck: function(record) {
												console.log(record);
												console.log(record['checkState']);
												if(record['checkState'] == 'checked') {
													areaList.push(record.id);
												} else {
													var n = areaList.indexOf(record.id);
													if(n != -1) {
														areaList.splice(n, 1);
													}
												}
												if(areaList.length != 0) {
													xzqdmList = areaList;
												} else {
													xzqdmList = cityList;
												}

											}
										});

									} else {
										$('#areaLine').combotree({
											valueField: "id", //Value字段
											textField: "text", //Text字段
											multiple: true,
											data: []
										});
									}
								}
							});

						}
					});
				})
			}
		});

		//2.软件产品类型
		var cpdm = '';
		var cpmc = "";
		$.ajax({
			type: "GET",
			url: "/test/get_option/rjcplx",
			dataType: "json",
			success: function(data) {
				console.log(data);
				var proList = [];
				var moreProList=[];
				var moreListId=[];
				var moreListName=[];
				data.forEach(function(v) {
					 if(v.type==0) {
						var one = {};
						one['id'] = v['dm'];
						one['value'] = v['mc'];
						proList.push(one);
					 }
				});
				 data.forEach(function(v) {
					if(v.type==0) {
						moreProList.push({
							"id": v['dm'],
							"text": v['mc']
						});
					}
                });
				$("#authProduct").click(function() {
					var authProduct = new MobileSelect({
						trigger: '#authProduct',
						title: '单项选择',
						wheels: [{
							data: proList
						}],
						position: [0, 1],
						callback: function(indexArr, data) {
							console.log(data); //返回选中的json数据
							cpdm = data[0]['id'];
							cpmc = data[0]['value']
							console.log(cpdm);
						}
					});
				})
				 $('#moreAuthProduct').combotree({
                    valueField: "id", //Value字段
                    textField: "text", //Text字段
                    multiple: true,
                    data: moreProList,
                    onCheck: function (record) {
                    	
                        moreListId.push(record.id);
                        moreListName.push(record.text);
                        cpdm=moreListId.join();
                        cpmc=moreListName.join();
                        console.log(cpdm)
                        console.log(cpmc)
                    }
                })

			}
		});

		//使用加密狗
		var getRecipientsInfo = {},
			getInvoiceInfo = {};
		form.on('radio(encryptionTrue)', function(data) {
			layer.msg("硬件狗500元/个");
			$(".encryption-dog").show();
			$(".yCodeDiv").hide();
			//获取收件人信息
			$.ajax({
				type: "GET",
				url: "/test/get_postinfo_tpl",
				dataType: "json",
				async: false,
				success: function(data) {
					var recipientsArr = [];
					data.forEach(function(v) {
						recipientsArr.push({
							"id": v['dm'],
							"value": v['mc']
						});
					});
					recipientsArr.unshift({
						"id": "0",
						"value": "其他"
					})
					console.log(recipientsArr);
					$("#recipients").click(function() {
						var recipientsData = new MobileSelect({
							trigger: '#recipients',
							title: '单项选择',
							wheels: [{
								data: recipientsArr
							}],
							callback: function(indexArr, data) {
								var getRecipientsInfoInd = data[0].id;
								console.log(data[0].value)
								if(data[0].value != "其他") {
									getRecipientsInfo.post_index = getRecipientsInfoInd;

									$.ajax({
										type: "GET",
										url: "/test/get_postinfo",
										dataType: "json",
										data: {
											post_index: data[0].id
										},
										async: false,
										success: function(data) {
											console.log(data);
											$("#recipientsName").val(data.sjr);
											$("#recipientsPhone").val(data.lxdh);
											$("#recipientsAddress").val(data.sjrdz);
										}
									})
								} else {
									$(".recipients-div").find(".layui-input").val("");
								}
							}

						});
					})

				}
			})

			//获取开票信息
			$.ajax({
				type: "GET",
				url: "/test/get_invoiceinfo_tpl",
				dataType: "json",
				async: false,
				success: function(data) {
					console.log(data);
					var invoiceArr = [];
					data.forEach(function(v) {
						invoiceArr.push({
							"id": v['dm'],
							"value": v['mc']
						});
					});
					invoiceArr.unshift({
						"id": "0",
						"value": "其他"
					})
					console.log(invoiceArr);
					// invoiceData.updateWheel(0, invoiceArr);
					$("#invoiceInfo").click(function() {
						var invoiceData = new MobileSelect({
							trigger: '#invoiceInfo',
							title: '单项选择',
							wheels: [{
								data: invoiceArr
							}],
							callback: function(indexArr, data) {
								console.log(data[0].id)
								var ygetId = data[0].id;
								if(data[0].value != "其他") {
									getInvoiceInfo.invoice_index = ygetId;
									$.ajax({
										type: "GET",
										url: "/test/get_invoiceinfo",
										dataType: "json",
										data: {
											invoice_index: ygetId
										},
										async: false,
										success: function(data) {
											console.log(data);
											$("#invoiceCompany").val(data.companyName);
											$("#invoicePhone").val(data.companyTel);
											$("#invoiceAddress").val(data.companyAddress);
											$("#ratepayingNum").val(data.taxObjectId);
											$("#depositBank").val(data.bank);
											$("#bankCount").val(data.account);
										}
									})
								} else {
									$(".invoice-div").find(".layui-input").val("");
								}
							}
						});
					})

				}
			})
			form.render();
		});

		//隐藏加密狗弹出框
		form.on('radio(encryptionFalse)', function(data) {
			$(".encryption-dog").hide();
			$(".yCodeDiv").show();
			form.render();
		})

		var proName = '';
		var xzqdmList = [];

		//3. 获取省

		// $.ajax({
		// 	type: "GET",
		// 	url: "/api/xzqdm",
		// 	data: {
		// 		"xzqjb": "1"
		// 	},
		// 	dataType: "json",
		// 	async: false,
		// 	success: function(data) {
		// 		console.log(data);
		//
		// 		var provenceList = [];
		// 		data.forEach(function(v) {
		// 			var pro = {};
		// 			pro['id'] = v['dm'];
		// 			pro['value'] = v['mc'];
		// 			provenceList.push(pro);
		// 		});
		// 		$("#provence").click(function() {
		//
		// 			var provence = new MobileSelect({
		// 				trigger: '#provence',
		// 				title: '单项选择',
		// 				wheels: [{
		// 					data: provenceList
		// 				}],
		// 				position: [0, 1],
		// 				callback: function(indexArr, data) {
		// 					console.log(data); //返回选中省的json数据
		// 					proName = data[0]['id'];
		// 					xzqdmList = [];
		// 					xzqdmList.push(proName);
		// 					console.log(xzqdmList)
		//
		// 					var district = [];
		// 					console.log(proName)
		// 					$.ajax({
		// 						type: "GET",
		// 						url: "/api/xzqdm",
		// 						data: {
		// 							"xzqjb": "2",
		// 							"xzqdm": xzqdmList[0]
		// 						},
		// 						dataType: "json",
		// 						async: false,
		// 						success: function(data) {
		//
		// 							$("#city").text("");
		// 							console.log(data);
		// 							data.forEach(function(v) {
		// 								district.push({
		// 									"id": v['dm'],
		// 									"text": v['mc']
		// 								});
		//
		// 							});
		//
		// 							var radioCityList = [];
		// 							district.forEach(function(v) {
		// 								var pro = {};
		// 								pro['id'] = v['id'];
		// 								pro['value'] = v['text'];
		// 								radioCityList.push(pro);
		// 							});
		// 							console.log(radioCityList);
		//
		// 							// setCityData.updateWheel(0, radioCityList);
		// 							$("#city").click(function() {
		//
		// 								var setCityData = new MobileSelect({
		// 									trigger: '#city',
		// 									title: '单项选择',
		// 									wheels: [{
		// 										data: radioCityList
		// 									}],
		// 									position: [0, 0],
		// 									callback: function(indexArr, data) {
		// 										var darea = [];
		// 										var cityIdNumber = Number(data[0].id);
		// 										xzqdmList[0] = cityIdNumber;
		// 										console.log(xzqdmList)
		//
		// 										//获得商务联系人的参数
		// 										$.ajax({
		// 											type: "GET",
		// 											url: "/api/get_swlxr",
		// 											data: {
		// 												"xzqdm": cityIdNumber
		// 											},
		// 											dataType: "json",
		// 											async: false,
		// 											success: function(data) {
		//
		// 												console.log(data);
		// 												var businessList = [];
		// 												data.forEach(function(v) {
		// 													businessList.push({
		// 														"id": v['dm'],
		// 														"value": v['mc']
		// 													});
		// 												});
		// 												console.log(businessList)
		// 												//商务联系人
		// 												$(document).on("click", "#businessContact", function() {
		//                                                     console.log(data)
		// 													console.log(data.length)
		// 													if(data.length==0){
		//
		//                                                         layer.msg("所选择行政区无商务联系人1");
		//
		// 													}else{
		//
		// 													var mybusiness = new MobileSelect({
		// 														trigger: '#businessContact',
		// 														title: '单项选择',
		// 														wheels: [{
		// 															data: businessList
		// 														}],
		// 													});
		//                                                     }
		// 												})
		//
		// 											}
		// 										});
		//
		// 										//获取区域数据
		// 										$.ajax({
		// 											type: "GET",
		// 											url: "/api/xzqdm",
		// 											data: {
		// 												"xzqjb": "3",
		// 												"xzqdm": cityIdNumber
		// 											},
		// 											dataType: "json",
		// 											async: false,
		// 											success: function(data) {
		// 												console.log(data);
		// 												data.forEach(function(v) {
		// 													darea.push({
		// 														"id": v['dm'],
		// 														"text": v['mc']
		// 													});
		// 												});
		// 											}
		// 										});
		// 										console.log(darea)
		// 										var dareaList = [];
		//
		// 										$('#areaLine').combotree({
		// 											valueField: "id", //Value字段
		// 											textField: "text", //Text字段
		// 											multiple: true,
		// 											data: darea,
		// 											onCheck: function(record) {
		// 												console.log(record);
		// 												console.log(record['checkState']);
		// 												if(record['checkState'] == 'checked') {
		// 													dareaList.push(record.id);
		// 												} else {
		// 													var n = dareaList.indexOf(record.id);
		// 													if(n != -1) {
		// 														dareaList.splice(n, 1);
		// 													}
		// 												}
		// 												if(dareaList.length != 0) {
		// 													xzqdmList = dareaList;
		// 												} else {
		// 													xzqdmList = cityList;
		// 												}
		// 											}
		// 										});
		// 									}
		//
		// 								})
		// 							})
		// 						}
		// 					});
		//
		// 					//城市单选下拉框
		//
		// 					// var getCityId = '';
		//
		// 					console.log(xzqdmList)
		//
		// 					var cityList = [];
		// 					$('#cityLine').combotree({
		// 						valueField: "id", //Value字段
		// 						textField: "text", //Text字段
		// 						multiple: true,
		// 						data: district,
		// 						onCheck: function(record) {
		// 							console.log(record)
		// 							if(record['checkState'] == 'checked') {
		// 								cityList.push(record.id);
		// 							} else {
		// 								var n = cityList.indexOf(record.id);
		// 								if(n != -1) {
		// 									cityList.splice(n, 1);
		// 								}
		// 							}
		// 							console.log(cityList);
		// 							if(cityList.length != 0) {
		// 								xzqdmList = cityList;
		// 							} else {
		// 								xzqdmList = [];
		// 								xzqdmList.push(proName);
		// 							}
		//
		// 							if(cityList.length == 1) {
		// 								console.log(cityList[0]);
		//
		// 								//cityList = [];
		// 								var area = [];
		// 								$.ajax({
		// 									type: "GET",
		// 									url: "/api/xzqdm",
		// 									data: {
		// 										"xzqjb": "3",
		// 										"xzqdm": cityList[0]
		// 									},
		// 									dataType: "json",
		// 									async: false,
		// 									success: function(data) {
		// 										console.log(data);
		// 										data.forEach(function(v) {
		// 											area.push({
		// 												"id": v['dm'],
		// 												"text": v['mc']
		// 											});
		// 										});
		// 									}
		// 								});
		//
		// 								//复选下拉框
		// 								var areaList = [];
		// 								$('#areaLine').combotree({
		// 									valueField: "id", //Value字段
		// 									textField: "text", //Text字段
		// 									multiple: true,
		// 									data: area,
		// 									onCheck: function(record) {
		// 										console.log(record);
		// 										console.log(record['checkState']);
		// 										if(record['checkState'] == 'checked') {
		// 											areaList.push(record.id);
		// 										} else {
		// 											var n = areaList.indexOf(record.id);
		// 											if(n != -1) {
		// 												areaList.splice(n, 1);
		// 											}
		// 										}
		// 										if(areaList.length != 0) {
		// 											xzqdmList = areaList;
		// 										} else {
		// 											xzqdmList = cityList;
		// 										}
		//
		// 									}
		// 								});
		//
		// 							} else {
		// 								$('#areaLine').combotree({
		// 									valueField: "id", //Value字段
		// 									textField: "text", //Text字段
		// 									multiple: true,
		// 									data: []
		// 								});
		// 							}
		// 						}
		// 					});
		//
		// 				}
		// 			});
		// 		})
		// 	}
		// });

		// form.on('select(provence)', function(data) {
		// 	console.log(data.value);
		// 	proName = data.value;
		// 	xzqdmList = [];
		// 	xzqdmList.push(proName);
		//
		// 	var district = [];
		// 	$.ajax({
		// 		type: "GET",
		// 		url: "/api/xzqdm",
		// 		data: {
		// 			"xzqjb": "2",
		// 			"xzqdm": proName
		// 		},
		// 		dataType: "json",
		// 		async: false,
		// 		success: function(data) {
		// 			console.log(data);
		// 			data.forEach(function(v) {
		// 				district.push({
		// 					"id": v['dm'],
		// 					"text": v['mc']
		// 				});
		// 			});
		// 		}
		// 	});
		// 	//复选下拉框
		// 	var cityList = [];
		// 	$('#cityLine').combotree({
		// 		valueField: "id", //Value字段
		// 		textField: "text", //Text字段
		// 		multiple: true,
		// 		data: district,
		// 		onCheck: function(record) {
		// 			console.log(record);
		// 			console.log(record['checkState']);
		// 			if(record['checkState'] == 'checked') {
		// 				cityList.push(record.id);
		// 			} else {
		// 				var n = cityList.indexOf(record.id);
		// 				if(n != -1) {
		// 					cityList.splice(n, 1);
		// 				}
		// 			}
		// 			if(cityList.length != 0) {
		// 				xzqdmList = cityList;
		// 			} else {
		// 				xzqdmList = [];
		// 				xzqdmList.push(proName);
		// 			}
		//
		// 			if(cityList.length == 1) {
		// 				console.log(cityList[0]);
		// 				cityList = [];
		// 				var area = [];
		// 				$.ajax({
		// 					type: "GET",
		// 					url: "/api/xzqdm",
		// 					data: {
		// 						"xzqjb": "3",
		// 						"xzqdm": cityList[0]
		// 					},
		// 					dataType: "json",
		// 					async: false,
		// 					success: function(data) {
		// 						console.log(data);
		// 						data.forEach(function(v) {
		// 							area.push({
		// 								"id": v['dm'],
		// 								"text": v['mc']
		// 							});
		// 						});
		// 					}
		// 				});
		// 				//复选下拉框
		// 				var areaList = [];
		// 				$('#areaLine').combotree({
		// 					valueField: "id", //Value字段
		// 					textField: "text", //Text字段
		// 					multiple: true,
		// 					data: area,
		// 					onCheck: function(record) {
		// 						console.log(record);
		// 						console.log(record['checkState']);
		// 						if(record['checkState'] == 'checked') {
		// 							areaList.push(record.id);
		// 						} else {
		// 							var n = areaList.indexOf(record.id);
		// 							if(n != -1) {
		// 								areaList.splice(n, 1);
		// 							}
		// 						}
		// 						if(areaList.length != 0) {
		// 							xzqdmList = areaList;
		// 						} else {
		// 							xzqdmList = cityList;
		// 						}
		//
		// 					}
		// 				});
		// 			} else {
		// 				$('#areaLine').combotree({
		// 					valueField: "id", //Value字段
		// 					textField: "text", //Text字段
		// 					multiple: true,
		// 					data: []
		// 				});
		// 			}
		// 		}
		// 	});
		//
		// });

		//4. 授权截止时间
		//4.1 公司用户(甲方)
		var gsjzsjlx = '';
		$("#gsEnd").click(function() {
			var gsEnd = new MobileSelect({
				trigger: '#gsEnd',
				title: '单项选择',
				wheels: [{
					data: [{
							id: '1',
							value: '临时授权(两周)'
						},
						{
							id: '2',
							value: '长期授权(一年)'
						},
						{
							id: '3',
							value: '自定义'
						}
					]
				}],
				position: [0, 1],
				callback: function(indexArr, data) {
					console.log(data); //返回选中的json数据
					gsjzsjlx = data[0]['id'];
					console.log(gsjzsjlx);

					// 内部员工选择 截止时间 选择 自定义
					if(gsjzsjlx == 3) {
						//自定义
						$('.sq-dead-time').removeClass('sq-hide');
					} else {
						$('.sq-dead-time').addClass('sq-hide');

					}
				}
			});
		})
		//4.2 内部员工
		var nbjzsjlx = '';
		$("#nbEnd").click(function() {
			var nbEnd = new MobileSelect({
				trigger: '#nbEnd',
				title: '单项选择',
				wheels: [{
					data: [{
							id: '1',
							value: '临时授权(两周)'
						},
						{
							id: '2',
							value: '长期授权(一年)'
						},
						{
							id: '3',
							value: '自定义'
						}
					]
				}],
				position: [0, 1],
				callback: function(indexArr, data) {
					console.log(data); //返回选中的json数据
					nbjzsjlx = data[0]['id'];
					console.log(nbjzsjlx);

					// 内部员工选择 截止时间 选择 自定义
					if(nbjzsjlx == 3) {
						//自定义
						$('.sq-dead-time').removeClass('sq-hide');
					} else {
						$('.sq-dead-time').addClass('sq-hide');

					}
				}
			});
		})


		$(document).on("click", ".combo", function() {
			if($("#cityLine").next().find("input").val()=="" && !$("#cityLine").parent().hasClass("ycontrol-Hide")){
				$("#areaLine").combo('hidePanel', true);
                $('#areaLine').combotree("clear");
			};
            if($("#city").next().find("input").val()=="" && !$("#city").parent().hasClass("ycontrol-Hide")){

                $("#areaLine").combo('hidePanel', true);

            };

            if(($("#areaLine").combotree('tree').tree('getRoots').length) == 0) {
				$("#areaLine").combo('hidePanel', true);
			}
			if(($("#cityLine").combotree('tree').tree('getRoots').length) == 0) {
				$("#cityLine").combo('hidePanel', true);
			}
		})

		//5.表单验证

		form.verify({
			isEmpty: function(value, item) { //value：表单的值、item：表单的DOM对象
				if(/^\s*$/g.test(value)) {
					return '请把信息填写完整';
				}
			},
			isNumber: [
				/^\d+$/, '电话只能输入数字'
			],
			isNull: function(value, item) {
				if(value == "") {
					return "信息不能为空";
				}
			}
		});

		//6.申请人类型问题
		var flag = true;

		var userMsg = sessionStorage.userMsg;
		userMsg = JSON.parse(userMsg);
		console.log(userMsg);
		var userType = userMsg['sqrlx'];
		if(userType == "内部用户") {
			flag = true;
			$('.sq-nb-end').removeClass('sq-hide');
			$("#cityLine").parent().removeClass("ycontrol-Hide")
			
		} else {
			$("#city").parent().removeClass("ycontrol-Hide")
			$("#authProduct").parent().removeClass("ycontrol-Hide")
			flag = false;
			$('.sq-gs-end').removeClass('sq-hide');
			$('.sq-business-name').removeClass('sq-hide');
			$('.sq-business-person').removeClass('sq-hide');
			$('.sq-jf-use').addClass('sq-hide');
		}

		var sqxlmList = [];
		//7改变数量
		//7.1 改变申请数量
		var appVal = $('.appl-num').val();
		var licenseVal = $('.license-num').val();

		$(".license-num").blur(function() {
			licenseVal = $('.license-num').val();
			if(licenseVal > 99) {
				licenseVal = 99;
				$('.license-num').val(licenseVal);
			} else if(licenseVal < 99 && licenseVal > 2) {
				$('.license-num').val(licenseVal);
			} else if(appVal <= 2 || appVal == "") {
				licenseVal = 2;
				$('.license-num').val(licenseVal);
			}
		})

		$('.plus').click(function() {
			appVal++;
			// console.log(appVal);
			$('.appl-num').val(appVal);
			getNum = appVal;
			if(getNum <= 0) {
				$(".sq-get-code").css({
					color: "#ccc"
				})
			} else {
				$(".sq-get-code").css({
					color: "#333"
				})
			}
			$('.sq-many-line .sq-check-main').html("");
			sqxlmList.length = 0;

			console.log($('.appl-num').val());
		});
		//申请数量减少
		$('.minus').click(function() {
			if(appVal == 1) {
				$('.appl-num').val(1);
			} else {
				appVal--;
				$('.appl-num').val(appVal);
			}
			getNum = appVal;
			if(getNum <= 0) {
				$(".sq-get-code").css({
					color: "#ccc"
				})
			} else {
				$(".sq-get-code").css({
					color: "#333"
				})
			}
			$('.sq-many-line .sq-check-main').html("");
			sqxlmList.length = 0;
			console.log($('.appl-num').val());
		});
		//7.2 改变授权许可数

		$('.li-plus').click(function() {
			if(licenseVal == 99) {
				$('.license-num').val(99);
			} else {
				licenseVal++;
				$('.license-num').val(licenseVal);
			}

			// console.log(appVal);
			$('.license-num').val(licenseVal);

			console.log($('.license-num').val());
		});
		//申请数量减少
		$('.li-minus').click(function() {
			if(licenseVal == 2) {
				$('.license-num').val(2);
			} else {
				licenseVal--;
				$('.license-num').val(licenseVal);
			}

			console.log($('.license-num').val());
		});

		//微信
		//8.单击 扫一扫获取授权码

		$(document).ready(function() {
			//获取access_token
			var getAccesssToken = '';
			$.ajax({
				type: "get",
				url: "/test/get_access_token",
				dataType: "json",
				async: false,
				success: function(data) {
					getAccesssToken = data.access_token;
					console.log(data)
				}
			})
			var ourl = window.location.href;
			//获取调用扫一扫需要的参数
			var config = {};
			$.ajax({
				type: "get",
				url: "/test/get_wxconfig",
				data: {
					"url": ourl,
					"access_token": getAccesssToken
				},
				async: false,
				success: function(data) {
					config = data;
				}
			})

			console.log(config)

			if(!$.isEmptyObject(config)) {
				// alert(JSON.stringify(config));
				//调用微信扫一扫
				wx.config({
					//debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: config.appID, // 必填，公众号的唯一标识
					timestamp: config.timestamp, // 必填，生成签名的时间戳
					nonceStr: config.nonceStr, // 必填，生成签名的随机串
					signature: config.signature, // 必填，签名
					jsApiList: ['checkJsApi', 'scanQRCode'] // 必填，需要使用的JS接口列表
				});

				wx.ready(function() {
					// alert("ready");
					// $.hideLoading();
				});

				wx.error(function(res) {
					alert("error");
					// layer.open({
					//     title: '提示',
					//     content: '微信接口调用权限获取失败,请联系管理员'
					// });
					// $.alert("微信接口调用权限获取失败,请联系管理员");
				});

			} else {
				alert("失败");
				// layer.open({
				//     title: '提示',
				//     content: '微信接口调用权限获取失败,请联系管理员'
				// });
				// $.alert("微信接口调用权限获取失败,请联系管理员");
			}
		});

		$(".sq-get-code").on('click', function() {
			console.log(getNum)
			if(getNum > 0) {

				// sqxlmList.length=0;
				// layer.msg('请稍后');
				// alert('请稍后');
				wx.scanQRCode({
					desc: 'scanQRCode desc',
					needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
					scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
					success: function(res) {
						// getNum-=sqxlmList.length;
						if($.inArray(res.resultStr, sqxlmList) == -1) {
							sqxlmList.push(res.resultStr);
							// var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
							var html = $('.sq-many-line .sq-check-main').html();
							html += '<p>' + res.resultStr + '</p>';
							$('.sq-many-line .sq-check-main').html(html);
							$('.sq-many-line').removeClass('sq-hide');
							getNum--;
							if(getNum <= 0) {
								$(".sq-get-code").css({
									color: "#ccc"
								})
							} else {
								$(".sq-get-code").css({
									color: "#333"
								})
							}
						} else {
							layer.msg('授权序列码不能重复');
						}
					}
				});
			}

		});





		//定义需要的参数
		var sqxks;
		var jmg; //true/false
		// var xzqdm = '320101';//代码
		var sjrxm, sjrdh, sjrdz;
		var sqsl;
		var jzsj = ''; //时间戳
		var swhtmc;
		var swlxr;
		var sqxlm = '';
		var myreg = /^1[358][0-9]{9}$/;
		var isNum = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
		var ypatrn = /^[0-9]*$/;
		form.on('submit', function() {
			sqxlm = "";
			jmg = $('.sq-encryption .layui-form-radioed div').text() == "是" ? 1 : 0;
			sqsl = parseInt($('.sq-reply-num input').val());
			if(jmg == 1) {
				sqxlm = null;
				var recipientsName = $("#recipientsName").val(),
					recipientsPhone = $("#recipientsPhone").val(),
					recipientsAddress = $("#recipientsAddress").val(),
					invoiceCompany = $("#invoiceCompany").val(),
					invoiceAddress = $("#invoiceAddress").val(),
					invoicePhone = $("#invoicePhone").val(),
					ratepayingNum = $("#ratepayingNum").val(),
					bankCount = $("#bankCount").val(),
					depositBank = $("#depositBank").val();

				var recipientsOptionVal = $("#recipients").text() == "其他" ? 1 : 0;
				var invoiceInfOptionVal = $("#invoiceInfo").text() == "其他" ? 1 : 0;
				if(recipientsOptionVal) {
					getRecipientsInfo.post_index = uuidv1();
					getRecipientsInfo.sjr = $("#recipientsName").val();
					getRecipientsInfo.sjrlxdh = $("#recipientsPhone").val();
					getRecipientsInfo.sjrdz = $("#recipientsAddress").val();
					console.log(getRecipientsInfo);

				}
				if(invoiceInfOptionVal) {
					getInvoiceInfo.invoice_index = uuidv1();
					getInvoiceInfo.company_name = $("#invoiceCompany").val();
					getInvoiceInfo.company_address = $("#invoiceAddress").val();
					getInvoiceInfo.company_tel = $("#invoicePhone").val();
					getInvoiceInfo.tax_objectid = $("#ratepayingNum").val();
					getInvoiceInfo.account = $("#bankCount").val();
					getInvoiceInfo.bank = $("#depositBank").val();
					console.log(getInvoiceInfo)

				}
				if(recipientsName == "" || recipientsAddress == "" || invoiceCompany == "" || invoiceAddress == "" || ratepayingNum == "" || bankCount == "" || depositBank == "") {
					layer.msg("请把信息填写完整");
					return;
				}
				if(!myreg.test(recipientsPhone)) {
					layer.msg("请填写有效手机号");
					return;
				}
				if(!isNum.test(invoicePhone)) {
					layer.msg("请填写有效公司电话");
					return;
				}
				if(!ypatrn.test(bankCount)) {
					layer.msg("请填写有效账户");
					return;
				}

			} else {
				getInvoiceInfo.invoice_index = "";
				getRecipientsInfo.post_index = "";

				if(sqxlmList.length != sqsl) {
					layer.msg("申请数量与授权序列码数量不一致");
					return;
				}
				sqxlmList.forEach(function(v) {
					sqxlm += v + ',';
				});
				sqxlm = sqxlm.substring(0, sqxlm.length - 1);
				console.log(sqxlm);
			}
			console.log(getRecipientsInfo, getInvoiceInfo)

			var xzqdm = ''; //代码
			console.log(sqlx);
			sqxks = $('.license-num').val();

			// sjrxm = $("#recipientsName").val();
			// sjrdh = $("#recipientsPhone").val();
			// sjrdz = $("#recipientsAddress").val();

			console.log(xzqdmList);
			for(var i = 0; i < xzqdmList.length; i++) {
				xzqdm += xzqdmList[i] + ',';
			}
			xzqdm = xzqdm.substr(0, xzqdm.length - 1);
			// for(var i = 0; i < $('.sq-area-dm .textbox-value').length; i++){
			//     if(i = 0){
			//         xzqdm = $('.sq-area-dm .textbox-value')[i].value;
			//     }else {
			//         xzqdm += ',' + $('.sq-area-dm .textbox-value')[i].value;
			//     }
			// }
			console.log(xzqdm);
			// sqxlmList = ["111111111"];
			// xzqdm = "320101";

			// nbjzsjlx = $('.sq-nb-end .layui-this').attr('lay-value');
			// gsjzsjlx = $('.sq-gs-end .layui-this').attr('lay-value');

			var strTime = 3;
            //var ygetTime=$("#deadline").text();
			//var getT= ygetTime.split("-")
			// if($('#deadline').data('year')) {
				//var selYear =parseInt(getT[0]);
				//var selMonth = parseInt(getT[1]) < 10 ? "0" + parseInt(getT[1]) :
                    //parseInt(set[1]) + 1;
				//var selDay = parseInt(getT[2]) < 10 ? "0" + parseInt(getT[2]) :
                    //parseInt(getT[2])+ 1;
            		//yjzsj = selYear + '-' + selMonth + '-' + selDay;
				//console.log(strTime);
				//console.log(strTime == '');
				//var date = new Date(yjzsj.replace(/-/g, '/'));
				var date = new Date($("#deadline").text().replace(/-/g, '/'));
				jzsj = date.getTime();
			// }
			// var ygetTime=$("#deadline").text()
           // jzsj=getMyDate(ygetTime)

			console.log(jzsj);
            //if($("#nbEnd").text()=="自定义"){
                //strTime=3;
            //}else if($("#nbEnd").text()=="临时授权(两周)"){
                //strTime=1;
            //}else if($("#nbEnd").text()=="长期授权(一年)"){
                //strTime=2;
            //}
			swhtmc = $('.sq-business-name input').val();
			var myBT = $('#businessContact').text()
			if(myBT != "请选择商务联系人") {
				swlxr = $('#businessContact').text();
			} else {
				swlxr = "";
			}

			if(sqlx == '' || cpdm == '' || proName == '') {
				layer.msg("请把信息填写完整");
				return;
			}
			// if(jmg) {
			// 	if(sjrxm == "" || sjrdh == "" || sjrdz == "") {
			// 		layer.msg("请把信息填写完整");
			// 		return;
			// 	}
			// }

			//先判断用户类型是不是内部员工
			if(flag) {
				//内部员工
				if(isJfUse != '') {
					if(sqlx == 1) {
						//单击授权
						if(nbjzsjlx != '') {
							if(nbjzsjlx == 3) {
								//自定义类型
								if(strTime == '') {
									layer.msg("请选择截止时间");
									return;
								} else {
									if(sqxlm == '') {
										layer.msg("请点击扫一扫获取授权序列码");
										return;
									} else {
										var nbData = {
											"sqlx": sqlx,
											"cpdm": cpdm,
											"cpmc": cpmc,
											"jmg": jmg,
											"xzqdm": xzqdm,
											"sqsl": sqsl,
											"jzsjlx": nbjzsjlx,
											"jzsj": jzsj,
											"sqxlm": sqxlm,
											"jfsy": isJfUse,
											"post_index": getRecipientsInfo.post_index,
											"invoice_index": getInvoiceInfo.invoice_index
										};
									}
								}
							} else {
								if(sqxlm == '') {
									layer.msg("请点击扫一扫获取授权序列码");
									return;
								} else {
									var nbData = {
										"sqlx": sqlx,
										"cpdm": cpdm,
										"cpmc": cpmc,
										"jmg": jmg,
										"xzqdm": xzqdm,
										"sqsl": sqsl,
										"jzsjlx": nbjzsjlx,
										"sqxlm": sqxlm,
										"jfsy": isJfUse,
										"post_index": getRecipientsInfo.post_index,
										"invoice_index": getInvoiceInfo.invoice_index
									};
								}
							}
						} else {
							layer.msg("请选择授权截止时间");
							return;
						}

					} else {
						//服务器授权
						if(nbjzsjlx == 3) {
							if(strTime == '') {
								layer.msg("请选择截止时间");
								return;
							} else {
								if(sqxlm == '') {
									layer.msg("请点击扫一扫获取授权序列码");
									return;
								} else {
									var nbData = {
										"sqlx": sqlx,
										"sqxks": sqxks,
										"cpdm": cpdm,
										"cpmc": cpmc,
										"xzqdm": xzqdm,
										"sqsl": sqsl,
										"jzsjlx": nbjzsjlx,
										"jzsj": jzsj,
										"sqxlm": sqxlm,
										"jfsy": isJfUse,
										"post_index": getRecipientsInfo.post_index,
										"invoice_index": getInvoiceInfo.invoice_index
									};
								}
							}
						} else {
							if(sqxlm == '') {
								layer.msg("请点击扫一扫获取授权序列码");
								return;
							} else {
								var nbData = {
									"sqlx": sqlx,
									"sqxks": sqxks,
									"cpdm": cpdm,
									"cpmc": cpmc,
									"xzqdm": xzqdm,
									"sqsl": sqsl,
									"jzsjlx": nbjzsjlx,
									"sqxlm": sqxlm,
									"jfsy": isJfUse,
									"post_index": getRecipientsInfo.post_index,
									"invoice_index": getInvoiceInfo.invoice_index
								};
							}
						}
					}
				} else {
					layer.msg("请选择是否为甲方使用");
					return;
				}

			} else {
				// 公司用户
				if(sqlx == 1) {
					//单击授权
					if(gsjzsjlx != '') {
						if(gsjzsjlx == 3) {
							//自定义类型
							if(strTime == '') {
								layer.msg("请选择截止时间");
								return;
							} else {
								if(swhtmc != '' && swlxr != '') {
									if(sqxlm == '') {
										layer.msg("请点击扫一扫获取授权序列码");
										return;
									} else {
										var nbData = {
											"sqlx": sqlx,
											"cpdm": cpdm,
											"cpmc": cpmc,
											"jmg": jmg,
											"xzqdm": xzqdm,
											"sqsl": sqsl,
											"jzsjlx": gsjzsjlx,
											"jzsj": jzsj,
											"sqxlm": sqxlm,
											"swhtmc": swhtmc,
											"swlxr": swlxr,
											"post_index": getRecipientsInfo.post_index,
											"invoice_index": getInvoiceInfo.invoice_index
										};
									}

								} else {
									layer.msg("请把信息填写完整");
									return;
								}
							}
						} else {
							if(swhtmc != '' && swlxr != '') {
								if(sqxlm == '') {
									layer.msg("请点击扫一扫获取授权序列码");
									return;
								} else {
									var nbData = {
										"sqlx": sqlx,
										"cpdm": cpdm,
										"cpmc": cpmc,
										"jmg": jmg,
										"xzqdm": xzqdm,
										"sqsl": sqsl,
										"jzsjlx": gsjzsjlx,
										"sqxlm": sqxlm,
										"swhtmc": swhtmc,
										"swlxr": swlxr,
										"post_index": getRecipientsInfo.post_index,
										"invoice_index": getInvoiceInfo.invoice_index
									};
								}

							} else {
								layer.msg("请把信息填写完整");
								return;
							}
						}
					} else {
						layer.msg("请选择授权截止时间");
						return;
					}

				} else {
					//服务器授权
					if(gsjzsjlx != '') {
						if(gsjzsjlx == 3) {
							//自定义类型
							if(strTime == '') {
								layer.msg("请选择截止时间");
								return;
							} else {
								if(swhtmc != '' && swlxr != '') {
									if(sqxlm == '') {
										layer.msg("请点击扫一扫获取授权序列码");
										return;
									} else {
										var nbData = {
											"sqlx": sqlx,
											"sqxks": sqxks,
											"cpdm": cpdm,
											"cpmc": cpmc,
											"xzqdm": xzqdm,
											"sqsl": sqsl,
											"jzsjlx": gsjzsjlx,
											"jzsj": jzsj,
											"sqxlm": sqxlm,
											"swhtmc": swhtmc,
											"swlxr": swlxr,
											"post_index": getRecipientsInfo.post_index,
											"invoice_index": getInvoiceInfo.invoice_index
										};
									}

								} else {
									layer.msg("请把信息填写完整");
									return;
								}
							}
						} else {
							if(swhtmc != '' && swlxr != '') {
								if(sqxlm == '') {
									layer.msg("请点击扫一扫获取授权序列码");
									return;
								} else {
									var nbData = {
										"sqlx": sqlx,
										"sqxks": sqxks,
										"cpdm": cpdm,
										"cpmc": cpmc,
										"xzqdm": xzqdm,
										"sqsl": sqsl,
										"jzsjlx": gsjzsjlx,
										"sqxlm": sqxlm,
										"swhtmc": swhtmc,
										"swlxr": swlxr,
										"post_index": getRecipientsInfo.post_index,
										"invoice_index": getInvoiceInfo.invoice_index
									};
								}

							} else {
								layer.msg("请把信息填写完整");
								return;
							}
						}
					} else {
						layer.msg("请选择授权截止时间");
						return;
					}

				}
			}
			//选择甲方传的值
			if(isJfUse == 1) {
				nbData.swlxr = swlxr;
			 	nbData.swhtmc = swhtmc;
			}
      
			console.log(nbData);
				//收件人信息
                if ($("#recipients").text() == "其他" && jmg == 1) {
                    console.log(getRecipientsInfo)
                    $.ajax({
                        type: "POST",
                        url: "/test/save_postinfo",
                        data: getRecipientsInfo,
                        dataType: "json",
                        async: false,
                        success: function (data) {
                            console.log(data);
                        }
                    })
                }
                //开票信息
                if ($("#invoiceInfo").text() == "其他" && jmg == 1) {
                    console.log(getInvoiceInfo)
                    $.ajax({
                        type: "POST",
                        url: "/test/save_invoiceinfo",
                        data: getInvoiceInfo,
                        dataType: "json",
                        async: false,
                        success: function (data) {
                            console.log(data);
                        }
                    })
                }

			console.log(nbData)
			//提交申请信息
			$.ajax({
				type: "POST",
				url: "/test/submitApplication",
				data: nbData,
				dataType: "json",
				success: function(data) {
					console.log(data);
					if(data['code'] == "0000") {
						//1.提示申请成功，返回申请列表页
						layer.msg("申请成功");
						$(location).attr('href', '/sqxttestwx/sq/myApply');
					} else {
						console.log(data['msg'])
						//提示错误信息
						layer.msg(data['msg']);
					}
				}
			});

		});
		$(".titleClass").on('click', function() {
			if($("#provence").text() == "请选择省") {
				layer.msg('请先选择正确行政区')
			}

		})

		//单击 授权许可数的图标
		$('.tips').on('click', function() {
			layer.open({
				title: '提示',
				content: '允许同时连接的最大客户端数量'
			});
		});

	});
});