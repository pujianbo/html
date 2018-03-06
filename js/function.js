//public function

/*
 * 事件添加及删除
 */
var eventUtil = {
	addHandler: function(element, type, handler) {
		if(element.addEventListener) {
			element.addEventListener(type, handler, false);
		} else if(element.attachEvent) {
			element.attachEvent('on' + type, handler);
		} else {
			element['on' + type] = handler;
		}
	},
	removeHandler: function(element, type, handler) {
		if(element.removeEventListener) {
			element.removeEventListener(type, handler, false);
		} else if(element.detachEvent) {
			element.detachEvent('on' + type, handler);
		} else {
			element['on' + type] = null;
		}
	}
}

/*
 * Tab切换
 * 选中的选项卡类名：selectedClass
 * 要切换的盒子类名：switchClass
 */
$.fn.switchTab = function(selectedClass, switchClass) {
	if($(this).length == 0) return;
	var thisTag = $(this);
	thisTag.on("click", function() {
		$(this).addClass(selectedClass).siblings().removeClass(selectedClass);
		if(typeof(switchClass) != "undefined" && switchClass != "") {
			$(switchClass).eq($(this).index()).fadeToggle(200).siblings().hide();
		}
	});
};

/*
 * 获取地址栏传递的参数
 * 地址关键字：keyName
 * 新的字符串：newStr
 */
function urlKey(keyName, newStr) {
	newStr = newStr ? newStr : location.href;
	var reg = new RegExp(keyName + "=([^&]*)(&|$)", "i");
	var keyValue = reg.test(newStr) ? reg.exec(newStr)[1] : "";
	return keyValue;
}

/*
 * 验证字符串
 * 验证类型：validType
 * 验证字符串：validStr
 */
function validStr(validType, validStr) {
	var valiStr = ""; //验证手机的正则表达式
	switch(validType) {
		case "phone":
			valiStr = /^1[3|4|5|7|8]\d{9}$/;
			break;
		case "email":
			valiStr = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
			break;
		case "password":
			valiStr = /^(?![a-z]+$)(?!\d+$)[a-z0-9]{6,20}$/i;
			break;
		case "money":
			valiStr = /^((^0\.\d{0,2}$)|(^[1-9]+\d*\.\d{0,2}$)|(^[1-9]\d*$)|(^0$))?$/;
			break;
		case "number":
			validStr = /^\d*$/;
		case "postcode":
			validStr = /^\d{6}$/;
		default:
			break;
	}
	return valiStr.test(validStr);
}

/*
 * 发送验证码倒计时
 * 默认60秒，新时间：newTimes
 */
$.fn.vlidSend = function(newTimes) {
	var thisObj = $(this);
	var setTime = typeof newTimes == 'undefined' ? 60 : newTimes;

	function timeDown() {
		if(setTime == 0) {
			thisObj.val("发送").removeAttr("disabled");
			return;
		}
		thisObj.val(setTime + "S").attr("disabled", "disabled");
		setTime--;
		setTimeout(timeDown, 1000);
	}
	timeDown();
};

/*
 * 字符串剪切
 * 字符串：str
 * 长度：len
 */
function cutStr(str, len) {
	var icount = 0;
	if(str.length > len) {
		str = str.substr(0, len) + "...";
	}
	return str;
}

/*
 * 图片地址不存在，或地址错误时，显示默认图片
 * 默认图片地址：defaultImgUrl
 */
function imgUrlError(defaultImgUrl) {
	$("img").each(function() {
		if($(this).attr("src") == "") {
			$(this).attr("src", defaultImgUrl);
		} else {
			$(this).attr("onerror", "javascript:this.src='" + defaultImgUrl + "'");
		}
	});
}

/*
 * 图片进入可视区加载
 * 原来地址：lazysrc
 */
function lazyImg() {
	window.onload = function() {
		lazySrc();
	}

	window.onscroll = function() {
		lazySrc();
	}

	function lazySrc() {
		var seeHeight = document.documentElement.clientHeight;
		var scrollTop = document.body.scrollTop;
		var imgObj = document.querySelectorAll('img[lazysrc]');
		for(var i = 0; i < imgObj.length; i++) {
			if(imgObj[i].src == "") {
				if(imgObj[i].offsetTop < seeHeight + scrollTop) {
					imgObj[i].src = imgObj[i].getAttribute("lazysrc");
				}
			}
		}
	}
};

/*
 * 图片预览方法
 * inputId：文件上传input标签ID
 * imgId：显示的图片ID
 * width：图片宽度限制
 * height：图片高度限制
 * ieImgId：用于IE滤镜显示的ID
 * 如果没有尺寸要求：不传width、height
 */
