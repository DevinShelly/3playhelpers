// Read
	/**
 * Minified by jsDelivr using UglifyJS v3.1.10.
 * Original file: /npm/js-cookie@2.2.0/src/js.cookie.js
 * 
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!function(e){var n=!1;if("function"==typeof define&&define.amd&&(define(e),n=!0),"object"==typeof exports&&(module.exports=e(),n=!0),!n){var o=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=o,t}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var o=arguments[e];for(var t in o)n[t]=o[t]}return n}function n(o){function t(n,r,i){var c;if("undefined"!=typeof document){if(arguments.length>1){if("number"==typeof(i=e({path:"/"},t.defaults,i)).expires){var a=new Date;a.setMilliseconds(a.getMilliseconds()+864e5*i.expires),i.expires=a}i.expires=i.expires?i.expires.toUTCString():"";try{c=JSON.stringify(r),/^[\{\[]/.test(c)&&(r=c)}catch(e){}r=o.write?o.write(r,n):encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=(n=(n=encodeURIComponent(String(n))).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent)).replace(/[\(\)]/g,escape);var s="";for(var f in i)i[f]&&(s+="; "+f,!0!==i[f]&&(s+="="+i[f]));return document.cookie=n+"="+r+s}n||(c={});for(var p=document.cookie?document.cookie.split("; "):[],d=/(%[0-9A-Z]{2})+/g,u=0;u<p.length;u++){var l=p[u].split("="),C=l.slice(1).join("=");this.json||'"'!==C.charAt(0)||(C=C.slice(1,-1));try{var g=l[0].replace(d,decodeURIComponent);if(C=o.read?o.read(C,g):o(C,g)||C.replace(d,decodeURIComponent),this.json)try{C=JSON.parse(C)}catch(e){}if(n===g){c=C;break}n||(c[g]=C)}catch(e){}}return c}}return t.set=t,t.get=function(e){return t.call(t,e)},t.getJSON=function(){return t.apply({json:!0},[].slice.call(arguments))},t.defaults={},t.remove=function(n,o){t(n,"",e(o,{expires:-1}))},t.withConverter=n,t}return n(function(){})});

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
updateDisplay = function(speed)
{
    working_time = parseInt(Cookies.get('working_time'));
    hours = Math.floor(working_time/1000/3600);
    minutes = Math.floor((working_time-hours * 1000 * 3600)/60/1000);
    seconds = Math.floor((working_time-hours*1000*3600 - minutes*1000*60)/1000);
    while ($("#speed-display").length === 0)
    {
        $($(".btn-group:last")).after("<div class = 'btn-group' id = 'speed-display'></div>")
    }
    $("#speed-display").text("Speed: " + speed + " | Time clocked: " + hours + "h, " + minutes + "m");//, " + seconds + "s");
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
      Cookies.set("default_speed", speed.val());
    }
}

previousSpeed = parseFloat(Cookies.get("default_speed") || 2.0);
toggleSpeed = function()
{
    speed = $("*[ng-model='ctrl.userSetting.video_playback_rate']");
    currentSpeed = parseFloat(speed.val());
    if (currentSpeed != 1.0)
    {
        changeSpeed(1.0 - currentSpeed);
        previousSpeed = currentSpeed;
    }
    elsejQuery.event.trigger({ type : 'keypress', which : character.charCodeAt(0) });
    {
        changeSpeed(previousSpeed - currentSpeed);
    }
}

updateTimeWorked = function()
{
    now = offsetDate();
    if (Cookies.get('current_date') != now.toDateString())
    {
        Cookies.set('current_date', now.toDateString(), {expires: 1});
        Cookies.set('working_time', 0, {expires: 1});
    }
    last_keypress = parseInt(Cookies.get('last_keypress'));
    if(isNaN(last_keypress))
    {
        last_keypress = now.getTime();
    }
    working_time = parseInt(Cookies.get('working_time'));
    Cookies.set('last_keypress', now.getTime(), {expires: 1});
    elapsed_time = Math.max(0, now.getTime() - last_keypress);
    if (elapsed_time < 5000)
    {// Read
	/**
 * Minified by jsDelivr using UglifyJS v3.1.10.
 * Original file: /npm/js-cookie@2.2.0/src/js.cookie.js
 * 
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!function(e){var n=!1;if("function"==typeof define&&define.amd&&(define(e),n=!0),"object"==typeof exports&&(module.exports=e(),n=!0),!n){var o=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=o,t}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var o=arguments[e];for(var t in o)n[t]=o[t]}return n}function n(o){function t(n,r,i){var c;if("undefined"!=typeof document){if(arguments.length>1){if("number"==typeof(i=e({path:"/"},t.defaults,i)).expires){var a=new Date;a.setMilliseconds(a.getMilliseconds()+864e5*i.expires),i.expires=a}i.expires=i.expires?i.expires.toUTCString():"";try{c=JSON.stringify(r),/^[\{\[]/.test(c)&&(r=c)}catch(e){}r=o.write?o.write(r,n):encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=(n=(n=encodeURIComponent(String(n))).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent)).replace(/[\(\)]/g,escape);var s="";for(var f in i)i[f]&&(s+="; "+f,!0!==i[f]&&(s+="="+i[f]));return document.cookie=n+"="+r+s}n||(c={});for(var p=document.cookie?document.cookie.split("; "):[],d=/(%[0-9A-Z]{2})+/g,u=0;u<p.length;u++){var l=p[u].split("="),C=l.slice(1).join("=");this.json||'"'!==C.charAt(0)||(C=C.slice(1,-1));try{var g=l[0].replace(d,decodeURIComponent);if(C=o.read?o.read(C,g):o(C,g)||C.replace(d,decodeURIComponent),this.json)try{C=JSON.parse(C)}catch(e){}if(n===g){c=C;break}n||(c[g]=C)}catch(e){}}return c}}return t.set=t,t.get=function(e){return t.call(t,e)},t.getJSON=function(){return t.apply({json:!0},[].slice.call(arguments))},t.defaults={},t.remove=function(n,o){t(n,"",e(o,{expires:-1}))},t.withConverter=n,t}return n(function(){})});

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
updateDisplay = function(speed)
{
    working_time = parseInt(Cookies.get('working_time'));
    hours = Math.floor(working_time/1000/3600);
    minutes = Math.floor((working_time-hours * 1000 * 3600)/60/1000);
    seconds = Math.floor((working_time-hours*1000*3600 - minutes*1000*60)/1000);
    while ($("#speed-display").length === 0)
    {
        $($(".btn-group:last")).after("<div class = 'btn-group' id = 'speed-display'></div>")
    }
    $("#speed-display").text("Speed: " + speed + " | Time clocked: " + hours + "h, " + minutes + "m");//, " + seconds + "s");
}

changeSpeed = function(changeBy, updateCookie)
{
//     <input type="range" ng-model="ctrl.userSetting.video_playback_rate" min="0.5" max="2" step="0.1" class="ng-valid ng-not-empty ng-dirty ng-valid-parse ng-touched">
    speed = $("*[ng-model='ctrl.userSetting.video_playback_rate']");
    speed.attr("max", 4);
    speed.val(parseFloat(speed.val()) + changeBy);
    angular.element(speed).triggerHandler("input");
    updateDisplay(speed.val());
}

previousSpeed = 2.0;
toggleSpeed = function()
{
    speed = $("*[ng-model='ctrl.userSetting.video_playback_rate']");
    currentSpeed = parseFloat(speed.val());
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
        Cookies.set('current_date', now.toDateString(), {expires: 1});
        Cookies.set('working_time', 0, {expires: 1});
    }
    last_keypress = parseInt(Cookies.get('last_keypress'));
    if(isNaN(last_keypress))
    {
        last_keypress = now.getTime();
    }
    working_time = parseInt(Cookies.get('working_time'));
    Cookies.set('last_keypress', now.getTime(), {expires: 1});
    elapsed_time = Math.max(0, now.getTime() - last_keypress);
    if (elapsed_time < 5000)
    {
        working_time = working_time + elapsed_time;
        Cookies.set('working_time', working_time, {expires: 1});
    }
    changeSpeed(0.0);
}

previousSpace = Date.now();

initialToggle = false;
document.onkeydown = function(e)
{
    if (!initialToggle)
    {
      initialToggle = true;
      toggleSpeed();
      updateTimeWorked();
    }
  
    threshhold = 1.0;
    if (Math.random() < threshhold)
    {
        updateTimeWorked();
    }
    
    leftBracket = 219;
    rightBracket = 221;
    space = 32;
    f5 = 116;
    k = 75;
    d = 68;
    
    console.log(e.which);
    
    if (!e.ctrlKey && e.which != f5 && !(e.which == space && e.shiftKey) && !e.altKey && e.which<96)
    {
        return;
    }
    
    console.log(e.shiftKey);
    if (e.which >=96 && e.which <=105)
    {
      macroWords = $("[ng-model='macroData.words']");
      macroSpeakers = $("[ng-click='ctrl.toggleMacroSpeakerLabel(macroData.id)']");
      index = e.which-97;
      if (index<0)
      {
        index = 9;
      }
      macroWord = $(".user-selected").text().trim();
      if(macroWord.split("||").length == 2)
      {
        key = macroWord.split("||")[0];
        value = macroWord.split("||")[1];
        localStorage.setItem(key, value);
        macroWord = key;
      }
      
      if (localStorage.getItem(macroWord.toLowerCase()))
      {
        key = macroWord;
        macroWord = localStorage.getItem(macroWord.toLowerCase());
      }
      
      angular.element($(".user-selected")).scope().cell.words = macroWord;
      angular.element($(".user-selected")).scope().cell.dirty = true;
      angular.element($(".user-selected")).scope().$apply();
      
      is_speaker = macroWord[macroWord.length-1] == ":";
      
      macroWords[index].value = macroWord;
      $(macroWords[index]).trigger("input");
      speaker_checked = macroSpeakers[index].value == "true";
      if(speaker_checked != is_speaker)
      {
        $(macroSpeakers[index]).click();
      }
      e.preventDefault();
      
    }
    
    switch (e.which)
    {
        case leftBracket:
            changeSpeed(-0.1, true);
            break;
        case rightBracket:
            changeSpeed(0.1, true);
            break;
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
    }
}

setInterval(function (){$(".col-md-6").eq(1).prepend($(".panel-open").eq(1))}, 100);
        working_time = working_time + elapsed_time;
        Cookies.set('working_time', working_time, {expires: 1});
    }
    changeSpeed(0.0);
}

previousSpace = Date.now();

initialToggle = false;
document.onkeydown = function(e)
{
    if (!initialToggle)
    {
      initialToggle = true;
      toggleSpeed();
      updateTimeWorked();
    }
  
    threshhold = 1.0;
    if (Math.random() < threshhold)
    {
        updateTimeWorked();
    }
    
    leftBracket = 219;
    rightBracket = 221;
    space = 32;
    f5 = 116;
    k = 75;
    d = 68;
    
    if (!e.ctrlKey && e.which != f5 && !(e.which == space && e.shiftKey) && !e.altKey)
    {
        return;
    }
    
    switch (e.which)
    {
        case leftBracket:
            changeSpeed(-0.1, true);
            break;
        case rightBracket:
            changeSpeed(0.1, true);
            break;
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
    }
}

setInterval(function (){$(".col-md-6").eq(1).prepend($(".panel-open").eq(1))}, 100);
