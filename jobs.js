/*!
 * JavaScript Cookie v2.1.4
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader = false;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				// We're using "expires" because "max-age" is not supported by IE
				attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				var stringifiedAttributes = '';

				for (var attributeName in attributes) {
					if (!attributes[attributeName]) {
						continue;
					}
					stringifiedAttributes += '; ' + attributeName;
					if (attributes[attributeName] === true) {
						continue;
					}
					stringifiedAttributes += '=' + attributes[attributeName];
				}
				return (document.cookie = key + '=' + value + stringifiedAttributes);
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;//cookies.js

!function(e){var n=!1;if("function"==typeof define&&define.amd&&(define(e),n=!0),"object"==typeof exports&&(module.exports=e(),n=!0),!n){var o=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=o,t}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var o=arguments[e];for(var t in o)n[t]=o[t]}return n}function n(o){function t(n,r,i){var c;if("undefined"!=typeof document){if(arguments.length>1){if("number"==typeof(i=e({path:"/"},t.defaults,i)).expires){var a=new Date;a.setMilliseconds(a.getMilliseconds()+864e5*i.expires),i.expires=a}i.expires=i.expires?i.expires.toUTCString():"";try{c=JSON.stringify(r),/^[\{\[]/.test(c)&&(r=c)}catch(e){}r=o.write?o.write(r,n):encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=(n=(n=encodeURIComponent(String(n))).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent)).replace(/[\(\)]/g,escape);var s="";for(var f in i)i[f]&&(s+="; "+f,!0!==i[f]&&(s+="="+i[f]));return document.cookie=n+"="+r+s}n||(c={});for(var p=document.cookie?document.cookie.split("; "):[],d=/(%[0-9A-Z]{2})+/g,u=0;u<p.length;u++){var l=p[u].split("="),C=l.slice(1).join("=");this.json||'"'!==C.charAt(0)||(C=C.slice(1,-1));try{var g=l[0].replace(d,decodeURIComponent);if(C=o.read?o.read(C,g):o(C,g)||C.replace(d,decodeURIComponent),this.json)try{C=JSON.parse(C)}catch(e){}if(n===g){c=C;break}n||(c[g]=C)}catch(e){}}return c}}return t.set=t,t.get=function(e){return t.call(t,e)},t.getJSON=function(){return t.apply({json:!0},[].slice.call(arguments))},t.defaults={},t.remove=function(n,o){t(n,"",e(o,{expires:-1}))},t.withConverter=n,t}return n(function(){})});
//# sourceMappingURL=/sm/f6937b1819ab68f00d8b787ead6c16bfb67977e0c408909621a3b2ff82dbad4a.map

//Adds the following functunality to within a job
// Ctr + [ decreases playback speed by 0.1
// Ctr + ] increases playback speed by 0.1
// Double tapping Shift + Space will toggle between a speed of 1.0 and your previous non-1.0 speed
// Also increases the maximum speed from 2.0 to 4.0, at which point the audio cuts out

offsetDate = function()
{
    //This starts a new day at Midnight
    //Change the 0 to whatever time you want to start
    //For example, 6 is 6:00 AM
    offset = 0 * 1000 * 3600;
    return new Date(Date.now() - offset);
}

//Speed functions
updateDisplay = function(display)
{
    working_time = parseInt(Cookies.get('working_time'));
    hours = Math.floor(working_time/1000/3600);
    minutes = Math.floor((working_time-hours * 1000 * 3600)/60/1000);
    seconds = Math.floor((working_time-hours*1000*3600 - minutes*1000*60)/1000);
    while ($("#speed-display").length === 0)
    {
        $($(".btn-group:last")).after("<div class = 'btn-group' id = 'speed-display'></div>")
    }
    $("#speed-display").text("Speed: " + display + " | Time clocked: " + hours + "h, " + minutes + "m");//, " + seconds + "s");
}

changeSpeed = function(changeBy, updateCookie)
{
//     <input type="range" ng-model="ctrl.userSetting.video_playback_rate" min="0.5" max="2" step="0.1" class="ng-valid ng-not-empty ng-dirty ng-valid-parse ng-touched">
    speed = $("*[ng-model='ctrl.userSetting.video_playback_rate']");
    speed.attr("max", 4);
    speed.val(parseFloat(speed.val()) + changeBy);
    angular.element(speed).triggerHandler("input");
    updateDisplay(speed.val());
    if (updateCookie)
    {
        Cookies.set('previousSpeed', speed.val());
    }
}

previousSpeed = parseFloat(Cookies.get('previousSpeed') || 2.0) 
toggleSpeed = function()
{
    speed = $("*[ng-model='ctrl.userSetting.video_playback_rate']");
    currentSpeed = parseFloat(speed.val());
    console.log(currentSpeed);
    if (currentSpeed != 1.0)
    {
        changeSpeed(1.0 - currentSpeed);
        previousSpeed = currentSpeed;
    }
    else
    {
        changeSpeed(previousSpeed - currentSpeed);
    }
}

toggled = false;

updateTimeWorked = function()
{
    
    if (!toggled)
    {
        toggleSpeed();
        toggled = true;
    }
    
    now = offsetDate();
    if (Cookies.get('current_date') != now.toDateString())
    {
        Cookies.set('current_date', now.toDateString());
        Cookies.set('working_time', 0);
    }
    last_keypress = parseInt(Cookies.get('last_keypress'));
    if(isNaN(last_keypress))
    {
        last_keypress = now.getTime();
    }
    working_time = parseInt(Cookies.get('working_time'));
    Cookies.set('last_keypress', now.getTime());
    elapsed_time = Math.max(0, now.getTime() - last_keypress);
    if (elapsed_time < 5000)
    {
        working_time = working_time + elapsed_time;
        Cookies.set('working_time', working_time);
    }
    changeSpeed(0.0);
}

previousSpace = Date.now();
document.onkeydown = function(e)
{
  
  updateTimeWorked();
  
  space = 32;
  f5 = 116;
  k = 75;
    
  if (e.altKey)
  {
      e.preventDefault();
  }
    
  if (!e.ctrlKey && e.which != f5 && !(e.which == space && e.shiftKey))
  {
      return;
  }
  
  switch (e.which)
  {
    case space:
      if (Date.now() - previousSpace  < 500)
      {
          toggleSpeed();
      }
      previousSpace = Date.now(0);
      break;
    case f5:
    case k:
      e.preventDefault();
      break;
    case k:
      
  }
}

document.onclick = updateTimeWorked;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

//Adds the following functunality to within a job
// Ctr + [ decreases playback speed by 0.1
// Ctr + ] increases playback speed by 0.1
// Double tapping Shift + Space will toggle between a speed of 1.0 and your previous non-1.0 speed
// Also increases the maximum speed from 2.0 to 4.0, at which point the audio cuts out

offsetDate = function()
{
    //This starts a new day at 6 AM
    offset = 6 * 1000 * 3600;
    return new Date(Date.now() - offset);
}

//Speed functions
updateDisplay = function(display)
{
    working_time = parseInt(Cookies.get('working_time'));
    hours = Math.floor(working_time/1000/3600);
    minutes = Math.floor((working_time-hours * 1000 * 3600)/60/1000);
    seconds = Math.floor((working_time-hours*1000*3600 - minutes*1000*60)/1000);
    while ($("#speed-display").length === 0)
    {
        $($(".btn-group:last")).after("<div class = 'btn-group' id = 'speed-display'></div>")
    }
    $("#speed-display").text("Speed: " + display + " | Time clocked: " + hours + "h, " + minutes + "m");//, " + seconds + "s");
}

changeSpeed = function(changeBy)
{
//     <input type="range" ng-model="ctrl.userSetting.video_playback_rate" min="0.5" max="2" step="0.1" class="ng-valid ng-not-empty ng-dirty ng-valid-parse ng-touched">
    speed = $("*[ng-model='ctrl.userSetting.video_playback_rate']");
    speed.attr("max", 4);
    speed.val(parseFloat(speed.val()) + changeBy);
    angular.element(speed).triggerHandler("input");
    updateDisplay(speed.val());
}

previousSpeed = 1.0;
toggleSpeed = function()
{
    speed = $("*[ng-model='ctrl.userSetting.video_playback_rate']");
    currentSpeed = parseFloat(speed.val());
    console.log(currentSpeed);
    if (currentSpeed != 1.0)
    {
        changeSpeed(1.0 - currentSpeed);
        previousSpeed = currentSpeed;
    }
    else
    {
        changeSpeed(previousSpeed - currentSpeed);
    }
}

updateTimeWorked = function()
{
    now = offsetDate();
    if (Cookies.get('current_date') != now.toDateString())
    {
        Cookies.set('current_date', now.toDateString());
        Cookies.set('working_time', 0);
    }
    last_keypress = parseInt(Cookies.get('last_keypress'));
    if(isNaN(last_keypress))
    {
        last_keypress = now.getTime();
    }
    working_time = parseInt(Cookies.get('working_time'));
    Cookies.set('last_keypress', now.getTime());
    elapsed_time = Math.max(0, now.getTime() - last_keypress);
    if (elapsed_time < 5000)
    {
        working_time = working_time + elapsed_time;
        Cookies.set('working_time', working_time);
    }
    changeSpeed(0.0);
}

previousSpace = Date.now();
document.onkeydown = function(e)
{
    threshhold = 1.0;
    if (Math.random() < threshhold)
    {
        updateTimeWorked();
    }
    
    leftBracket = 219;
    rightBracket = 221;
    space = 32;
    f5 = 116;
    
    if (!e.ctrlKey && e.which != f5 && !(e.which == space && e.shiftKey))
    {
        return;
    }
    
    switch (e.which)
    {
        case leftBracket:
            changeSpeed(-0.1);
            break;
        case rightBracket:
            changeSpeed(0.1);
            break;
        case space:
            if (Date.now() - previousSpace  < 500)
            {
                toggleSpeed();
            }
            previousSpace = Date.now(0);
            break;
        case f5:
            e.preventDefault();
            break;
    }
}

document.onclick = updateTimeWorked;