function imgPreview(inputId, imgId, width, height, ieImgId) {
	var inputObj = document.getElementById(inputId);
	var imgObj = document.getElementById(imgId);
	if(inputObj.files && inputObj.files[0]) {
		var fr = new FileReader();
		fr.onload = function() {
			image.src = fr.result;
		};
		var file = inputObj.files[0];
		fr.readAsDataURL(inputObj.files[0]);
		var image = new Image();
		image.onload = function() {
			console.log(image.width, image.height);
			if(width != undefined)
				if(image.width != width || image.height != height) {
					alert('请按图片尺寸上传！');
					return;
				}
			imgObj.src = window.URL.createObjectURL(inputObj.files[0]);
		};

	} else {
		//IE下，使用滤镜处理，给定宽高
		inputObj.select();
		var imgSrc = document.selection.createRange().text;
		var localImagId = document.getElementById(ieImgId);
		//必须设置初始大小
		localImagId.style.width = "150px";
		localImagId.style.height = "150px";
		//图片异常的捕捉，防止用户修改后缀来伪造图片
		try {
			localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
			localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
		} catch(e) {
			alert("请选择正确的图片格式!");
			return false;
		}
		imgObj.style.display = 'none';
		document.selection.empty();
	}
}

/*
 * 三级联动
 * 1、数据格式要统一
 * 2、调用里面的类名一致
 * 3、默认值要核实是否有此数据
 */
$.fn.dataList = function(datajson) {
	//定义数据
	var data = datajson.data.first;
	var fstObj = $(this).find(".first");
	var sndObj = $(this).find(".second");
	var trdObj = $(this).find(".third");
	//读取默认值
	var fstValue = datajson.first;
	var sndValue = datajson.second;
	var trdValue = datajson.third;
	//绑定数据
	function selectValue(obj, data) {
		if(typeof(data) == "undefined") {
			if(obj.is(sndObj)) {
				sndObj.hide();
				trdObj.hide();
			}
			if(obj.is(trdObj)) trdObj.hide();
			return;
		}
		$(obj).empty();
		$(data).each(function() {
			$(obj).append("<option info='" + this.info + "'>" + this.value + "</option>").show();
		});
	}
	//第一个数据改变
	fstObj.change(function() {
		selectValue(sndObj, data[$(fstObj).get(0).selectedIndex].second);
		if(sndObj.is(":visible"))
			selectValue(trdObj, data[$(fstObj).get(0).selectedIndex].second[$(sndObj).get(0).selectedIndex].third);
	});
	//第二个数据改变
	sndObj.change(function() {
		selectValue(trdObj, data[$(fstObj).get(0).selectedIndex].second[$(sndObj).get(0).selectedIndex].third);
	});
	//数据初始化
	selectValue(fstObj, data);
	fstObj.val(fstValue);
	selectValue(sndObj, data[$(fstObj).get(0).selectedIndex].second);
	sndObj.val(sndValue);
	if(data[$(fstObj).get(0).selectedIndex].second)
		selectValue(trdObj, data[$(fstObj).get(0).selectedIndex].second[$(sndObj).get(0).selectedIndex].third);
	trdObj.val(trdValue);
};

/*
 * 键盘输入事件（包括回车，空格，开始，以及直接点击文字输入）
 * 绑定事件：func
 */
$.fn.keyInput = function(func) {
	var thisObj = $(this);
	var bindName = "input";
	if(navigator.userAgent.indexOf("MSIE") != -1) {
		bindName = "propertychange"; //判断是否为IE内核 IE内核的事件名称要改为propertychange
	}
	//输入框键盘离开事件绑定
	thisObj.bind(bindName, func);
};

/*
 * 模拟Select
 */
$.fn.selectList = function() {
	if($(this).length == 0) return;
	var thisTag = $(this);
	thisTag.on('click', function(event) {
		event.stopPropagation();
		$(this).find("ul").slideToggle(200);
	}).on('click', 'ul li', function() {
		var selectText = $(this).text();
		thisTag.find("span").text(selectText);
		thisTag.find("#data-val").val(selectText).attr("data-index", $(this).index());
		$(this).addClass("active").siblings().removeClass("active");
	});
	$(window).click(function() {
		thisTag.find("ul").hide();
	});

	//选中处理
	var activeText = thisTag.find("ul li:first").text();
	var activeIndex = 0;
	if(thisTag.find("li.active").length > 0) {
		activeText = thisTag.find("li.active").text();
		activeIndex = thisTag.find("li.active").index();
	}
	thisTag.find("#data-val").val(activeText).attr("data-index", activeIndex);
}

