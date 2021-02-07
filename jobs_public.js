keypress_timeout = 1; //this is how long between keypresses/mouse movement before it stops counting you as working
midnight_offset = 0; //this is when a new day starts for record keeping purposesin hours. 0 is midnight, 1 is 1 AM, -1 is 11 PM, etc
previousSpeed = 1.0; //this sets the default speed you start a file at when you open it

// Read
/**
 * Minified by jsDelivr using UglifyJS v3.1.10.
 * Original file: /npm/js-cookie@2.2.0/src/js.cookie.js
 * 
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
! function(e) {
  var n = !1;
  if ("function" == typeof define && define.amd && (define(e), n = !0), "object" == typeof exports && (module.exports = e(), n = !0), !n) {
    var o = window.Cookies,
      t = window.Cookies = e();
    t.noConflict = function() {
      return window.Cookies = o, t
    }
  }
  
}(function() {
  function e() {
    for (var e = 0, n = {}; e < arguments.length; e++) {
      var o = arguments[e];
      for (var t in o) n[t] = o[t]
    }
    return n
  }

  function n(o) {
    function t(n, r, i) {
      var c;
      if ("undefined" != typeof document) {
        if (arguments.length > 1) {
          if ("number" == typeof(i = e({
              path: "/"
            }, t.defaults, i)).expires) {
            var a = new Date;
            a.setMilliseconds(a.getMilliseconds() + 864e5 * i.expires), i.expires = a
          }
          i.expires = i.expires ? i.expires.toUTCString() : "";
          try {
            c = JSON.stringify(r), /^[\{\[]/.test(c) && (r = c)
          } catch (e) {}
          r = o.write ? o.write(r, n) : encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent), n = (n = (n = encodeURIComponent(String(n))).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)).replace(/[\(\)]/g, escape);
          var s = "";
          for (var f in i) i[f] && (s += "; " + f, !0 !== i[f] && (s += "=" + i[f]));
          return document.cookie = n + "=" + r + s
        }
        n || (c = {});
        for (var p = document.cookie ? document.cookie.split("; ") : [], d = /(%[0-9A-Z]{2})+/g, u = 0; u < p.length; u++) {
          var l = p[u].split("="),
            C = l.slice(1).join("=");
          this.json || '"' !== C.charAt(0) || (C = C.slice(1, -1));
          try {
            var g = l[0].replace(d, decodeURIComponent);
            if (C = o.read ? o.read(C, g) : o(C, g) || C.replace(d, decodeURIComponent), this.json) try {
              C = JSON.parse(C)
            } catch (e) {}
            if (n === g) {
              c = C;
              break
            }
            n || (c[g] = C)
          } catch (e) {}
        }
        return c
      }
    }
    return t.set = t, t.get = function(e) {
      return t.call(t, e)
    }, t.getJSON = function() {
      return t.apply({
        json: !0
      }, [].slice.call(arguments))
    }, t.defaults = {}, t.remove = function(n, o) {
      t(n, "", e(o, {
        expires: -1
      }))
    }, t.withConverter = n, t
  }
  return n(function() {})
});

scope = function() {
  return angular.element($(".user-selected")).scope() || angular.element($(".active-cell")).scope();
}

//Adds the following functunality to within a job
// Ctr + [ decreases playback speed by 0.1
// Ctr + ] increases playback speed by 0.1
// Double tapping Shift + Space will toggle between a speed of 1.0 and your previous non-1.0 speed


//Speed functions
speed = function(){
  speed_dom = $("*[ng-model='ctrl.userSetting.video_playback_rate']");
  return speed_dom;
}

finished = 0;

updateDisplay = function() {
  
  if ($("#speed-display").length === 0) 
  {
    $(".btn-group:last").after("<div class = 'btn-group' id = 'speed-display'></div>")
    setTimeout(updateDisplay, 100);
  }
  
  working_time = parseInt(Cookies.get('working_time'));
  daily_hours = Math.floor(working_time / 1000 / 3600);
  daily_minutes = Math.floor((working_time - daily_hours * 1000 * 3600) / 60 / 1000);
  daily_seconds = Math.floor((working_time - daily_hours * 1000 * 3600 - daily_minutes * 1000 * 60) / 1000);
  daily_text = "Daily clocked: " + daily_hours + "h, " + daily_minutes + "m";
  
  file_working_hours = parseInt(getFilesData()[parseID()].working_time)/1000/3600;
  file_hours = Math.floor(file_working_hours);
  file_minutes = Math.floor(file_working_hours*60-file_hours*60);
  file_seconds = Math.floor(file_working_hours*3600 -file_minutes*60 - file_hours*3600);
  file_text = "File clocked: " + (file_hours ? file_hours + "h, " + file_minutes + "m" : file_minutes + "m, " + file_seconds + "s");
  times = $(".tp-transcript-controls div span").eq(3).text();
  current_time = times.split("/")[0].trim().split(":");
  max_time = times.split("/")[1].trim().split(":");
  current_seconds = parseFloat(current_time[0])*3600 + parseFloat(current_time[1])*60 + parseFloat(current_time[2]);
  max_seconds = parseFloat(max_time[0])*3600 + parseFloat(max_time[1])*60 + parseFloat(max_time[2]);
  percentage = finished || current_seconds/max_seconds;
  pay_rate = parsePay()/file_working_hours*percentage;
  pay_text = "Pay rate: $" + pay_rate.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
  speed_text = "Speed: " + speed().val();
  $("#speed-display").text(speed_text + " | " + daily_text + " | " + file_text + " | " + pay_text);
}

setTimeout(function()
{
  $(".fa-check").parent().click(function()
  {
    finished = 1.0;
  });
}, 5000);

changeSpeed = function(changeBy, updatePrev = true)
{
  speed().val(parseFloat(speed().val()) + changeBy);
  angular.element(speed()).triggerHandler("input");
  if (updatePrev)
  {
    previousSpeed = parseFloat(speed().val());
  }
  updateDisplay();
}

toggleSpeed = function() {
  
  currentSpeed = parseFloat(speed().val());
  if (currentSpeed != 1.0) 
  {
    previousSpeed = currentSpeed;
    setSpeed(1.0, false);
  } 
  else 
  {
    setSpeed(previousSpeed);
  }
}

setSpeed = function(newSpeed, updatePrev = true)
{
  currentSpeed = parseFloat(speed().val());
  changeSpeed(newSpeed - currentSpeed, updatePrev);
}

updateTimeWorked = function() 
{
  //Prevents errors from being thrown before file fully loads
  if(!scope())
  {
    return;
  }
  
  midnight = midnight = new Date();
    midnight.setHours(23 + midnight_offset, 59, 59, 0);
  if (!Cookies.get('working_time'))
  {
    Cookies.set ('working_time', 0, {expires: midnight});
  }
  now = new Date();
  last_keypress = parseInt(Cookies.get('last_keypress') || now.getTime());
  if (isNaN(last_keypress)) {
    last_keypress = now.getTime();
  }
  
  Cookies.set('last_keypress', (new Date()).getTime(), {
    expires: new Date(now.getTime() + keypress_timeout*1000*60)
  });
  elapsed_time = now.getTime() - last_keypress;
  
  working_time = parseInt(Cookies.get('working_time'));
  Cookies.set('working_time', working_time + elapsed_time);
  updateFileWorkingTime(elapsed_time);
  updateDisplay();
}

updateFileWorkingTime = function(ellapsed_time) 
{
  files_data = getFilesData();
  files_data[parseID()].working_time += ellapsed_time;
  localStorage.setItem("files_data",  JSON.stringify(files_data));
}

numberTriggered = function()
{
  single_digit_numbers = {"0":"zero", "1":"one", "2": "two", "3": "three", "4":"four", "5":"five", "6":"six", "7":"seven", "8":"eight", "9":"nine", 
  "zero":"0", "one":"1", "two":"2", "three":"3", "four":"4", "five":"5", "six":"6", "seven":"7", "eight":"8", "nine":"9"}; 
  word = scope().cell.words;
  
  //Flips between words/digits for single digit numbers
  if(single_digit_numbers[word.toLowerCase()])
  {
    scope().cell.setWords(single_digit_numbers[word.toLowerCase()]);
    scope().$apply();
    return true;
  }
  
  //Handles adding/removing an apostrophe before two digit numbers
  if(word[0] == "'" && !isNaN(word.substr(1)))
  {
    scope().cell.setWords(word.substr(1));
    scope().$apply();
    return true;
  }
  if(!isNaN(word) && word.length == 2)
  {
    scope().cell.setWords("'" + word);
    scope().$apply();
    return true;
  }
  
  //Inserts/removes commas into four digit numbers
  if(!isNaN(word))
  {
    decimal = word.split(".");
    wholenumber = parseInt(decimal[0]).toLocaleString("en-us");
    decimal = decimal[1] ? "." + decimal[1] : "";
    scope().cell.setWords(wholenumber + decimal);
    scope().$apply();
    return true;
  }
  if(!isNaN(word.split(",").join("")))
  {
    scope().cell.setWords(word.split(",").join(""));
    scope().$apply();
    return true;
  }
  
  return false;
}

macroTriggered = function(e) 
{
  index = e.which > 57 ? e.which - 97 : e.which - 49;
  
  var word;
  if (index < 0) 
  {
    index = 9;
  }
  
  words = JSON.parse(localStorage.getItem("words") || "{}");
  word = scope().cell.words;
  if (word.split("|").length == 2) 
  {
    key = word.split("|")[0];
    value = word.split("|")[1];
    words[key] = value;
    try
    {
      localStorage.setItem("words", JSON.stringify(words));
    }
    catch
    {
      alert("You are out of storage and cannot add any additional custom macros");
    }
    word = key;
  }
  
  word = words[word.toLowerCase()] || word;
  
  scope().cell.setWords(word);
  scope().$apply();
}

previousSpace = Date.now();
initialToggle = false;

clearSpeakerID = function() {
  if (scope().cell.speakerLabel) 
  {
    scope().cell.setWords("");
    scope().$apply();
  }
}

followid = null;
$("body").attr("tabindex", -1);

//Block new window/tab from opening
$("body").keydown(function(e)
{
  if (e.ctrlKey && (e.which == 78 || e.which == 84))
  {
    e.stopPropagation();
    e.preventDefault();
    console.log("attempting to block new window/tab");
  }
});

//Prevent accidentally changing playback speed
$("body").keydown(function(e){
  if(e.ctrlKey && (e.which == 187 || e.which == 189))
  {
    e.stopPropagation();
  }
});

//Block Ctrl-J from clearing the cell 
$("body").keydown(function(e) {
  if (e.ctrlKey && e.which == 74) //ctrl + j
  {
    e.stopPropagation();
    e.preventDefault();
  }
});

//Update the timeworked and stop following the cursor with every keypress
$("body").keydown(function(e) {
  updateTimeWorked();
  clearInterval(followid);
});

$("body").keydown(function(e) {
  if (e.ctrlKey && e.shiftKey && ((e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105))) 
  {
    macroTriggered(e);
  }
});

$("body").keydown(function(e) {
  if (e.which == 122 || e.which == 123 || e.which == 192)
  {
    if(!numberTriggered())
    {
      macroTriggered(e);
    }
  }
})

$("body").keydown(function(e) {
  if (e.ctrlKey && !e.shiftKey && ((e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105))) {
    clearSpeakerID();
  }
});

$("body").keydown(function(e) {
  if(e.altKey && e.which == 68)
  {
    clearSpeakerID();
    console.log("clearing ID");
  }
});

$("body").keydown(function(e) {
  if (e.shiftKey && e.which == 32) {
    if (Date.now() - previousSpace < 500) {
      toggleSpeed();
    }
    previousSpace = Date.now(0);
  }
});

$("body").keydown(function(e) {
  if (e.ctrlKey && e.which == 77) {
    removeHyphen(e);
  }
});

$("body").keydown(function(e) {
  if (e.ctrlKey && e.which == 76) {
    splitHyphen(e);
  }
});

$("body").keydown(function(e) {
  if (e.ctrlKey && e.shiftKey && e.which == 39) {
    followid = setInterval(function() {
      $(".video-highlighted").click()
    }, 10);
  }
});

$("body").keydown(function(e) {
  if (e.ctrlKey && e.which == 68 && !e.shiftKey) {
    words = scope().cell.words;
    if (words.endsWith("--")) {
      scope().cell.setWords("--" + words.substr(0, words.length-2).toLowerCase());
      
    } else if (words.startsWith("--")) {
      scope().cell.setWords(words.substr(2));
    }
    else
    {
      scope().cell.setWords(words + "--");
    }
    scope().$apply();
    e.stopPropagation();
    
  }
});

//Ctrl-P now spells a word instead of previewing it
$("body").keydown(function(e) {
  if (e.ctrlKey && e.which == 80) {
    word = scope().cell.words;
    spelledWord = "";
    for (char of word) {
      spelledWord = spelledWord + char + "-";
    }
    spelledWord = spelledWord.substr(0, spelledWord.length - 1).toUpperCase();
    if(spelledWord.split("---").length>1)
    {
      spelledWord = spelledWord.split("---").join("").toLowerCase();
    }
    scope().cell.setWords(spelledWord);
    scope().$apply();
    e.stopPropagation();
  }
});

transcriptActive = function() {
  return $(".user-selected").length > 0 && $(document.activeElement).hasClass("tp-transcript");
}

$("body").keydown(function(e) {
  if (e.ctrlKey && !e.shiftKey && (e.which == 67 || e.which == 88)  && transcriptActive()) //Ctrl-C or Ctrl-X copies cell contents to clipboard
  {
    navigator.clipboard.writeText($(".user-selected").text().trim());
  }
});

$("body").keydown(function(e) {
  if (e.ctrlKey && !e.shiftKey && e.which == 86 && transcriptActive()) //Ctrl-V pastes from clipboard
  {
    navigator.clipboard.readText().then(
      clipText => pasteWord(clipText));
    e.stopPropagation();
  }
});

characterSet = characterSet = [32,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,49,50,51,52,53,54,55,56,57,48,45,34,47,39,44,46,45,58,91,93,35,33,64,40,41,36,37,38,225,233,237,243,250];
/* Have to convert the characterSet to charCodes for encoding reasons(?) using the following

  characters = " abcdefghijklmnopqrstuvwxyz1234567890-\"/',.-:[]#!@()$%&áéíóú";
  characterSet = [];
  for (character of characters)
  {
    characterSet.push(character.charCodeAt(0));
  }
  console.log("characterSet = " + JSON.stringify(characterSet));
*/

