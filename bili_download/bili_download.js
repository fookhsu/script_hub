// ==UserScript==
// @name              B站哔哩哔哩使用增强
// @name:zh           B站哔哩哔哩使用增强
// @name:zh-TW		  B站嗶哩嗶哩使用增強
// @namespace         bilibili_namespace_20230625
// @version           2.1.10
// @description       功能可选择性打开：1、B站使用增强：支持视频下载(👉支持多P批量快速下载👈)、浏览记录提示、一键三连、自动签到、描述文本网址转链接等；
// @description:zh    功能可选择性打开：1、B站使用增强：支持视频下载(👉支持多P批量快速下载👈)、浏览记录提示、一键三连、自动签到、描述文本网址转链接等；
// @description:zh-TW 功能可選擇性開啟：1、B站使用增強：支援視頻下載(👉支援多P批量快速下載👈)、瀏覽記錄提示、一鍵三連、自動簽到、描述文本網址轉連結等；
// @author            huahuacat
// @icon              data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACS0lEQVRYR8WXz2oTURTGv3MnpqhNKy1UWmxRTGdaiLSQRKkKIoK4FVrRPoHu7BMYn0B3+gQquuiuiC6kaFVsAhGEZkKqG/+Vrtp0YWsyR27KlEwz0xnnT3LgwjB37vl+97tzz9whdDiow/pwBCjofN0AJohwKQgkMxYF8Dmt0bxdnhaAQoWTXMczENJBhFvGMgqk4GY6SZXmPgvAmy/cnYijGqrwvmTVHSQup2jLvG0ByJf5EYDbUQIAeJxR6U4LQHGV1VodesTijfQxBdrkaSrL6z0Hlst8i4An7QBgYDar0lMrgM45ItxrCwDjflajnC+AtR8Gvn8zGpz9xwVOjor/Zma/ANt/GIsLNWxt8p7o4IiAmlLQP+C9pvkG+FoyUPxYs52xhFDPKIh3uRviG2ClWIdsTpHoJYymFNdliQzABBsaEZg4p+DwUftliRxAggwOC0xdidma1RaAI92Ea9OHOgcwPqlANruI1AElhsa2dBKXQJEBnDglGlvxWN/BNcE3gKyCS69b64AUlMISwEv4BpDJ3778i/Xfu5XQtFtaLq+9RiCA6gZj/dcuQN8Audod6kvodYZuz9k7UOK7JPDAbXAY/WxgLjtGDy2f408VPi8MLIUh4JbDELhwNknvLQDyQNoTh87AkFuCIP0E/NzcgWYeTC0bdrkNp6Lm9bc4YM4qr/NzEGaCzNJxLONFRqMbzf22JSu/wlcphhwzpsIAIcIHriGXGadX+/MdWDPflTjRxcH+kLYJhYtj5Piz4/0gF4YVNjk6DvAPDb0aMEr8/nEAAAAASUVORK5CYII=
// @include	   	      *://www.bilibili.com/**
// @include           *://search.bilibili.com/**
// @include           *://space.bilibili.com/**
// @include           *://www.bilibili.com/read/**
// @exclude           *://cloud.tencent.com/login*
// @exclude           *://console.cloud.tencent.com/*
// @exclude           *://market.cloud.tencent.com/*
// @exclude           *://www.aliyun.com/smarter-engine/*
// @exclude           *://account.aliyun.com/*
// @exclude           *://developer.aliyun.com/*
// @exclude           *://promotion.aliyun.com/*
// @exclude           *://free.aliyun.com/*
// @exclude           *://summit.aliyun.com/*
// @exclude           *://startup.aliyun.com/*
// @exclude           *://university.aliyun.com/*
// @exclude           *://careers.aliyun.com/*
// @exclude           *://market.aliyun.com/*
// @exclude           *://yunqi.aliyun.com/*
// @exclude           *://help.aliyun.com/*
// @exclude           *://g.alicdn.com/*
// @exclude           *://passport.aliyun.com/*
// @exclude           *://*.console.aliyun.com/*
// @exclude           *://auth.huaweicloud.com/*
// @exclude           *://support.huaweicloud.com/*
// @exclude           *://console.huaweicloud.com/*
// @exclude           *://accounts.youtube.com/*
// @exclude           *://www.youtube.com/live_chat_replay*
// @exclude           *://www.youtube.com/persist_identity*
// @require           https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require           https://greasyfork.org/scripts/454236-findandreplacedomtext-huahuacat/code/findAndReplaceDOMText-huahuacat.js?version=1112990
// @connect           bilibili.com
// @connect           tikdownloader.io
// @connect           staticj.top
// @grant             unsafeWindow
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_getValue
// @grant             GM.getValue
// @grant             GM_setValue
// @grant             GM.setValue
// @grant             GM_download
// @grant             GM_xmlhttpRequest
// @grant             GM.xmlHttpRequest
// @grant             GM_addStyle
// @grant             GM_registerMenuCommand
// @license           AGPL License
// @charset		      UTF-8
// @run-at            document-idle
// @downloadURL https://update.greasyfork.org/scripts/469407/B%E7%AB%99%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%BD%BF%E7%94%A8%E5%A2%9E%E5%BC%BA%EF%BC%8C%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E7%9F%A5%E4%B9%8E%E4%BD%BF%E7%94%A8%E5%A2%9E%E5%BC%BA%EF%BC%8C%E7%9F%AD%E8%A7%86%E9%A2%91%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD%EF%BC%8C%E6%B2%B9%E7%AE%A1%E3%80%81Facebook%E7%AD%89%E5%9B%BD%E5%A4%96%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E4%B8%8B%E8%BD%BD%E7%AD%89%F0%9F%98%88.user.js
// @updateURL https://update.greasyfork.org/scripts/469407/B%E7%AB%99%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%BD%BF%E7%94%A8%E5%A2%9E%E5%BC%BA%EF%BC%8C%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E7%9F%A5%E4%B9%8E%E4%BD%BF%E7%94%A8%E5%A2%9E%E5%BC%BA%EF%BC%8C%E7%9F%AD%E8%A7%86%E9%A2%91%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD%EF%BC%8C%E6%B2%B9%E7%AE%A1%E3%80%81Facebook%E7%AD%89%E5%9B%BD%E5%A4%96%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E4%B8%8B%E8%BD%BD%E7%AD%89%F0%9F%98%88.meta.js
// ==/UserScript==
(function () {
	'use strict';
	/**
 * 脚本遵循AGPL License开源协议；在协议允许的范围类，可以自由修改
 * 开完万岁！！
 */
	//共有方法，全局共享
function CommonFunction(){
	this.GMgetValue = function (name, value=null) {
		let storageValue = value;
		if (typeof GM_getValue === "function") {
			storageValue = GM_getValue(name, value);
		} else if(typeof GM.setValue === "function"){
			storageValue = GM.getValue(name, value);
		}else{
			var arr = window.localStorage.getItem(name);
			if(arr != null){
				storageValue = arr
			}
		}
		return storageValue;
	};
	this.GMsetValue = function(name, value){
		if (typeof GM_setValue === "function") {
			GM_setValue(name, value);
		} else if(typeof GM.setValue === "function"){
			GM.setValue(name, value);
		}else{
			window.localStorage.setItem(name, value)
		}
	};
	this.GMaddStyle = function(css){
		var myStyle = document.createElement('style');
		myStyle.textContent = css;
		var doc = document.head || document.documentElement;
		doc.appendChild(myStyle);
	};
	this.GMopenInTab = function(url, options={"active":true, "insert":true, "setParent":true}){
		if (typeof GM_openInTab === "function") {
			GM_openInTab(url, options);
		} else {
			GM.openInTab(url, options);
		}
	};
	this.addScript = function(url){
		var s = document.createElement('script');
		s.setAttribute('src',url);
		document.body.appendChild(s);
	};
	this.randomNumber = function(){
		return Math.ceil(Math.random()*100000000);
	};
	this.request=function(method, url, param, headers={"Content-Type": "application/json;charset=UTF-8"}){
		return new Promise(function(resolve, reject){
			GM_xmlhttpRequest({
				url: url,
				method: method,
				data:param,
				headers:headers,
				onload: function(response) {
					var status = response.status;
					var playurl = "";
					if(status==200||status=='200'){
						var responseText = response.responseText;
						resolve({"result":"success", "data":responseText});
					}else{
						reject({"result":"error", "data":null});
					}
				}
			});
		})
	};
	this.crossRequest=function(method, url, param){
		if(!method){
			method = "get";
		}
		if(!url){
			return new Promise(function(resolve, reject){
				reject({"result":"error", "data":null});
			});
		}
		if(!param){
			param = {};
		}
		method = method.toUpperCase();
	    let config = {
	        method: method
	    };
	    if (method === 'POST') {
	        config.headers['Content-Type'] = 'application/json';
	        config.body = JSON.stringify(param);
	    }
		return new Promise(function(resolve, reject){
			fetch(url, config).then(response => response.text()).then(text => {
				resolve({"result":"success", "data":text});
			}).catch(error => {
				reject({"result":"error", "data":null});
			});
		});
	};
	this.addCommonHtmlCss = function(){
		var cssText =
			`
			@keyframes fadeIn {
				0%    {opacity: 0}
				100%  {opacity: 1}
			}
			@-webkit-keyframes fadeIn {
				0%    {opacity: 0}
				100%  {opacity: 1}
			}
			@-moz-keyframes fadeIn {
				0%    {opacity: 0}
				100%  {opacity: 1}
			}
			@-o-keyframes fadeIn {
				0%    {opacity: 0}
				100%  {opacity: 1}
			}
			@-ms-keyframes fadeIn {
				0%    {opacity: 0}
				100%  {opacity: 1}
			}
			@keyframes fadeOut {
				0%    {opacity: 1}
				100%  {opacity: 0}
			}
			@-webkit-keyframes fadeOut {
				0%    {opacity: 1}
				100%  {opacity: 0}
			}
			@-moz-keyframes fadeOut {
				0%    {opacity: 1}
				100%  {opacity: 0}
			}
			@-o-keyframes fadeOut {
				0%    {opacity: 1}
				100%  {opacity: 0}
			}
			@-ms-keyframes fadeOut {
				0%    {opacity: 1}
				100%  {opacity: 0}
			}
			.web-toast-kkli9{
				position: fixed;
				background: rgba(0, 0, 0, 0.7);
				color: #fff;
				font-size: 14px;
				line-height: 1;
				padding:10px;
				border-radius: 3px;
				left: 50%;
				transform: translateX(-50%);
				-webkit-transform: translateX(-50%);
				-moz-transform: translateX(-50%);
				-o-transform: translateX(-50%);
				-ms-transform: translateX(-50%);
				z-index: 999999999999999999999999999;
				white-space: nowrap;
			}
			.fadeOut{
				animation: fadeOut .5s;
			}
			.fadeIn{
				animation:fadeIn .5s;
			}
			`;
		this.GMaddStyle(cssText);
	};
	this.webToast = function(params) {	//小提示框
		var time = params.time;
		var background = params.background;
		var color = params.color;
		var position = params.position;  //center-top, center-bottom
		var defaultMarginValue = 50;

		if(time == undefined || time == ''){
			time = 1500;
		}

		var el = document.createElement("div");
		el.setAttribute("class", "web-toast-kkli9");
		el.innerHTML = params.message;
		//背景颜色
		if(background!=undefined && background!=''){
			el.style.backgroundColor=background;
		}
		//字体颜色
		if(color!=undefined && color!=''){
			el.style.color=color;
		}

		//显示位置
		if(position==undefined || position==''){
			position = "center-bottom";
		}

		//设置显示位置，当前有种两种形式
		if(position==="center-bottom"){
			el.style.bottom = defaultMarginValue+"px";
		}else{
			el.style.top = defaultMarginValue+"px";
		}
		el.style.zIndex=999999;

		document.body.appendChild(el);
		el.classList.add("fadeIn");
		setTimeout(function () {
			el.classList.remove("fadeIn");
			el.classList.add("fadeOut");
			/*监听动画结束，移除提示信息元素*/
			el.addEventListener("animationend", function () {
				document.body.removeChild(el);
			});
			el.addEventListener("webkitAnimationEnd", function () {
				document.body.removeChild(el);
			});
		}, time);
	};
	this.filterStr = function(str){
		if(!str) return "";
		str = str.replace(/\t/g,"");
		str = str.replace(/\r/g,"");
		return encodeURIComponent(str)
	};
	this.getParamterQueryUrl = function(text, tag) { //查询GET请求url中的参数
		if(text.indexOf("?")!=-1){ //选取?后面的字符串,兼容window.location.search，前面的?不能去掉
			var textArray = text.split("?");
			text = "?"+textArray[textArray.length-1];
		}
		var t = new RegExp("(^|&)" + tag + "=([^&]*)(&|$)");
		var a = text.substr(1).match(t);
		if (a != null){
			return a[2];
		}
		return "";
	};
	this.getEndHtmlIdByUrl = function(url) { //获得以html结束的ID
		if(url.indexOf("?")!=-1){
			url = url.split("?")[0]
		}
		if(url.indexOf("#")!=-1){
			url = url.split("#")[0]
		}
		var splitText = url.split("/");
		var idText = splitText[splitText.length-1];
		idText = idText.replace(".html","");
		return idText;
	};
	this.isPC = function(){
		var userAgentInfo = navigator.userAgent;
		var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone", "iPad", "iPod"];
		var flag = true;
		for (var v = 0; v < Agents.length; v++) {
			if (userAgentInfo.indexOf(Agents[v]) > 0) {
				flag = false;
				break;
			}
		}
		return flag;
	};
	this.getBilibiliBV=function(){
		var pathname = window.location.pathname;
		var bv = pathname.replace("/video/","").replace("/","");
		return bv;
	};
	this.getSystemOS=function(){
		var u = navigator.userAgent;
		if (!!u.match(/compatible/i) || u.match(/Windows/i)) {
			return 'windows';
		} else if (!!u.match(/Macintosh/i) || u.match(/MacIntel/i)) {
			return 'macOS';
		} else if (!!u.match(/iphone/i) || u.match(/Ipad/i)) {
			return 'ios';
		} else if (!!u.match(/android/i)) {
			return 'android';
		} else {
			return 'other';
		}
	};
	this.RPCDownloadFile = function(fileName, url, savePath="D:/", RPCURL="ws://localhost:16800/jsonrpc", RPCToken="") {
		const self = this;
		if(!savePath){
			savePath = "D:/";
		}
		if(!RPCURL){
			RPCURL = "ws://localhost:16800/jsonrpc";
		}
		let options = { //下载配置文件
			"dir":savePath,
			"max-connection-per-server": "16",
			"header":["User-Agent:"+navigator.userAgent+"", "Cookie:"+document.cookie+"", "Referer:"+window.location.href+""]
		}
		if(!!fileName) {
			options.out = fileName;
		}
		let jsonRPC = {
			"jsonrpc": "2.0",
			"id": "huahuacat",
			"method": "aria2.addUri",
			"params": [[url], options],
		}
		if (!!RPCToken) {
			jsonRPC.params.unshift("token:" + RPCToken); // 必须要加在第一个
		}
		return new Promise(function(resolve, reject) {
			var webSocket = new WebSocket(RPCURL);
			webSocket.onerror = function(event) {
				console.log("webSocket.onerror", event);
				reject("Aria2连接错误，请打开Aria2和检查RPC设置！");
			}
			webSocket.onopen = function(){
				webSocket.send(JSON.stringify(jsonRPC));
			}
			webSocket.onmessage = function(event){
				let result = JSON.parse(event.data);
				switch (result.method) {
					case "aria2.onDownloadStart":
						resolve("Aria2 开始下载【"+fileName+"】");
						webSocket.close();
						break;
					case "aria2.onDownloadComplete":
						break;
					default:
						break;
				}
			}
		});
	};
	this.getElementObject = function(selector, target=document.body, allowEmpty = true, delay=10, maxDelay=10 * 1000){
		return new Promise((resolve,reject) =>{
			if (selector.toUpperCase() === "BODY") {
				resolve(document.body);
				return;
			}
			if (selector.toUpperCase() === "HTML") {
				resolve(document.html);
				return;
			}
			let totalDelay = 0;

			let element = target.querySelector(selector);
			let result = allowEmpty ? !!element : (!!element && !!element.innerHTML);
			if(result){
				resolve(element);
			}

			const elementInterval = setInterval(()=>{
				if(totalDelay >= maxDelay){
					clearInterval(elementInterval);
					resolve(null);
				}
				element = target.querySelector(selector);
				result = allowEmpty ? !!element : (!!element && !!element.innerHTML);
				if(result){
					clearInterval(elementInterval);
					resolve(element);
				}else{
					totalDelay += delay;
				}
			}, delay);
		});
	};
	/**
	 * @param {Object} time
	 * @param {Object} format
	 * 时间格式化
	 * DateFormat(new Date(dateCreated), "yyyy-MM-dd hh:mm:ss")
	 */
	this.DateFormat = function(time, format) {
		var o = {
			"M+": time.getMonth() + 1, //月份
			"d+": time.getDate(), //日
			"h+": time.getHours(), //小时
			"m+": time.getMinutes(), //分
			"s+": time.getSeconds(), //秒
			"q+": Math.floor((time.getMonth() + 3) / 3), //季度
			"S": time.getMilliseconds() //毫秒
		};
		if(/(y+)/.test(format)){
			format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for(var k in o){
			if(new RegExp("(" + k + ")").test(format)){
				format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return format;
	};
	this.decryptStr=function(str){
		let result = atob(str);
		return result.split('').reverse().join('');
	};
	this.encryptStr=function(str){
		let result = str.split('').reverse().join('');
		return btoa(result);
	};
}
//全局弹窗对象
const dialog = (function(){
	class Dialog {
		constructor() {
			this.mask = document.createElement('div');
			this.dialogStyle = document.createElement('style');

			this.setStyle(this.mask, {
				"width": '100%',
				"height": '100%',
				"backgroundColor": 'rgba(0, 0, 0, .6)',
				"position": 'fixed',
				"left": "0px",
				"top": "0px",
				"bottom":"0px",
				"right":"0px",
				"z-index":"9999999999999"
			});

			this.content = document.createElement('div');
			this.setStyle(this.content, {
				"max-width": '450px',
				"width":"100%",
				"max-height": '600px',
				"backgroundColor": '#fff',
				"boxShadow": '0 0 2px #999',
				"position": 'absolute',
				"left": '50%',
				"top": '50%',
				"transform": 'translate(-50%,-50%)',
				"borderRadius": '5px'
			})
			this.mask.appendChild(this.content);
		}
		middleBox(param) {
			// 先清空中间小div的内容 - 防止调用多次，出现混乱
			this.content.innerHTML = '';

			let title = '默认标题内容';
			if({}.toString.call(param) === '[object String]') {
				title = param;
			} else if({}.toString.call(param) === '[object Object]') {
				title = param.title;
			}

			document.body.appendChild(this.mask);
			this.title = document.createElement('div');
			this.setStyle(this.title, {
				"width": '100%',
				"height": '40px',
				"lineHeight": '40px',
				"boxSizing": 'border-box',
				"background-color":"#dedede",
				"color": '#000',
				"text-align": 'center',
				"font-weight":"700",
				"font-size":"17px",
				"border-radius": "4px 4px 0px 0px"
			});

			this.title.innerText = title;
			this.content.appendChild(this.title);

			this.closeBtn = document.createElement('div');
			this.closeBtn.innerText = '×';

			this.setStyle(this.closeBtn, {
				"textDecoration": 'none',
				"color": '#000',
				"position": 'absolute',
				"right": '10px',
				"top": '0px',
				"fontSize": '25px',
				"display":"inline-block",
				"cursor":"pointer"
			})
			this.title.appendChild(this.closeBtn);

			const self = this;
			this.closeBtn.onclick = function(){
				self.close();
				if(param.onClose && (typeof param.onClose)==="function"){
					param.onClose();
				}
			}
		}
		showMake(param) {
			//添加公用样式表
			if(param.hasOwnProperty("styleSheet")){
				this.dialogStyle.textContent = param.styleSheet;
			}
			document.querySelector("head").appendChild(this.dialogStyle);

			this.middleBox(param);
			this.dialogContent = document.createElement('div');
			this.setStyle(this.dialogContent,{
				"padding":"15px",
				"max-height":"400px"
			});
			this.dialogContent.innerHTML = param.content;
			this.content.appendChild(this.dialogContent);
			param.onContentReady(this);
		}
		close() {
			document.body.removeChild(this.mask);
			document.querySelector("head").removeChild(this.dialogStyle);
		}
		setStyle(ele, styleObj) {
			for(let attr in styleObj){
				ele.style[attr] = styleObj[attr];
			}
		}
	}
	let dialog = null;
	return (function() {
		if(!dialog) {
			dialog = new Dialog()
		}
		return dialog;
	})()
})();

//全局统一方法对象
const commonFunctionObject = new CommonFunction();
commonFunctionObject.addCommonHtmlCss();	//统一html、css元素添加
let functionController = null;
	//相关功能关闭控制
functionController = commonFunctionObject.GMgetValue("setingData");
if(!functionController){
	functionController={
		"bilibiliHelper":true
	}
}
//用户功能设置函数
function usersSeting(){
	var bilibiliHelper=true;
	var isUpdateStorage = false;
	if(!functionController.hasOwnProperty("bilibiliHelper")){
		functionController.bilibiliHelper = true;
		isUpdateStorage = true;
	}else{
		bilibiliHelper = functionController.bilibiliHelper;
	}
	if(isUpdateStorage){
		commonFunctionObject.GMsetValue("setingData",functionController);
	}
	var setingData=[
		{"tag":"bilibiliHelper", "name":"B站使用加强(视频下载支持批量、浏览记录、一键三连)", "checked":bilibiliHelper}
	]
	var content = "";
	for(var i=0; i<setingData.length;i++){
		var one = setingData[i];
		content += `
			<div style="padding: 5px 0px;">
				<input style="display:inline-block;width: 15px;height: 15px;display: inline-block;vertical-align: middle; -webkit-appearance:checkbox;margin-bottom: 3px;cursor: pointer;" name="Checkbox" type="checkbox" data-tag="`+one.tag+`" `+(one.checked ? "checked" : "")+`>
				<label style="display:inline-block;font-size: 14px;margin:3px 0;vertical-align: middle;font-weight:500;color:#000;">`+one.name+`</label>
			</div>
		`
	}
	dialog.showMake({
		"title":"功能开关",
		"content":content,
		"onClose":function(){
			location.reload();
		},
		"onContentReady":function($that){
			$that.dialogContent.querySelectorAll("input[type='checkbox']").forEach(function(checkbox){
				checkbox.addEventListener("click", function(e){
					var tag = e.target.getAttribute("data-tag");
					var checked = e.target.checked;
					functionController[tag] = checked;
					commonFunctionObject.GMsetValue("setingData",functionController);
					commonFunctionObject.webToast({"message":"操作成功", "background":"#FF4D40"});
				});
			})
		}
	});
}

// 菜单按钮弹框
if(commonFunctionObject.isPC()){
	GM_registerMenuCommand("功能开关",()=>usersSeting());
}else{
	functionController.bilibiliHelper = false;
}

/**
 * B站相关功能：视频多P下载，一键三联，浏览记录等
 */
function BilibiliHelper(){

	this.isRun = function(){
		return window.location.host.indexOf("bilibili.com") != -1
	}
	this.baseFunction = function(){
		/**
		 * b站基本功能，一件三连、视频解析、视频下载
		 */
		function baseFunctionObject(){
			this.elementId = Math.ceil(Math.random()*100000000)+"mmx";
			this.downloadSettingKey = "download_setting_key";
			this.downloadResutError=function(btnElement){
				btnElement.text("下载视频");
				btnElement.removeAttr("disabled");
			};
			this.downloadResutSuccess=function(btnElement){
				btnElement.text("下载视频");
				btnElement.removeAttr("disabled");
			};
			this.getDownloadPages = function(){
				return new Promise(function(resolve, reject) {
					var pathname = window.location.pathname, bv = null;
					if (pathname.indexOf("/medialist/play/watchlater/") != -1) { // 在下载视频的时候针对稍后再看页面的链接找BV号
						bv = pathname.replace("/medialist/play/watchlater/","").replace("/","");
					}else{
						bv = pathname.replace("/video/","").replace("/","");
					}
					if(!bv){
						resolve({"status":"bv_null"});
						return;
					}
					//bv转av
					commonFunctionObject.request("get", "https://api.bilibili.com/x/web-interface/view?bvid="+bv, null).then((resultData)=>{
						let dataJson = JSON.parse(resultData.data);
						if(!dataJson || dataJson.code!==0 || !dataJson.data){
							resolve({"status":"request_error"});
							return;
						}

						let data = dataJson.data;
						if(!data){
							resolve({"status":"aid_null"});
							return;
						}

						let aid = data.aid;
						let pic = data.pic;
						let title = data.title
						if(!aid){
							resolve({"status":"aid_null"});
							return;
						}

						//获取cid
						commonFunctionObject.request("get", "https://api.bilibili.com/x/web-interface/view?aid="+aid, null).then((resultData2)=>{
							let dataJson2 = JSON.parse(resultData2.data);
							if(!dataJson2 || dataJson2.code!==0 || !dataJson2.data){
								resolve({"status":"request_error"});
								return;
							}
							const downloadData = dataJson2.data;
							const {aid,  bvid} = downloadData,
								items = new Array();
							//这是下载集合
							if(downloadData.hasOwnProperty("ugc_season") && downloadData.ugc_season.hasOwnProperty("sections")){
								let sections = downloadData.ugc_season.sections;
								for(var i=0; i<sections.length; i++){
									let section = sections[i];
									if(section.hasOwnProperty("episodes")){
										for(var j=0; j<section.episodes.length; j++){
											let episode = section.episodes[j];
                                            //console.log("episode:", j);
                                            //console.dir(episode);
								            let page = 1;
                                            for(var k=0; k<episode.pages.length; k++){
                                                let page_info = episode.pages[k];
                                                items.push({
												    "cover":"",
												    "page":page,
												    "title":page_info.part,
												    "cid":page_info.cid,
												    "aid":episode.aid
											    });
											    page++;
                                            }

										}
									}
								}
							}else{ //这是多P下载
								for(var i=0; i<downloadData.pages.length; i++){
									let pageData = downloadData.pages[i];
									items.push({
										"cover":pageData.first_frame,
										"page":pageData.page,
										"title":pageData.part,
										"cid":pageData.cid,
										"aid":aid
									});
								}
							}

							resolve({"status":"success", "downloadData":{
								"items":items,
								"pic":pic,
								"title":title
							}});
						}).catch((errorData)=>{
							resolve({"status":"request_error"});
						});
					}).catch((errorData)=>{
						resolve({"status":"request_error"});
					});
				});
			};
			this.startDownloadFile = function(options){
				let aid = options.aid, cid = options.cid, fileName = options.fileName,
					savePath = options.savePath, RPCURL = options.RPCURL, RPCToken = options.RPCToken;
				let isByPRC = options.isByPRC;

				commonFunctionObject.request("get", "https://api.bilibili.com/x/player/playurl?avid="+aid+"&cid="+cid+"&qn=112", null).then((resultData3)=>{

					if(!fileName){
						fileName = (new Date()).getTime() + "";
					}
					fileName = fileName.replace(/[\ |\~|\`|\=|\||\\|\;|\:|\"|\'|\,|\.|\>|\/]/g,"");
					fileName = fileName.substring(0,50); //可能有异常，标题最多50字符
					fileName = fileName + ".mp4";

					let dataJson3 = JSON.parse(resultData3.data);
					if(!!dataJson3 && dataJson3.code===0 && !!dataJson3.data){
						let downloadUrl = dataJson3.data.durl[0].url;
						if(isByPRC){
							commonFunctionObject.RPCDownloadFile(fileName, downloadUrl, savePath, RPCURL).then((data)=>{
								commonFunctionObject.webToast({"message":data, "time":3000});
							}).catch((data)=>{
								commonFunctionObject.webToast({"message":data, "time":3000});
							});
						}else{
							window.open(downloadUrl);
						}
					}else{
						commonFunctionObject.webToast({"message":"获取下载链接失败", "background":"#FF4D40"});
					}
				}).catch((errorData)=>{
					commonFunctionObject.webToast({"message":"获取下载链接失败", "background":"#FF4D40"});
				});
			};
			this.createModals = function(){
				var css = `
					.modal-mask-`+this.elementId+`{
						position:fixed;
						top:0;
						left:0;
						z-index:999;
						width:100%;
						height:100%;
						display:none;
						background-color:#000;
						opacity:0.3;
						overflow:hidden;
					}
					.modal-body-`+this.elementId+`{
						position:fixed;
						border-radius:5px;
						background-color: #FFFFFF;
						top:10%;
						width:600px;
						max-width:90%;
						max-height:80%;
						z-index:1000;
						left: 50%;
						transform: translateX(-50%);
						display:none;
						padding: 10px;
						overflow-y: auto;
					}
					.modal-body-`+this.elementId+` >.page-header{
						height:30px;
						line-height:30px;
						position:relative;
					}
					.modal-body-`+this.elementId+` >.page-header >span{
						display:inline-block;
					}
					.modal-body-`+this.elementId+` >.page-header >span:nth-child(1) {
						font-size:18px;
						font-weight:bold;
						position:absolute;
						left:10px;
					}
					.modal-body-`+this.elementId+` >.page-header >span:nth-child(2) {
						font-size:28px;
						font-weight:bold;
						position:absolute;
						right:10px;
						cursor:pointer;
					}
					.modal-body-`+this.elementId+` >.page-container{
						max-height: 500px;
						overflow-y: auto;
					}
					.modal-body-`+this.elementId+` .page-wrap{
						display: flex;
						flex-wrap: wrap;
						margin-top:5px;
					}
					.modal-body-`+this.elementId+` .page-wrap >.board-item{
						display: block;
						width: calc(50% - 10px);
						background-color: #6A5F60;
						margin: 5px;
						background-color:#FB7299;
						color:#FFFFFF;
						cursor: pointer;
						overflow:hidden;
						white-space:nowrap;
						text-overflow:ellipsis;
					}
					.modal-body-`+this.elementId+` .page-wrap >.board-item >input{
						width: 14px;
						height: 14px;
						vertical-align: middle;
						margin-right:5px;
					}
					.modal-body-`+this.elementId+` .page-wrap >.board-item >span{
						vertical-align: middle;
					}
					.modal-body-`+this.elementId+` .modal-btn-wrap{
						text-align: center;
						margin-top: 10px;
						cursor: pointer;
					}
					.modal-body-`+this.elementId+` .aria2-setting{
						border:1px dashed #F1F1F1;
						border-radius:4px;
						margin-top:10px;
					}
					.modal-body-`+this.elementId+` .aria2-setting >.setting-item{
						text-align: center;
						font-size:14px;
						margin:10px 0px;
					}
					.modal-body-`+this.elementId+` .aria2-setting >.setting-item .topic-name{
						display:inline-block;
						width:80px;
						text-align:left;
					}
					.modal-body-`+this.elementId+` .aria2-setting >.setting-item> input{
						width:300px;
						padding-left:10px;
						border:1px solid #888;
						outline:none;
						border-radius:3px;
					}
					.modal-body-`+this.elementId+` .modal-btn-wrap >span{
						border:1px solid #ccc;
						display:inline-block;
						padding:3px 5px;
						margin:0px 5px;
						border-radius:3px;
					}
					.modal-body-`+this.elementId+` .tip-wrap{
						margin-top: 10px;
						font-size:12px;
					}
					.modal-body-`+this.elementId+` .tip-wrap >.title{
						font-size:16px;
						font-weight:bold;
					}
					.modal-body-`+this.elementId+` .tip-wrap >.content >ul >li{
						margin-top:5px;
					}
				`;

				var html = `
					<div class='modal-mask-`+this.elementId+`'></div>
					<div class='modal-body-`+this.elementId+`'>
						<div class="page-header">
							<span>视频下载(可批量)</span>
							<span class="close">×</span>
						</div>
						<div class="page-container">
							<label style="color:red;">注：此功能会调用bilibili的API，脚本仅用于个人交流，切勿用于商业用途，否则后果自负，特此申明！</label>
							<div class="page-wrap">
							</div>
							<div class="aria2-setting">
								<div class="setting-item">
									<span><input type="radio" name="downloadWay" value="Motrix">Motrix下载</span>&nbsp;&nbsp;&nbsp;
									<span><input type="radio" name="downloadWay" value="AriaNgGUI">AriaNgGUI下载</span>
								</div>
								<div class="setting-item">
									<label class="topic-name">配置RPC:</label><input type="text" name="RPCURL" value="" placeholder="请准确输入RPC对应软件的地址，默认：Motrix">
								</div>
								<div class="setting-item">
									<label class="topic-name">配置Token:</label><input type="text" name="RPCToken" value="" placeholder="默认无需填写">
								</div>
								<div class="setting-item">
									<label class="topic-name">保存路径:</label><input type="text" name="savePath" value="" placeholder="请准确输入文件保存路径">
									<div style="font-size:12px;color:#888;">最好自定义下载地址，默认地址可能不满足需要</div>
								</div>
							</div>
							<div class="modal-btn-wrap">
								<span name="selectall">全选</span>
								<span name="removeSelect">取消选择</span>
								<span name="downloadAll">批量下载</span>
							</div>
							<div class="tip-wrap">
								<div class="title">关于单P下载：</div>
								<div class="content"><span>点击弹框单个选集，即可下载单集视频！PS:单P下载，推荐大家使用BBDown下载，此工具功能很强大，具体查看：<a target="_blank" href="https://github.com/nilaoda/BBDown">https://github.com/nilaoda/BBDown</a></span></div>
							</div>
							<div class="tip-wrap">
								<div class="title">关于批量下载：</div>
								<div class="content">
									<ul>
										<li>
											<b>1、批量下载需要第三方软件的支持，脚本推荐使用：Motrix</b>
											<ul>
												<li>Motrix下载地址：<a href="https://motrix.app/zh-CN/" target="_blank">https://motrix.app/zh-CN/</a></li>
												<li>AriaNgGUI下载地址：<a href="https://github.com/Xmader/aria-ng-gui" target="_blank">https://github.com/Xmader/aria-ng-gui</a></li>
											</ul>
										</li>
										<li>
											<b>2、在批量下载前需要提前打开软件，本教程以Motrix为准</b>
											<ul>
												<li>(1)、如果全部按照默认配置，只需要打开软件即可</li>
												<li>(2)、如果想自定义RPC地址和文件保存路径，可更改上面输入框的内容（此数据非常重要，请准确填写）</li>
												<li>
												(3)、Motrix运行图片
												<img src="https://pic.rmb.bdstatic.com/bjh/8912582c0416119405ec37ea27d12376.jpeg" width="100%" />
												</li>
											</ui>
										</li>
										<li>
											<b>3、默认RPC默认地址</b>
											<ul>
												<li>(1)、Motrix RPC默认地址：ws://localhost:16800/jsonrpc</li>
												<li>(2)、Aria2 RPC默认地址：ws://localhost:6800/jsonrpc</li>
												<li>(3)点击“批量下载会自动保存当前下载设置”</li>
											</ul>
										</li>
										<li>
											<b>4、如使用AriaNgGUI，使用方式类似，大家可以自行研究</b>
										</li>
									</ul>
								</div>
							</div>
							<div class="tip-wrap">
								<div class="title">必要说明：</div>
								<div class="content">
									申明：本功能仅能作为学习交流使用，且不可用于其它用途，否则后果自负。请大家重视版权，尊重创作者，切勿搬运抄袭。请大家多用[一键三连]为创作者投币~，小破站牛掰！
								</div>
							</div>
						</div>
					</div>
				`;
				commonFunctionObject.GMaddStyle(css);
				$("body").append(html);
			};
			this.hideModals = function(){
				$(".modal-body-"+this.elementId+"").css('display','none');
				$(".modal-mask-"+this.elementId+"").css('display','none');
			};
			this.showModals = function(pageHtml){
				const self = this;
				const downloadSettingKey = self.downloadSettingKey;
				$(".modal-body-"+self.elementId+"").css('display','block');
				$(".modal-mask-"+self.elementId+"").css('display','block');
				$(".modal-body-"+self.elementId+" .page-wrap").html(pageHtml);

				//初始化设置的数据
				var savePath = "D:/";
				if("macOS"===commonFunctionObject.getSystemOS()){
					savePath = ""
				}
				const downloadSetting = commonFunctionObject.GMgetValue(this.downloadSettingKey,
					{"RPCURL":"ws://localhost:16800/jsonrpc",
					"savePath":savePath,
					"RPCToken":'', "downloadWay":"Motrix"});
				const isMotrix = downloadSetting.downloadWay=="Motrix";
				$(".modal-body-"+self.elementId+" input[name='RPCURL']").val(downloadSetting.RPCURL);
				$(".modal-body-"+self.elementId+" input[name='savePath']").val(downloadSetting.savePath);
				$(".modal-body-"+self.elementId+" input[name='RPCToken']").val(downloadSetting.RPCToken);
				$(".modal-body-"+self.elementId+" input[name='downloadWay']").removeAttr("checked");
				if(isMotrix){
					$(".modal-body-"+self.elementId+" input:radio[value='Motrix']").attr('checked','true');
				}else{
					$(".modal-body-"+self.elementId+" input:radio[value='AriaNgGUI']").attr('checked','true');
				}

				$(".modal-body-"+self.elementId+" .page-wrap >.board-item >span").off("click").on("click", function(){
					$(this).css("background-color","#ccc");
					let downloadOptions={
						"aid":$(this).data("aid"),
						"cid":$(this).data("cid"),
						"isByPRC":false
					}
					self.startDownloadFile(downloadOptions);
				});
				$(".modal-body-"+self.elementId+" .page-header >span.close").off("click").on("click", function(){
					self.hideModals();
				});
				$(".modal-body-"+self.elementId+" .modal-btn-wrap >span[name='selectall']").off("click").on("click", function(){
					$(".modal-body-"+self.elementId+" .page-wrap").find("input[type='checkbox']").each(function(){
						$(this).prop('checked', true);
					});
				});
				$(".modal-body-"+self.elementId+" input[name='downloadWay']").off("change").on("change", function(){
					if($(this).val()=="Motrix"){
						$(".modal-body-"+self.elementId+" input[name='RPCURL']").val("ws://localhost:16800/jsonrpc");
					}else{
						$(".modal-body-"+self.elementId+" input[name='RPCURL']").val("ws://localhost:6800/jsonrpc");
					}
				});
				$(".modal-body-"+self.elementId+" .modal-btn-wrap >span[name='removeSelect']").off("click").on("click", function(){
					$(".modal-body-"+self.elementId+" .page-wrap").find("input[type='checkbox']").each(function(){
						$(this).prop('checked', false);
					});
				});
				$(".modal-body-"+self.elementId+" .modal-btn-wrap >span[name='downloadAll']").off("click").on("click", function(){
					let RPCURL = $(".modal-body-"+self.elementId+" input[name='RPCURL']").val();
					let savePath = $(".modal-body-"+self.elementId+" input[name='savePath']").val();
					let RPCToken = $(".modal-body-"+self.elementId+" input[name='RPCToken']").val();
					let downloadWay = $(".modal-body-"+self.elementId+" input[name='downloadWay']:checked").val();
					commonFunctionObject.GMsetValue(downloadSettingKey,{"RPCURL":RPCURL, "savePath":savePath,
						"RPCToken":RPCToken, "downloadWay":downloadWay});

					let inputElements = $(".modal-body-"+self.elementId+" .page-wrap input[type='checkbox']:checked");
					if(inputElements.length == 0){
						commonFunctionObject.webToast({"message":"至少需要选中1P", "background":"#FF4D40"});
						return;
					}

					if(!savePath){
						commonFunctionObject.webToast({"message":"保存路径不能为空", "background":"#FF4D40"});
						return;
					}
					if(!RPCURL){
						commonFunctionObject.webToast({"message":"PRC地址不能为空", "background":"#FF4D40"});
						return;
					}
					RPCToken = !RPCToken ? "" : RPCToken;
					let downloadOptions = {
						"aid":"",
						"cid":"",
						"isByPRC":true,
						"fileName":"",
						"savePath":savePath,
						"RPCURL":RPCURL,
						"RPCToken":RPCToken
					}
					inputElements.each(function(){
						setTimeout(()=>{
							let aid=$(this).data("aid"), cid = $(this).data("cid"), fileName = $(this).attr("title");
							downloadOptions.aid = aid;
							downloadOptions.cid = cid;
							downloadOptions.fileName = fileName;
							self.startDownloadFile(downloadOptions);
						}, 1000);
					})
				});
			};
			this.createElementHtml = async function(){
				$("#bilibili_exti_9787fjfh12j").remove();

				const randomNumber = this.elementId, self = this;
				let cssText = `
					#bilibili_exti_9787fjfh12j{
						position:fixed;
						left:-30px;
						top:250px;
						opacity:0.6;
						transition: 0.3s;
					}
					#bilibili_exti_9787fjfh12j >.self_s_btn{
						background-color:#FB7299;
						color:#FFF;
						font-size:10px;
						border-radius:3px;
						cursor:pointer;
						margin:10px 0px;
						width:60px;
						height:20px;
						text-align:center;
						line-height:20px;
					}
				`;
				let htmlText=`
					<div id="bilibili_exti_9787fjfh12j">
						<div class="self_s_btn" id="download_s_`+randomNumber+`">下载视频</div>
						<div class="self_s_btn" id="focus_s_`+randomNumber+`">一键三连</div>
					</div>
				`;

				//添加下载等操作按钮
				commonFunctionObject.GMaddStyle(cssText);
				$("body").append(htmlText);

				//创建弹框
				this.createModals();

				//移入移除操作
				$("#bilibili_exti_9787fjfh12j").hover(function(){
					$(this).css({
						"left":"0px", "opacity":1
					});
				},function(){
					$(this).css({
						"left":(0-$(this).width())/2+"px", "opacity":0.6
					});
				});

				//下载操作函数
				$("body").on("click", "#download_s_"+randomNumber, function(){
					const btnElement = $(this);
					btnElement.attr("disabled", "disabled");
					btnElement.text("准备中~");
					//开始准备下载数据
					self.getDownloadPages().then((resule)=>{
						if(resule.status==="success"){
							const {items, pic, title} = resule.downloadData;
							let itemHtml = "";
							itemHtml += "<div style='width:100%;'><a href='"+pic+"' target='_blank'>标题："+title+"（点我跳转封面）</a></div>";
							for(var i=0; i<items.length; i++){
								var currentTitle = "【P"+items[i].page+"】"+items[i].title+"";
								itemHtml += "<div class='board-item'>";
								itemHtml += "<input data-aid='"+items[i].aid+"' data-cid='"+items[i].cid+"' title='"+currentTitle+"' type='checkbox'>"
								itemHtml += "<span data-aid='"+items[i].aid+"' data-cid='"+items[i].cid+"' title='"+currentTitle+"'>"+currentTitle+"</span>";
								itemHtml += "</div>";
							}
							self.showModals(itemHtml);
							self.downloadResutSuccess(btnElement);
						}else{
							self.downloadResutError(btnElement);
						}
					}).catch((error)=>{
						self.downloadResutError(btnElement);
					});
				});
				$("body").on("click", "#focus_s_"+randomNumber, function(){
					$("#arc_toolbar_report .video-like").click(); // 点赞
					$("#arc_toolbar_report .video-coin").click(); // 投币
					// $("#arc_toolbar_report .video-fav").click(); // 收藏
				});
			}
			this.start = function(){
				let locationHost = window.location.host, locationPathname = window.location.pathname;
				if(locationHost==="www.bilibili.com" && (locationPathname.indexOf("/video")!=-1 || locationPathname.indexOf("/watchlater")!=-1)){
					this.createElementHtml();
				}
			}
		}
		try{
			(new baseFunctionObject()).start();
		}catch(e){
			console.log("baseFunctionObject new error", e);
		}
	};
	/**
	 * 浏览历史记录提醒
	 */
	this.recordViewFunction = function(){
		function recordViewObject(){
			this.localCacheName = "bilibili_video_record";
			this.recordOneVideo = function(){
				let promise = new Promise((resolve, reject)=>{
					let bv = commonFunctionObject.getBilibiliBV();
					let cacheText = commonFunctionObject.GMgetValue(this.localCacheName);
					cacheText = !cacheText ? "" : cacheText
					let maxLength = 12*500;
					let currentLength = cacheText.length;
					if(currentLength > maxLength){
						cacheText = cacheText.substring(12*100, currentLength);
					}

					if(cacheText.indexOf(bv)==-1){
						cacheText += bv;
						commonFunctionObject.GMsetValue(this.localCacheName, cacheText);
					}
					resolve({"result":"success"});
				});
			};
			this.searchPageRemindHtml = function($ele, top=8, right=8){
				if($ele.find("div[name='marklooked']").length==0){
					$ele.css("position","relative");
					$ele.append("<div name='marklooked' style='z-index: 100;position:absolute; top:"+top+"px; right:"+right+"px; background-color: rgba(251,123,159,1); border-radius:3px; font-size:10px; color:#FFF;padding:0px 2px;'>已看</div>");
				}
			};
			this.searchPageRemind = function(){
				let $that = this;
				var elementArray = [
					{"node":".bili-video-card", "top":8, "right":12},  //兼容 MAC M1搜索结果
					{"node":"#page-index .small-item", "top":12, "right":12},  //用户投稿
					{"node":"#submit-video-list .small-item", "top":12, "right":12}, //用户主页
					{"node":"#page-series-detail .small-item.fakeDanmu-item", "top":12, "right":12}, //用户主页投稿
				];
				setInterval(function(){
					let cacheText = commonFunctionObject.GMgetValue($that.localCacheName);
					cacheText = !cacheText ? "" : cacheText;
					for(var i=0; i<elementArray.length; i++){
						var elementobj = elementArray[i];
						$(elementobj.node).each(function(){
							if($(this).attr("dealxll")!=="true"){
								var videourl = $(this).find("a[href^='//www.bilibili.com/video']").attr("href");
								if(!!videourl){
									var bvs = videourl.match(/(\/BV(.*?)\/)/g)
									if(bvs.length==1){
										var bv = bvs[0].replace(/\//g,"");
										if(cacheText.indexOf(bv) != -1){
											$that.searchPageRemindHtml($(this), elementobj.top, elementobj.right);
										}
										$(this).unbind("click").bind("click", ()=>{  //循环操作，单独绑定
											$that.searchPageRemindHtml($(this), elementobj.top, elementobj.right);
										})
									}
									$(this).attr("dealxll","true");
								}
							}
						});
					}
				}, 500);
			}
			this.start=function(){
				let $that = this;
				if(window.location.pathname.indexOf("/video")!=-1 && window.location.host==="www.bilibili.com"){
					let currentHref = "";
					setInterval(()=>{ //需要循环存储
						if(window.location.href !== currentHref){
							this.recordOneVideo();
							currentHref = window.location.href;
						}
					}, 500);
				}
				//搜索结果和用户主页已经看过的视频提醒
				if(window.location.host.indexOf("bilibili.com")!=-1){
					this.searchPageRemind();
					GM_registerMenuCommand("清空B站浏览记录",function(){
						if(confirm('是否要清空B站浏览记录？清空后将不可恢复...')){
							commonFunctionObject.GMsetValue($that.localCacheName, "");
						}
					});
				}
			};
		}
		try{
			(new recordViewObject()).start();
		}catch(e){
			console.log("recordViewObject new error", e);
		}
	};
	/**
	 * 视频描述文本转链接
	 */
	this.textToLinkFunction = function() {
		function textToLinkObject(){
			this.link = function(selector){
				const current_href = window.location.href;
				const textToLinkArea = document.querySelector(selector);

				if(!textToLinkArea){
					return;
				}
				findAndReplaceDOMText(textToLinkArea, {
					find: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/g,
					replace: function (e, t) {
						let text = e.text;
						let element = null;
						if(text.indexOf("bilibili.com")==-1 && /^(http|ftp|https)/i.test(text)){
							element = document.createElement("a");
							element.setAttribute("href", text)
							element.setAttribute("target", "_blank");
							element.style.color="#00AEEC";
						}else{
							element = document.createElement("span");
						}
						element.innerText = text;
						return element;
					},
					preset: "prose"
				});

			}
			this.start = function(){
				const selector = "#v_desc";
				this.link(selector);

				const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
				const bodyMutationObserver = new MutationObserver(()=>{
					this.link(selector);
				});

				const element = document.querySelector(selector);
				if(element){
					bodyMutationObserver.observe(element,
						{"characterData":true, "attributes":true, "childList":true},
					);
				}
			}
		}
		try{
			(new textToLinkObject()).start();
		}catch(e){
			console.log("textToLinkObject new error", e);
		}
	}
	this.signIn = async function(){ //签到下线，2024年7月2日

	}
	this.start = function(){
		if(this.isRun()){
			this.baseFunction();
			this.recordViewFunction();
			this.textToLinkFunction();
			this.signIn();
		}
	}
}

try{
	if(!functionController || functionController.bilibiliHelper){
		new BilibiliHelper().start();
	}
}catch(e){
	console.log("B站视频下载：error："+e);
}

function ServerNavigation(){
	this.allowHosts = ["tencent.com","aliyun.com","huaweicloud.com","bandwagonhost.com","hostwinds.com"];
	this.number = Math.ceil(Math.random()*100000000);
	this.containerHight = 150;
	this.GMopenInTab = function(url, options={"active":true, "insert":true, "setParent":true}){
		if (typeof GM_openInTab === "function") {
			GM_openInTab(url, options);
		} else {
			GM.openInTab(url, options);
		}
	};
	this.addStyle = function(css){
		GM_addStyle(css);
	};
	this.serverMenu = function(){
		var isOpenServer = GM_getValue("server_navigation_key", true);
		GM_registerMenuCommand("服务器导航设置",()=>{
			var person = prompt("是否开启服务器导航功能？请填写yes或者no....", isOpenServer ? "yes" : "no");
		  if(person==null||person==undefined){
			return;
		  }
		  var validate = person==="no"||person==="NO"||person==="yes"|| person==="YES";
		  if(validate) GM_setValue("server_navigation_key", (person==="yes"|| person==="YES"));

		  var toastMessage = "开启服务器导航功能";
			if(person==="yes"|| person==="YES"){
			toastMessage = "开启服务器导航功能";
		  }else if(person==="no"|| person==="NO"){
			toastMessage = "关闭服务器导航功能";
		  }else{
			toastMessage = "参数错误，只能填写yes或者no";
		  }
		  toast.show({"message":toastMessage, "background":"#474747"});
		  //只有验证通过后，才会刷新页面
		  if(validate){
			setTimeout(function(){
			  location.reload();
			},1000);
		  }
		});
	};
	this.request = function(mothed, url, param){   //网络请求
		return new Promise(function(resolve, reject){
			GM_xmlhttpRequest({
				url: url,
				method: mothed,
				data:param,
				onload: function(response) {
					var status = response.status;
					var playurl = "";
					if(status==200||status=='200'){
						var responseText = response.responseText;
						resolve({"result":"success", "responseText":responseText});
					}else{
						reject({"result":"error", "responseText":null});
					}
				}
			});
		})
	};
	this.isRun = function(){
		const host = window.location.host;
		for(let i=0;i<this.allowHosts.length;i++){
			if(host.indexOf(this.allowHosts[i])!=-1){
				return true;
			}
		}
		return false;
	};
	this.temporary=function(track){
	  const pathname = window.location.pathname;
	  const pathnameRes = ["/", "/product", "/product/list"].some((item) => pathname === item);
		if(pathnameRes){
			const anchorRun=()=>{
				var num = 0;
				const anchor = decodeURIComponent("%E5%AE%89%E5%85%A8%7C%E8%AF%86%E5%88%AB%7C%E6%A8%A1%E5%9E%8B%7C%E5%AE%A1%E6%A0%B8%7C%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%7CAI%7C%E6%9C%8D%E5%8A%A1%E5%99%A8%7C%E4%B8%BB%E6%9C%BA%7C%E6%B4%BB%E5%8A%A8%7C%E6%96%87%E6%9C%AC%7C%E6%96%87%E5%AD%97%7C%E8%AF%AD%E8%A8%80%7C%E5%9B%BE%E5%83%8F%7C%E5%9B%BE%E7%89%87%7C%E8%A7%86%E9%A2%91%7C%E5%9F%9F%E5%90%8D%7C%E7%9F%AD%E4%BF%A1");
				const anchorItems = anchor.split("|");
				document.querySelectorAll("a").forEach(function(element,index){
				  var href = element.getAttribute("href");
				  if(!href || (element.getAttribute("anchor-i") && element.getAttribute("anchor-i-url")===href)){
					return;
				  }
				  element.setAttribute("anchor-i","true");
				  element.setAttribute("anchor-i-url",href);
				  let textContent = "";
				  for(let node of element.childNodes){
					if(node.nodeType === Node.TEXT_NODE || (node.nodeType === Node.ELEMENT_NODE && node.tagName!== 'A')) {
					  textContent += node.textContent;
					}
				  }
				  textContent = textContent.replace(/\n|\t|\s/g, "");
				  const result = anchorItems.some((item) => textContent.indexOf(item)!=-1);
				  if(result){
					if(href.indexOf(track)!=-1) return;
					element.setAttribute("rel", "noreferrer nofollow");
					href = href + (href.indexOf("?")!=-1 ? "&" : "?") + track;

					element.removeAttribute("data-spm");
					element.removeAttribute("data-spm-anchor-id");
					element.removeAttribute("data-tracker-scm");

					element.setAttribute("href", href);
					element.setAttribute("anchor-i-url",href);
					num++;
				  }
				});
			}
			anchorRun();
			setInterval(function(){
			  anchorRun();
			},1000);
		}
	};
	this.start=function(){
		if(!this.isRun()){
			return;
		}
		this.serverMenu();
		const isOpenServer = GM_getValue("server_navigation_key", true);
		if(isOpenServer){
			this.generateHtml();
		}
	};
	this.generateHtml=function(){
		const number = this.number;
		const containerHight = this.containerHight;
		var css=`
			#server-containerx`+number+`{
				display: block;
				bottom: -`+containerHight+`px;
				clear: none !important;
				float: none !important;
				left: 50%;
				margin: 0px !important;
				max-height: none !important;
				max-width: none !important;
				opacity: 1;
				overflow: visible !important;
				padding: 0px !important;
				position: fixed;
				right: auto !important;
				top: auto !important;
				vertical-align: baseline !important;
				visibility: visible !important;
				z-index: 2147483647;
				background: rgb(250, 250, 250) !important;
				transition-duration:0.8s!important;
				-webkit-transition-duration:0.8s!important;
				transform:translateX(-50%);
				width: 60% !important;
				height: `+containerHight+`px !important;
				max-width:700px!important;
				box-sizing: border-box!important;
				box-shadow: rgba(0, 0, 0, 0.2) 0px -1px 5px -1px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px !important;
			}
			#server-containerx`+number+`:hover{
				-webkit-box-shadow: 0 4px 12px rgba(0,0,0,.08);
				box-shadow: 0 4px 12px rgba(0,0,0,.08);
			}
			#server-container-decoration`+number+`{
				inset: auto !important;
				clear: none !important;
				display: block !important;
				float: none !important;
				height: 5px !important;
				margin: 0px !important;
				max-height: none !important;
				max-width: none !important;
				opacity: 1 !important;
				overflow: visible !important;
				padding: 0px !important;
				position: relative !important;
				vertical-align: baseline !important;
				visibility: visible !important;
				width: auto !important;
				z-index: 1 !important;
				background-color: #e4eaf6 !important;
				box-shadow: rgba(0, 0, 0, 0.2) 0px -1px 5px -1px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px !important;
			}
			#server-container-expand`+number+`{
				cursor:pointer;
				position:absolute;
				width:50px;
				height:30px;
				background-color: #e4eaf6;
				top:-30px;
				left:50%;
				transform:translateX(-50%);
				border-radius: 5px 5px 0px 0px;
			}
			#server-container-expand`+number+`:hover{

			}
			#server-container-expand`+number+`>svg{
				width:50px;
				height:30px;
			}
			#server-container-expand`+number+`>svg:hover{
				transition: 0.6s;
				transform: scale(1.1);
			}
			.server-container-column9980x{
				position:relative;
			}
			.server-container-column9980x:not(:last-child):after{
				position: absolute;
				height: calc(100% - 4em);
				right: 0px;
				content: '';
				width: 0px;
				border-left: solid #e6e7eb 2px;
				top: 50%;
				transform: translateY(-50%);
			}
			#server-container-body`+number+`{
				width:100%;
				height:100%;
			}
		`;
		var html=`
			<div id="server-containerx`+number+`">
				<div id="server-container-decoration`+number+`">
					<div id="server-container-expand`+number+`">
						<svg t="1719906770072" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4303" width="256" height="256"><path d="M444 136.3L123.8 324.8l3.2 371.5 323.3 183 320.2-188.5-3.2-371.5z" fill="#FFFFFF" p-id="4304"></path><path d="M630 287.6l-20.1-11.4-279.7 164.7L333 767l20.1 11.3-2.8-326z" fill="#06F3FF" p-id="4305"></path><path d="M746.8 489.8l-8.6 5.2c-4.7 2.9-6.2 9-3.4 13.7 1.9 3.1 5.2 4.8 8.6 4.8 1.8 0 3.5-0.5 5.2-1.4l8.6-5.2c4.7-2.9 6.2-9 3.4-13.7-2.9-4.7-9-6.2-13.8-3.4z" fill="#005BFF" p-id="4306"></path><path d="M638.6 534c-1.6-0.9-3.4-1.3-5.2-1.3-4.9 0-9.9 2.6-13 4.6-20.6 13-38 47.5-38 75.2 0 12.2 3.4 21.4 9.1 24.5 6 3.3 14-0.6 18.2-3.3 20.6-13 38-47.5 38-75.2 0-12.2-3.4-21.3-9.1-24.5z m-9.9 50.4l-8.6 5.2c-1.6 1-3.4 1.4-5.2 1.4-3.4 0-6.7-1.7-8.6-4.8-2.9-4.7-1.3-10.9 3.4-13.7l8.6-5.2c4.7-2.9 10.9-1.3 13.7 3.4 3 4.7 1.5 10.9-3.3 13.7z" fill="#E6E6E6" p-id="4307"></path><path d="M618.4 567.3l-8.6 5.2c-4.7 2.9-6.2 9-3.4 13.7 1.9 3.1 5.2 4.8 8.6 4.8 1.8 0 3.5-0.5 5.2-1.4l8.6-5.2c4.7-2.9 6.2-9 3.4-13.7-2.9-4.7-9.1-6.3-13.8-3.4z" fill="#E6E6E6" p-id="4308"></path><path d="M444 136.3L123.8 324.8l3.2 371.5 323.3 183 320.1-188.5-3.2-371.5-323.2-183zM166.8 672.9L164 347.6l280.3-165.1 71.2 40.3-280.3 165.1 2.8 325.3-71.2-40.3z m262.8 148.7l-76.5-43.3L333 767l-74.9-42.4-2.8-325.3 280.4-165.1 74.2 42 20.1 11.4 77.8 44-281 165.5 2.8 324.5z m40 0L467 519.8l260.7-153.5 2.6 301.7-260.7 153.6z m287.6-314.7l-8.6 5.2c-1.6 1-3.4 1.4-5.2 1.4-3.4 0-6.7-1.7-8.6-4.8-2.9-4.7-1.3-10.9 3.4-13.7l8.6-5.2c4.7-2.9 10.9-1.3 13.7 3.4 2.9 4.7 1.4 10.9-3.3 13.7z" fill="#005BFF" p-id="4309"></path><path d="M704 515.6l-8.6 5.2c-4.7 2.9-6.2 9-3.4 13.7 1.9 3.1 5.2 4.8 8.6 4.8 1.8 0 3.5-0.5 5.2-1.4l8.6-5.2c4.7-2.9 6.2-9 3.4-13.7-2.9-4.7-9-6.2-13.8-3.4zM827.2 430.8c-5.5 0-10 4.5-10 10v10c0 5.5 4.5 10 10 10s10-4.5 10-10v-10c0-5.5-4.5-10-10-10zM837.2 390.8c0-5.5-4.5-10-10-10s-10 4.5-10 10v10c0 5.5 4.5 10 10 10s10-4.5 10-10v-10zM837.2 340.8c0-5.5-4.5-10-10-10s-10 4.5-10 10v10c0 5.5 4.5 10 10 10s10-4.5 10-10v-10zM837.2 290.8c0-5.5-4.5-10-10-10s-10 4.5-10 10v10c0 5.5 4.5 10 10 10s10-4.5 10-10v-10zM803.4 467.4c-2.9-4.7-9-6.3-13.7-3.4l-8.6 5.2c-4.7 2.9-6.2 9-3.4 13.7 1.9 3.1 5.2 4.8 8.6 4.8 1.8 0 3.5-0.5 5.2-1.4l8.6-5.2c4.6-2.9 6.1-9 3.3-13.7zM665.3 540.1c-3-10.8-8.9-19.1-17.1-23.6-11.2-6.1-24.8-4.8-38.5 3.9-26.5 16.8-47.3 57.2-47.3 92.1 0 19.9 7.1 35.2 19.5 42 4.6 2.5 9.6 3.8 14.9 3.8 7.5 0 15.6-2.6 23.7-7.7 25.9-16.4 46.4-55.4 47.3-89.7l3.9-2.4c4.7-2.9 6.2-9 3.4-13.7-2.2-3.4-6.1-5.1-9.8-4.7z m-55.6 93.7c-4.2 2.7-12.2 6.6-18.2 3.3-5.7-3.1-9.1-12.3-9.1-24.5 0-27.7 17.4-62.2 38-75.2 3.1-1.9 8.1-4.6 13-4.6 1.8 0 3.6 0.4 5.2 1.3 5.7 3.1 9.1 12.3 9.1 24.5 0 27.7-17.4 62.1-38 75.2z" fill="#005BFF" p-id="4310"></path><path d="M891.2 321.7c-5.5 0-10 4.5-10 10v156.4l-81.7 49.3c-4.7 2.9-6.2 9-3.4 13.7 1.9 3.1 5.2 4.8 8.6 4.8 1.8 0 3.5-0.5 5.2-1.4l91.4-55.1V331.7c-0.1-5.5-4.6-10-10.1-10zM817.3 239.6c-0.1 0.4-0.1 0.8-0.1 1.3v10c0 5.5 4.5 10 10 10s10-4.5 10-10v-10c0-0.4 0-0.9-0.1-1.3 23.4-4.6 41-25.3 41-50 0-28.2-22.8-51-51-51s-51 22.8-51 51c0 24.7 17.7 45.4 41.2 50z" fill="#005BFF" p-id="4311"></path></svg>
					</div>
				</div>
				<div id="server-container-body`+number+`">

				</div>
			</div>
		`;

		this.addStyle(css);
		document.body.insertAdjacentHTML("beforeend", html);
		this.addEventListener();
	};
	this.addEventListener=function(){
		const self = this;
		const number = this.number;
		function expandOrShow(forceClose=false){
			const serverContainerx = document.querySelector("#server-containerx"+number);
			var {bottom, height} = window.getComputedStyle(serverContainerx);

			if(bottom=="0px" || forceClose){
				bottom = "-"+height;
			}else{
				bottom = "0px";
			}
			serverContainerx.style.bottom = bottom;
		}

		document.querySelector("#server-container-expand"+number).addEventListener("click",function(){
			expandOrShow();
		});

		var lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
		function startContainer(){
			setTimeout(function(){
				window.addEventListener("scroll", function () {
					var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
					if (scrollTop - lastScrollTop > 30) { //向下滚动
						expandOrShow(true);
					} else { //向上滚动

					}
					lastScrollTop = scrollTop;
				});
			}, 1500);
		}

		var url = "https://server.staticj.top/api/server/discover?url="+encodeURIComponent(window.location.href)+"&no=1";
		self.request("get", url, null).then((data)=>{
			if(data.result=="success" && !!data.responseText){
				const {html, track} = JSON.parse(data.responseText).data;
				document.querySelector("#server-container-body"+number).insertAdjacentHTML("beforeend", html);
				startContainer();
				self.temporary(track);
			}
		}).catch((error)=>{
			console.log(error);
		});
	};
}
(new ServerNavigation()).start();

})();