/*
 * 全选
 * 单选对象：sigleObj
 */
$.fn.allSelect = function(sigleObj) {
	var $allObj = $(this);
	$allObj.on('click', function() {
		if($(sigleObj).length != $(sigleObj + ':checked').length) {
			$(sigleObj).attr('checked', true);
		} else {
			$(sigleObj).attr('checked', false);
		}
	});
	$(sigleObj).on('click', function() {
		if($(sigleObj).length == $(sigleObj + ':checked').length) {
			$allObj.attr('checked', true);
		} else {
			$allObj.attr('checked', false);
		}
	})
};

/*
 * 转化为拖拽模块
 * 默认自己可以拖拽
 * 移动块this
 * 移动操作块obj
 */
$.fn.isDrag = function(dragBox) {
	var mousedown = false;
	var left, top;
	var tag = $(this);
	if(dragBox !== undefined) tag = $(dragBox);
	tag.css('cursor', 'move');
	$(this).mousedown(function(event) {
		mousedown = true;
		left = event.pageX - tag.offset().left;
		top = event.pageY - tag.offset().top;
		tag.css({
			"position": "fixed",
			"left": $(this).offset().left,
			"top": $(this).offset().top,
			"opacity": "0.6",
		})
	});
	$(document).mousemove(function(event) {
		if(mousedown) {
			tag.css({
				"left": event.pageX - left,
				"top": event.pageY - top
			})
		}
	}).mouseup(function(event) {
		mousedown = false;
		tag.fadeTo("600", 1);
	})
};

/*
 * 导航菜单到顶部Fixed
 * 左边
 */
$.fn.leftFixed = function() {
	if($(this).length == 0) return;
	var thisTag = $(this);
	var startTop = thisTag.offset().top;
	var startRirct = thisTag.css("left");
	$(window).bind('scroll resize', function() {
		if($(window).scrollTop() >= startTop) {
			thisTag.css({
				'position': 'fixed',
				'left': thisTag.offset().left < 10 ? 10 : thisTag.offset().left
			});
		} else {
			thisTag.css({
				'position': 'absolute',
				'left': startRirct
			});
		}
	});
};

/*
 * 公共的面板打开
 */
function openPanel(newObject) {
	$("body").css("overflow", "hidden");
	$("#mask").fadeIn(300);
	if(typeof newObject == "undefined") {
		$("#panel").show();
	} else {
		$(newObject).show();
	}

}

/*
 * 公共的面板关闭
 */
function closePanel() {
	$("body").css("overflow", "auto");
	$("#mask").fadeOut(300);
	if(typeof newObject == "undefined") {
		$("#panel").hide();
	} else {
		$(newObject).hide();
	}
}

/*
 * 多个参数求和
 */
function sum() {
	var sumvalue = 0;
	for(var i = 0; i < arguments.length; i++) {
		sumvalue += parseFloat(arguments[i]);
	}
	return sumvalue;
}

/*
 * 数字格式统一
 * 在长度不足的情况下前面为“0”
 * 字符串：numStr
 * 长度：numLength
 */
function numLenUnified(numStr, numLength) {
	var thisLength = numStr.toString().length;
	while(thisLength < numLength) {
		numStr = "0" + numStr;
		thisLength++;
	}
	return numStr;
}

/*
 * 金额处理
 * 每三位用逗号隔开，不支持小数
 */
function moneyFormat(str) {
	if(isNaN(str)) {
		return 'NaN';
	}
	var newStr = "";
	var strLength = str.length;
	for(var i = strLength; i > 2; i -= 3) {
		newStr = str.substring(i - 3, i) + "," + newStr;
	}
	newStr = str.substring(0, strLength % 3) + "," + newStr;
	return newStr.substr(0, newStr.length - 1);
}

/*
 * 倒计时函数
 * 显示对象：obj
 * 开始时间：startDate
 * 结束时间：endDate
 */
