/*
 * inputId:input-file ID[required]
 * imgId：img ID[required]
 * imgIeId：ie img ID[required]
 * scale:img width:height
 * width：ie width
 * height：ie height
 * size:fileSize for MB
 */
function imgUpload(data, callback) {
	var inputObj = document.getElementById(data.inputId);
	var imgObj = document.getElementById(data.imgId);
	if(inputObj.files && inputObj.files[0]) {
		var fr = new FileReader();
		fr.onload = function() {
			image.src = fr.result;
		};
		var file = inputObj.files[0];
		fr.readAsDataURL(inputObj.files[0]);
		var image = new Image();
		image.onload = function() {
			if(typeof data.scale != 'undefined' && data.scale != '') {
				var scaleW = data.scale.split(':')[0];
				var scaleH = data.scale.split(':')[1];
				if(image.width / scaleW != image.height / scaleH) {
					inputObj.value = imgObj.src = '';
					callback('请按图片比例上传（' + data.scale + '）！');
					return;
				}
			} else {
				var tips = '';
				var valid = true;
				if(typeof data.width != 'undefined' && data.width != '' && image.width != data.width) {
					tips = '宽度：' + data.width + 'px，';
					valid = false;
				}
				if(typeof data.height != 'undefined' && data.height != '' && image.height != data.height) {
					tips += '高度：' + data.height + 'px，';
					valid = false;
				}
				if(!valid) {
					inputObj.value = imgObj.src = '';
					callback('请按图片尺寸上传(' + tips.substr(0, tips.length - 1) + ')');
					return;
				}
			}
			if(typeof data.size != 'undefined' && data.size != '' && inputObj.files[0].size / 1024 / 1024 > data.size) {
				var sizeLimit = data.size + 'M';
				if(data.size < 1) {
					sizeLimit = (data.size * 1024).toFixed(0) + 'KB';
				}
				inputObj.value = imgObj.src = '';
				callback('请上传小于 ' + sizeLimit + ' 的图片');
				return;
			}
			imgObj.src = window.URL.createObjectURL(inputObj.files[0]);
		};

	} else {
		//IE下，使用滤镜处理，给定宽高
		inputObj.select();
		var imgSrc = document.selection.createRange().text;
		var localImagId = document.getElementById(data.imgIeId);
		//设置初始大小
		var ieWidth = ieHeight = 100;
		if(typeof data.width != 'undefined' && !isNaN(data.width)) ieWidth = data.width;
		if(typeof data.height != 'undefined' && !isNaN(data.height)) ieHeight = data.height;
		localImagId.style.width = ieWidth + "px";
		localImagId.style.height = ieHeight + "px";
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
/*<div id="imgview-ie"><img id="imgview" height="100" width="100"></div>
<label for="uptxt">上传图片</label>
<input type="file" id="uptxt" accept="image/jpeg,image/png,image/gif,image/bmp" />

<script type="text/javascript">
	uptxt.onchange = function() {
		imgUpload({
			inputId: 'uptxt',
			imgId: 'imgview',
			imgIeId: 'imgview-ie',
			//scale: '1:1',
			//width:200,
			//height: 888
			size: 0.2
		}, function(msg) {
			if(msg != '') alert(msg);
		});
	};
</script>*/