pasteWord = function(word) {
  for (char of word.toLowerCase()) {
    if (characterSet.indexOf(char.charCodeAt(0)) == -1) {
      return;
    }
  }
  scope().cell.setWords(word);
  scope().$apply();
};

lastGoogleTap = null;
$("body").keydown(function(e) { //Automatically copies the current cell contents into the Google search box and opens a search
  if (e.ctrlKey && e.which == 71)
  {
    if (Date.now() - lastGoogleTap < 2000)
    {
      $("#google").val($(".user-selected").text().trim());
      $("#google").parent().submit();
    }
    lastGoogleTap = Date.now();
  }
});

removeHyphen = function(e) {
  words = scope().cell.words;
  if (words.replace("-", "") != words && words[words.length - 1] != "-") {
    scope().cell.setWords(words.replace("-", ""));
    scope().$apply();
    e.stopPropagation();
    e.preventDefault();
  }
}

splitHyphen = function() {
  if (scope().cell.words.replace("-", "") != scope().cell.words) {
    scope().cell.setWords(scope().cell.words.replace("-", " "));
    scope().$apply();
  }
}

parseDuration = function() {
  return $(".tab-pane:eq(6) td.ng-binding:eq(13)").text();
}

parsePay = function() {
  return parseFloat($(".tab-pane:eq(6) td.ng-binding:eq(15)").text().substr(1));
}