function countDown(obj, startDate, endDate) {
	//处理为时间格式
	function dateFormat(timeStr) {
		var splitStr = '-';
		if(timeStr.search("/") > -1) splitStr = '/';
		timeStr = timeStr.split(" ");
		var ymdStr = timeStr[0].split(splitStr);
		var hmsStr = timeStr[1].split(':');
		var dateStr = new Date(ymdStr[0], ymdStr[1], ymdStr[2], hmsStr[0], hmsStr[1], hmsStr[2]);
		return dateStr;
	}
	var intDiff = Math.floor((dateFormat(endDate) - dateFormat(startDate)) / 1000); //秒数
	alert(dateFormat(startDate));
	window.setInterval(function() {
		if(intDiff == 0) {
			window.location.reload();
		}
		var day = 0,
			hour = 0,
			minute = 0,
			second = 0; //时间默认值
		if(intDiff > 0) {
			day = Math.floor(intDiff / (24 * 60 * 60));
			hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
			minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
			second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
		}
		if(minute <= 9) minute = '0' + minute;
		if(second <= 9) second = '0' + second;
		intDiff--;
		var str = day + "天" + hour + "时" + minute + "分" + second + "秒";
		if(day == 0) {
			str = hour + "时" + minute + "分" + second + "秒";
			if(hour == 0) {
				str = minute + "分" + second + "秒";
				if(minute == "00") {
					str = second + "秒";
				}
			}
		}
		$(obj).text(str);
	}, 1000);
}

/*
 * 图片滚动显示banner
 */
function imgBanner(containerClass, imgbannerClass, positionClass, positionnowClass, prevCass, nextClass, moveSpeed, switchSpeed) {
	//类名依次是，最外层的div,图片列表，位置，当前位置，上一张按钮，下一张按钮，图片移动速度，切换每张图速度
	var li_count = $(imgbannerClass + " li").length;
	var i = 0;

	function banner() {
		if(i >= li_count) i = 0;
		$(imgbannerClass).animate({
			"left": $(imgbannerClass + " li").width() * (-i)
		}, moveSpeed);
		$(positionClass).eq(i).addClass(positionnowClass).siblings().removeClass(positionnowClass);
		i++;
	}
	var stopbanner = setInterval(banner, switchSpeed);

	$(containerClass).mouseover(function() {
		clearInterval(stopbanner);
	}).mouseout(function() {
		stopbanner = setInterval(banner, switchSpeed);
	});

	$(positionClass).mouseover(function() {
		i = $(this).index();
		moveSpeed = moveSpeed / 4;
		banner();
		moveSpeed = 4 * moveSpeed;
	});

	$(prevCass).click(function() {
		stopbanner = "";
		if(i > 1) {
			i = i - 2;
			moveSpeed = moveSpeed / 4;
			banner();
			moveSpeed = 4 * moveSpeed;
		}
	});

	$(nextClass).click(function() {
		stopbanner = "";
		moveSpeed = moveSpeed / 4;
		banner();
		moveSpeed = 4 * moveSpeed;
	});
}

/*
 * 相册列表
 */
$.fn.previewPic = function() {
	if($(this).length == 0) return;
	var thisObj = $(this);
	var viewNum = 5; //显示图片数量
	var moveNum = 1; //每次移动数量
	var moveTime = 300; //移动速度（毫秒）
	var tempWidth = 0; //当前移动的宽度
	var moveObj = thisObj.find('.items');
	var thisLeft = 0;
	var itemWidth = moveObj.find('li:first').outerWidth(); //块的宽度
	var moveWidth = moveObj.find('li:first').outerWidth() * moveNum; //计算每次移动的长度
	var countWidth = (moveObj.find('li').length - viewNum) * moveWidth; //总宽度

	thisObj.on('click', '.items li', function() {
		$(this).addClass('active').siblings().removeClass('active');
		thisObj.find('.img img').attr('src', $(this).find('img').attr('data-img'));
	}).on('click', '.next', function() {
		if(countWidth + thisLeft < moveWidth) return;
		thisLeft -= moveWidth;
		moveObj.animate({
			left: thisLeft
		}, moveTime);
		var activePosition = moveObj.find('.active').position().left;
		if(-thisLeft > activePosition) moveObj.find('li').eq(-thisLeft / itemWidth).click();
	}).on('click', '.prev', function() {
		if(thisLeft == 0) return;
		thisLeft += moveWidth;
		moveObj.animate({
			left: thisLeft
		}, moveTime);
		var activePosition = moveObj.find('.active').position().left;
		if((activePosition + thisLeft) / moveWidth == viewNum) {
			moveObj.find('li').eq(-thisLeft / moveWidth + viewNum - 1).click();
		}
	});
};

/*
 * 数据加密
 */
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
	58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6,
	7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
	25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
	37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64encode(str) {
	var out, i, len;
	var c1, c2, c3;
	len = str.length;
	i = 0;
	out = "";

	while(i < len) {
		c1 = str.charCodeAt(i++) & 0xff;

		if(i == len) {
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt((c1 & 0x3) << 4);
			out += "==";
			break
		}

		c2 = str.charCodeAt(i++);

		if(i == len) {
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
			out += base64EncodeChars.charAt((c2 & 0xF) << 2);
			out += "=";
			break
		}

		c3 = str.charCodeAt(i++);
		out += base64EncodeChars.charAt(c1 >> 2);
		out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
		out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
		out += base64EncodeChars.charAt(c3 & 0x3F)
	}

	return out
}

