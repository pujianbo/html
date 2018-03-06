window.onload = function() {
	var obtn = document.getElementById('to-top');
	var cHeight = document.documentElement.clientHeight;
	var timer = null;
	var scrollTop;
	var isTop = true;
	window.onscroll = function() {
		scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		if(scrollTop >= cHeight) {
			obtn.style.display = 'block';
		} else {
			obtn.style.display = 'none';
		}
		if(!isTop) clearInterval(timer);
		isTop = false;
	};
	obtn.onclick = function() {
		clearInterval(timer);
		timer = setInterval(function() {
			var now = scrollTop;
			var speed = -now / 10;
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
			document.documentElement.scrollTop = document.body.scrollTop = scrollTop + speed;
			if(scrollTop == 0) clearInterval(timer);
			isTop = true;
		}, 30);
	}
}