parseName = function() {
  return $(".tab-pane:eq(6) td.ng-binding:eq(3)").text();
}

parseID = function() {
  return $(".tab-pane:eq(6) td.ng-binding:eq(1)").text();
}

parsePay = function() {
  return parseFloat($(".tab-pane:eq(6) td.ng-binding:eq(15)").text().replace("$", ""));
}

parseRate = function() {
  parts = parseDuration().split(":");
  minutes = parseFloat(parts[0]*60) + parseFloat(parts[1]) + parseFloat(parts[2])/60;
  return parsePay()/minutes;
}

getFilesData = function() {
  return JSON.parse(localStorage.getItem("files_data") || "{}");
}

saveFileData = function() 
{
  files_data = getFilesData();
  file_data = files_data[parseID()];
  
  if (!file_data) 
  {
    file_data = {};
    file_data.working_time = 0;
    file_data.pay = parsePay();
    file_data.duration = parseDuration();
    file_data.name = parseName();
    
  } 
  else 
  {
    file_data.payRate = parseFloat(parsePay())/(parseFloat(file_data.working_time)/3600/1000).toFixed(2);
  }
  
  files_data[parseID()] = file_data;
  
  try 
  {
    localStorage.setItem("files_data", JSON.stringify(files_data));
  } 
  catch (error) 
  {
    sortedFileIDs = Object.keys(filesData).sort(function(a, b) {return parseInt(a) > parseInt(b)});
    delete filesData[sortedFileIDs[0]];
    delete filesData[parseID()];
    localStorage.setItem("files_data", JSON.stringify(filesData));
    saveFileData();
  }
}

onStartup = function() {
  //If the file has yet to fully load, try again
  if (!$(".active-cell").length) {
    setTimeout(onStartup, 100);
    return;
  }
  
  //initially save the file data if first time opened
  if (!getFilesData()[parseID()]) 
  {
    saveFileData();
  }
  //toggle the speed to the initial setting
  toggleSpeed();
  
  //bring the special instructions to the top right
  $(".col-md-6").eq(1).prepend($(".panel-open").eq(1));
  
  //save the file data on finish
  $("#finish-dropdown a").mousedown(saveFileData);
}

onStartup();

document.onmousemove = updateTimeWorked;