function base64decode(str) {
	var c1, c2, c3, c4;
	var i, len, out;
	len = str.length;
	i = 0;
	out = "";

	while(i < len) {
		do {
			c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
		} while (i < len && c1 == -1);

		if(c1 == -1)
			break;

		do {
			c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
		} while (i < len && c2 == -1);

		if(c2 == -1)
			break;

		out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

		do {
			c3 = str.charCodeAt(i++) & 0xff;

			if(c3 == 61)
				return out;

			c3 = base64DecodeChars[c3]
		} while (i < len && c3 == -1);

		if(c3 == -1)
			break;

		out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

		do {
			c4 = str.charCodeAt(i++) & 0xff;

			if(c4 == 61)
				return out;

			c4 = base64DecodeChars[c4]
		} while (i < len && c4 == -1);

		if(c4 == -1)
			break;

		out += String.fromCharCode(((c3 & 0x03) << 6) | c4)
	}

	return out
}

/*
 * 浏览器判断
 */
function thisBrowser(phoneName) {
	var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
	var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera
	var isMaxthon = userAgent.indexOf("Maxthon") > -1; //判断是否傲游3.0
	var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE
	var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox
	var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") < 1; //判断是否Safari
	var isChrome = userAgent.indexOf("Chrome") > -1; //判断是否Chrome

	if(isIE) {
		var IE5 = IE55 = IE6 = IE7 = IE8 = false;
		var reIE = new RegExp("MSIE (+);");
		reIE.test(userAgent);
		var fIEVersion = parseFloat(RegExp["$1"]);

		IE55 = fIEVersion == 5.5;
		IE6 = fIEVersion == 6.0;
		IE7 = fIEVersion == 7.0;
		IE8 = fIEVersion == 8.0;

		if(IE55) {
			return "IE55";
		}
		if(IE6) {
			return "IE6";
		}
		if(IE7) {
			return "IE7";
		}
		if(IE8) {
			return "IE8";
		}
	}

	if(isFF) {
		return "FF";
	}
	if(isOpera) {
		return "Opera";
	}
	if(isMaxthon) {
		return "Maxthon";
	}
	if(isSafari) {
		return "Safari";
	}
	if(isChrome) {
		return "Chrome";
	}

}

/*
 * 加载更多
 */
var page = 1;
var toBottom = 200;
$(window).scroll(function() {
	var totalHeight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
	if(($(document).height() - totalHeight) <= toBottom) {
		//处理下一页数据
		page++;
	}

});

/*
 * 数组去重
 */
function arrayRepeat(oldArr) {
	var newArr = [];
	for(var i = 0, len = oldArr.length; i < len; i++) {
		if(newArr.indexOf(oldArr[i]) < 0)
			newArr.push(oldArr[i]);
	}
	return newArr;
}

/*
 * 判断字符串的字节长度
 */
function getByte(str) {
	str = str.toString();
	var num = 0;
	for(var i = 0, l = str.length; i < l; i++) {
		num++;
		if(str.charCodeAt(i) > 255) num++;
	}
	return num;
}

/*
 * 数组处理（测试）
 */
function array() {
	var array1 = [1, 2, 3, 4, 5, 6, 7];
	var array2 = new Array('20', '22', '24');

	array1.length = 6; //修改数组长度,如果缩短表示后面的删除，变长则后面的为空
	array1.push(10, 11, 12); //数组后面增加元素
	array1.unshift(92, 77, 66); //数组增加元素
	//alert(array1);

	array1.pop(); //数组删除最后的一个元素
	array1.shift(); //数组删除开头的一个元素
	alert(array1);

	array1.splice(0, 4, '11', '12', '13', '14', '15'); //删除替换数组元素splice（开始位置，删除长度，增加值，增加值，增加值...）
	//alert(array1);

	array1 = array1.concat(array2); //数组链接array1在前，可以连接多个数组
	var newstr = array1.join(); //数组合并成字符串
	//alert("数组长度:"+array1.length+",字符串长度:"+newstr.length+", newstr="+newstr);

	newstr = newstr.split(','); //通过“，”拆分为数组
	//alert(newstr[0]);

	newstr = newstr.sort(function(a, b) {
		return a - b;
	}); //数组排序(方法是升序)
	//alert(newstr);
}