!function(e){var n=!1;if("function"==typeof define&&define.amd&&(define(e),n=!0),"object"==typeof exports&&(module.exports=e(),n=!0),!n){var o=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=o,t}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var o=arguments[e];for(var t in o)n[t]=o[t]}return n}function n(o){function t(n,r,i){var c;if("undefined"!=typeof document){if(arguments.length>1){if("number"==typeof(i=e({path:"/"},t.defaults,i)).expires){var a=new Date;a.setMilliseconds(a.getMilliseconds()+864e5*i.expires),i.expires=a}i.expires=i.expires?i.expires.toUTCString():"";try{c=JSON.stringify(r),/^[\{\[]/.test(c)&&(r=c)}catch(e){}r=o.write?o.write(r,n):encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=(n=(n=encodeURIComponent(String(n))).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent)).replace(/[\(\)]/g,escape);var s="";for(var f in i)i[f]&&(s+="; "+f,!0!==i[f]&&(s+="="+i[f]));return document.cookie=n+"="+r+s}n||(c={});for(var p=document.cookie?document.cookie.split("; "):[],d=/(%[0-9A-Z]{2})+/g,u=0;u<p.length;u++){var l=p[u].split("="),C=l.slice(1).join("=");this.json||'"'!==C.charAt(0)||(C=C.slice(1,-1));try{var g=l[0].replace(d,decodeURIComponent);if(C=o.read?o.read(C,g):o(C,g)||C.replace(d,decodeURIComponent),this.json)try{C=JSON.parse(C)}catch(e){}if(n===g){c=C;break}n||(c[g]=C)}catch(e){}}return c}}return t.set=t,t.get=function(e){return t.call(t,e)},t.getJSON=function(){return t.apply({json:!0},[].slice.call(arguments))},t.defaults={},t.remove=function(n,o){t(n,"",e(o,{expires:-1}))},t.withConverter=n,t}return n(function(){})});
//# sourceMappingURL=/sm/f6937b1819ab68f00d8b787ead6c16bfb67977e0c408909621a3b2ff82dbad4a.map

//Adds the ability to automatically refresh the marketplace every 2 seconds

interval_id = null;
interval_duration = 5000;
max_base_rate = 0.80;
min_bonus_rate = 0.00;
min_duration = 20;
min_deadline = 90*60*1000;
min_bonus_ratio = 0.2;
claim_automatically = false;
max_duration = 60;
bonus_strings = [];

should_select_row = function(base_rate, bonus_rate, duration, deadline)
{
  base_passes = base_rate <= max_base_rate;
  bonus_passes = bonus_rate >= min_bonus_rate;
  deadline_passes = deadline >= ((new Date()).getTime() + min_deadline);
  duration_passes = duration >= min_duration;
  bonus_ratio_passes = bonus_rate / base_rate >= min_bonus_ratio &&  !(min_bonus_ratio > 0.0 && bonus_rate === 0.0);
  return ( base_passes && bonus_passes && duration_passes && deadline_passes && bonus_ratio_passes) && max_duration > 0;
}

parse_deadline = function (deadline)
{
  pm = deadline.trim().slice(-2) == "pm";
  deadline = deadline.trim().substring(0, deadline.trim().length-2);
  hours = deadline.split(":")[0].slice(-2);
  minutes = deadline.slice(-2);
  if (hours != "12" && pm)
  {
    newHours = parseInt(hours) + 12;
    deadline = deadline.split(",")[0] + ", " + newHours.toString() + ":" + minutes;
  }
  deadline = deadline.split(",")[0] + ", 2019 " + deadline.split(", ")[1];
  return  Date.parse(deadline);
}

parse_duration = function(duration)
{
  return parseInt(duration[0])*60 + parseInt(duration[1]);
}

parse_row = function()
{
  tds = $(this).find('td');
  
  rate = parseFloat(tds.eq(4).text().substring(1));
  bonus = parseFloat(tds.eq(5).text().trim().substring(1));
  bonus = bonus ? bonus : 0.0;
  duration = parse_duration(tds.eq(3).text().split(":"));
  deadline = parse_deadline(tds.eq(8).text());
  
  
  bonus_string = $(this).text().replace(/\n|\r/g, "|");
  if (should_select_row(rate, bonus, duration, deadline) && claim_automatically)
  {
    if (max_duration<=0)
    {
      toggle_autoclaim();
    }
    $(this).find(".btn").click();
    console.log(bonus_string);
    max_duration -= duration;
  }
}

loop_rows = function ()
{
  $("tr.clickable_row").each(parse_row);
}

create_button = function()
{
    if ($(".auto-refresh").length === 0)
    {
        autorefresh_button = "<a class = 'btn btn-icon auto-refresh'>Stop Autorefreshing</a>";
        autoclaim_button = "<a class = 'btn btn-icon auto-claim'>Stop Autoclaiming</a>"
        $("#main_container .btn-icon").parent().append(autorefresh_button);
        $("#main_container .btn-icon").parent().append(autoclaim_button);
        $(".auto-refresh").click(toggle_autorefresh);
        $(".auto-claim").click(toggle_autoclaim);
        if (!interval_id)
        {
            $(".auto-refresh").text("Start Autorefreshing");
        }
        if(!claim_automatically)
        {
          $(".auto-claim").text("Start Autoclaiming");
        }
    }
}

toggle_autorefresh = function()
{
 if (!interval_id)
 {
      interval_id = setInterval(function(){$(".btn.btn-icon").not(".auto-refresh").not(".auto-claim").click(); }, interval_duration);
      $(".auto-refresh").text("Stop Autorefreshing");
 }
 else
 {
    clearInterval(interval_id);
    interval_id = null;
    $(".auto-refresh").text("Start Autorefreshing");
 }
}

toggle_autoclaim = function()
{
  claim_automatically = !claim_automatically;
  if (claim_automatically)
  {
    $('.auto-claim').text("Stop Autoclaiming");
  }
  else
  {
    $('.auto-claim').text("Start Autoclaiming");
  }
}


if (window.location.href === "https://jobs.3playmedia.com/available_jobs")
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
    setInterval(loop_rows, 100);
}
else
{
  console.log(window.location.href);
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
    if (total === null || isNaN(total))
    {
      return;
    }
    
    now = offsetDate();
    if (Cookies.get('current_date') != now.toDateString())
    {
        Cookies.set ('current_date', now.toDateString(), {expires: 1} );
        Cookies.set('yesterdays_total', total, {expires: 1});
    }
    today = total - parseFloat(Cookies.get('yesterdays_total'));
    if (today < 0)
    {
        Cookies.set('yesterdays_total', 0, {expires: 1});
        today = 0;
    }
    
    $("#current_pay").append('<h2 class = "muted" style = "margin_top: 10px"> $' + today.toFixed(2) + "</h2>");
    $("#current_pay").append('<div class = "secondColor">TODAY</div>');
    $("#footer_nav ul.box_style li").css("height", 210);
}

updatePay();
