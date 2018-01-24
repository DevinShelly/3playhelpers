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
			var i = 0;

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

//Adds the ability to automatically refresh the marketplace every 2 seconds

interval_id = null;
interval_duration = 2000;

create_button = function()
{
    if ($(".auto-refresh").length === 0)
    {
        button_html = "<a class = 'btn btn-icon auto-refresh'>Stop Autorefreshing</button>";
        $("#main_container .btn-icon").parent().append(button_html)
        $(".auto-refresh").click(toggle_autorefresh);
        if (!interval_id)
        {
            $(".auto-refresh").text("Start Autorefreshing");
        }
    }
}

toggle_autorefresh = function()
{
    if (!interval_id)
    {
        interval_id = setInterval(function(){$(".btn.btn-icon").not(".auto-refresh").click(); }, interval_duration);
        $(".auto-refresh").text("Stop Autorefreshing");
    }
    else
    {
        clearInterval(interval_id);
        interval_id = null;
        $(".auto-refresh").text("Start Autorefreshing");
    }
}

if (window.location.href === "http://jobs.3playmedia.com/available_jobs")
{
    create_button();
    setInterval(create_button, 10);
    toggle_autorefresh();
    setInterval(function(){
        if($(".clickable_row").length == 1)
        {
            $(".clickable_row").click();
        }
    }, 0.5);
}

//Calculating today's pay

offsetDate = function()
{
    //This starts a new day at 6 AM
    offset = 6 * 1000 * 3600;
    return new Date(Date.now() - offset);
}

updatePay = function()
{
    total = parseFloat($($("#current_pay h2")[0]).text().substr(1));
    now = offsetDate();
    if (Cookies.get('current_date') != now.toDateString())
    {
        Cookies.set ('current_date', now.toDateString());
        Cookies.set('yesterdays_total', total);
    }
    today = total - parseFloat(Cookies.get('yesterdays_total'));
    if (today < 0)
    {
        Cookies.set('yesterdays_total', 0);
        today = 0;
    }
    
    $("#current_pay").append('<h2 class = "muted" style = "margin_top: 10px"> $' + today.toFixed(2) + "</h2>");
    $("#current_pay").append('<div class = "secondColor">TODAY</div>');
    $("#footer_nav ul.box_style li").css("height", 210);
}

updatePay();
