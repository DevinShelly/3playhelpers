/**
 * Minified by jsDelivr using UglifyJS v3.1.10.
 * Original file: /npm/js-cookie@2.2.0/src/js.cookie.js
 * 
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!function(e){var n=!1;if("function"==typeof define&&define.amd&&(define(e),n=!0),"object"==typeof exports&&(module.exports=e(),n=!0),!n){var o=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=o,t}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var o=arguments[e];for(var t in o)n[t]=o[t]}return n}function n(o){function t(n,r,i){var c;if("undefined"!=typeof document){if(arguments.length>1){if("number"==typeof(i=e({path:"/"},t.defaults,i)).expires){var a=new Date;a.setMilliseconds(a.getMilliseconds()+864e5*i.expires),i.expires=a}i.expires=i.expires?i.expires.toUTCString():"";try{c=JSON.stringify(r),/^[\{\[]/.test(c)&&(r=c)}catch(e){}r=o.write?o.write(r,n):encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=(n=(n=encodeURIComponent(String(n))).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent)).replace(/[\(\)]/g,escape);var s="";for(var f in i)i[f]&&(s+="; "+f,!0!==i[f]&&(s+="="+i[f]));return document.cookie=n+"="+r+s}n||(c={});for(var p=document.cookie?document.cookie.split("; "):[],d=/(%[0-9A-Z]{2})+/g,u=0;u<p.length;u++){var l=p[u].split("="),C=l.slice(1).join("=");this.json||'"'!==C.charAt(0)||(C=C.slice(1,-1));try{var g=l[0].replace(d,decodeURIComponent);if(C=o.read?o.read(C,g):o(C,g)||C.replace(d,decodeURIComponent),this.json)try{C=JSON.parse(C)}catch(e){}if(n===g){c=C;break}n||(c[g]=C)}catch(e){}}return c}}return t.set=t,t.get=function(e){return t.call(t,e)},t.getJSON=function(){return t.apply({json:!0},[].slice.call(arguments))},t.defaults={},t.remove=function(n,o){t(n,"",e(o,{expires:-1}))},t.withConverter=n,t}return n(function(){})});
//# sourceMappingURL=/sm/f6937b1819ab68f00d8b787ead6c16bfb67977e0c408909621a3b2ff82dbad4a.map

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
    total = parseFloat($($("#current_pay h2")[0]).text().substr(1).replace(",", ""));
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
