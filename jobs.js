keypress_timeout = 1; //this is how long in minutes between keypresses/mouse movement before it stops counting you as working
midnight_offset = 6; //this is when a new day starts for record keeping purposesin hours. 0 is midnight, 1 is 1 AM, -1 is 11 PM, etc
previousSpeed = 2.0; //this sets the default speed you start a file at when you open it
context_sensitive_macro_keys = [123, 192]; //these are the keycodes for backtick (`) and F12. These trigger a context sensitive macro  
                                          //for a different key, go to keycode.io, hit it, and then add it to the array
should_not_advance = false;
autospeedup = true;
should_capitalize_hyphenated_words = true;
default_to_music = true;
start_music_slow = false;
switch_to_low_quality = true;

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

transcript = function() {
  return scope().cell.transcript;
}

//Adds the following functunality to within a job
// Ctr + [ decreases playback speed by 0.1
// Ctr + ] increases playback speed by 0.1
// Double tapping Shift + Space will toggle between a speed of 1.0 and your previous non-1.0 speed
// Also increases the maximum speed from 2.0 to 4.0, at which point the audio cuts out


//Speed functions
speed = function(){
  speed_dom = $("*[ng-model='ctrl.userSetting.video_playback_rate']");
  speed_dom.attr("max", 8);
  return speed_dom;
}


starting_seconds = 0;

$("body").keydown(function(e)
{
  if (e.ctrlKey && e.shiftKey && e.which == 13)
  {
    starting_seconds = parseFloat(scope().cell.timestamp)/1000;
    //console.log()
  }
});

updateDisplay = function() {
  working_time = parseInt(Cookies.get('working_time'));
  daily_hours = Math.floor(working_time / 1000 / 3600);
  daily_minutes = Math.floor((working_time - daily_hours * 1000 * 3600) / 60 / 1000);
  daily_seconds = Math.floor((working_time - daily_hours * 1000 * 3600 - daily_minutes * 1000 * 60) / 1000);
  daily_text = "Daily clocked: " + daily_hours + "h, " + daily_minutes + "m";
  if ($("#speed-display").length === 0) {
    $($("#duplicate_data")).after("<div class = 'btn-group' id = 'speed-display'></div>")
    setTimeout(updateDisplay, 100);
  }
  
  file_working_hours = parseInt(getFilesData()[parseID()].working_time)/1000/3600;
  file_hours = Math.floor(file_working_hours);
  file_minutes = Math.floor(file_working_hours*60-file_hours*60);
  file_seconds = Math.floor(file_working_hours*3600 -file_minutes*60 - file_hours*3600);
  file_text = "File clocked: " + (file_hours ? file_hours + "h, " + file_minutes + "m" : file_minutes + "m, " + file_seconds + "s");
  times = $(".tp-transcript-controls div span").eq(3).text();
  current_time = times.split("/")[0].trim().split(":");
  max_time = times.split("/")[1].trim().split(":");
  current_seconds = Math.max(0, parseFloat(current_time[0])*3600 + parseFloat(current_time[1])*60 + parseFloat(current_time[2]) - starting_seconds);
  max_seconds = parseFloat(max_time[0])*3600 + parseFloat(max_time[1])*60 + parseFloat(max_time[2]) - starting_seconds;
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
  setSpeed(parseFloat(speed().val()) + changeBy, updatePrev);
}

toggleSpeed = function() {
  
  var currentSpeed = parseFloat(speed().val());
  if (currentSpeed != 1.0 && !(currentSpeed == 8.0 && previousSpeed != 8.0)) 
  {
    setSpeed(1.0, false);
  } 
  else 
  {
    setSpeed(previousSpeed);
  }
}

setSpeed = function(newSpeed, updatePrev = true)
{
  speed().val(newSpeed);
  angular.element(speed()).triggerHandler("input");
  updateDisplay();
  
  if (updatePrev)
  {
    previousSpeed = parseFloat(speed().val());
  }
}

last_keypress = new Date().getTime();
updateTimeWorked = function() 
{
  now = new Date();
  if(!scope() || now.getTime() - last_keypress < 1000)
  {
    return;
  }
  
  midnight = new Date(now);
  midnight.setHours(24, 0, midnight_offset*60*60, 0);

  if(midnight.getTime() - now.getTime() > 24*60*60*1000)
  {
    midnight.setDate(midnight.getDate() - 1);
  }
  else if(midnight.getTime() - now.getTime() < 0)
  {
    midnight.setDate(midnight.getDate() + 1);
  }
  
  if (!Cookies.get('working_time'))
  {
    Cookies.set ('working_time', 0, {expires: midnight});
  }
  
  last_keypress = parseInt(Cookies.get('last_keypress') || now.getTime());
  
  Cookies.set('last_keypress', (new Date()).getTime(), {
    expires: new Date(now.getTime() + keypress_timeout*1000*60)
  });
  elapsed_time = now.getTime() - last_keypress;
  
  working_time = parseInt(Cookies.get('working_time'));
  Cookies.set('working_time', working_time + elapsed_time, {expires: midnight});
  updateFileWorkingTime(elapsed_time);
  updateDisplay();
}

updateFileWorkingTime = function(ellapsed_time) {
  files_data = getFilesData(); 
  file_data = files_data[parseID()];
  files_data[parseID()].working_time += ellapsed_time;
  localStorage.setItem("files_data",  JSON.stringify(files_data));
}

setMacro = function(word, isSpeaker, index) {
  macroWords = $("[ng-model='macroData.words']");
  macroSpeakers = $("[ng-click='ctrl.toggleMacroSpeakerLabel(macroData.id)']");
  macroWords[index].value = word;
  $(macroWords[index]).trigger("input");
  speakerChecked = macroSpeakers[index].value == "true";
  if (speakerChecked != isSpeaker) {
    $(macroSpeakers[index]).click();
  }
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
    return;
  }
  
  //Handles adding/removing an apostrophe before two digit numbers to denote a year and decades that end in s
  if(word[0] == "'" && !isNaN(word.substr(1, 2)))
  {
    scope().cell.setWords(word.substr(1));
    scope().$apply();
    return;
  }
  
  //console.log(word);
  
  if(!isNaN(word.substr(0, 2)) && (word.length == 2 || (word.length == 3 && word[2] == "s")))
  {
    scope().cell.setWords("'" + word);
    scope().$apply();
    return;
  }
  
  //Inserts/removes commas into four digit numbers
  if(!isNaN(word))
  {
    decimal = word.split(".");
    wholenumber = parseInt(decimal[0]).toLocaleString("en-us");
    decimal = decimal[1] ? "." + decimal[1] : "";
    scope().cell.setWords(wholenumber + decimal);
    scope().$apply();
    return;
  }
  if(!isNaN(word.split(",").join("")))
  {
    scope().cell.setWords(word.split(",").join(""));
    scope().$apply();
    return;
  }
}

saveWords = function()
{
  words_string = "words = JSON.parse(localStorage.getItem('words')) || {};";
  words = JSON.parse(localStorage.getItem("words"));
  for (key in words)
  {
    words_string = words_string + "words[`" + key + "`] = `" + words[key] + "`; "
  }
  words_string = words_string + "localStorage.setItem('words', JSON.stringify(words));";
  navigator.clipboard.writeText(words_string);
}

loadWords = function()
{
  navigator.clipboard.readText().then(
      clipText => eval(clipText));
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
    key = word.split("|")[0].toLowerCase();
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
  
  if(word == "saveWords")
  {
    saveWords();
  }
  else if (word == "loadWords")
  {
    loadWords();
  }

  if (e.which >= 122) 
  {
    return;
  }

  isSpeaker = word[word.length - 1] == ":";
  setMacro(word, isSpeaker, index);

  e.preventDefault();
  e.stopPropagation();
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

$("body").keydown(function(e)
{
  if (e.ctrlKey && e.shiftKey && e.which == 221)
  {
    setSpeed(8.0, false);
    autospeedup = true;
  }
});

controlsHidden = false;
$("body").keydown(function(e)
{
  if(e.ctrlKey && e.shiftKey && e.which == 72)
  {
    if (controlsHidden)
    {
      $(".controls-container").show();
      controlsHidden = false;
    }
    else
    {
      $(".controls-container").hide();
      controlsHidden = true;
    }
  }
});


$("body").keydown(function(e)
{
  if (e.ctrlKey && e.shiftKey && e.which == 219)
  {
    if (previousSpeed > 3)
    {
      previousSpeed = 1.5;
    }
    setSpeed(previousSpeed);
    autospeedup = false;
  }
});

//Block new window/tab from opening
$("body").keydown(function(e)
{
  if (e.ctrlKey && (e.which == 78 || e.which == 84))
  {
    e.stopPropagation();
    e.preventDefault();
    //console.log("attempting to block new window/tab");
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
  if (context_sensitive_macro_keys.indexOf(e.which) != -1)
  {
    if(scope().cell.words.length == 0)
    {
      return;
    }
    macroTriggered(e);
    numberTriggered();
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
    //console.log("clearing ID");
  }
});

$("body").keydown(function(e) {
  if (e.ctrlKey && !e.shiftKey && e.which == 219) {
    changeSpeed(-0.1);
    e.preventDefault();
  }
});

$("body").keydown(function(e) {
  if (e.ctrlKey && ! e.shiftKey && e.which == 221) {
    changeSpeed(0.1);
    e.preventDefault();
  }
});

$("body").keydown(function(e) {
  if (e.shiftKey && e.which == 32) {
    if (Date.now() - previousSpace < 500) {
      toggleSpeed();
    }
    previousSpace = Date.now();
  }
});

$("body").keydown(function(e) {
  if (e.ctrlKey && e.which == 77 && !e.shiftKey) {
    removeHyphen(e);
  }
});

$("body").keydown(function(e) {
  if (e.ctrlKey && e.which == 77 && e.shiftKey) {
    formatSong(e);
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
      $(".video-highlighted").click();
      if($(".video-highlighted").attr("timestamp") == $("span[timestamp]").last().attr("timestamp"))
      {
        clearInterval(followid);
      }
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
  //console.log("characterSet = " + JSON.stringify(characterSet));
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
      scope().cell.setFlagged(false);
      $("#google").val(scope().cell.words);
      $("#google").parent().submit();
    }
    lastGoogleTap = Date.now();
  }
});


$("body").keydown(function(e) {
  if(should_not_advance && !e.ctrlKey && !e.shiftKey && !e.altKey && e.which == 190)
  {
    scope().cell.setWords(scope().cell.words + ".");
    scope().cell.editing = true;
    scope().$apply();
    
    e.stopPropagation();
    e.preventDefault();
  }
});

$("body").keydown(function(e) {
  if(should_not_advance && !e.ctrlKey && !e.shiftKey && !e.altKey && e.which == 188)
  {
    scope().cell.setWords(scope().cell.words + ",");
    scope().cell.editing = true;
    scope().$apply();
    
    e.stopPropagation();
    e.preventDefault();
  }
});

$("body").keydown(function(e){
  if(should_capitalize_hyphenated_words && e.shiftKey && !e.ctrlKey && !e.altKey && e.which == 190)
  {
    capitalize_hyphenated_words(e);
  }
});

$("body").keydown(function(e) {
  if(should_not_advance && !e.ctrlKey && e.shiftKey && e.which == 190)
  {
    words = scope().cell.words;
    first_letter = words[0] == words.toLowerCase()[0] ? words.substr(0, 1).toUpperCase() : words.substr(0, 1).toLowerCase();
    //console.log(first_letter);
    scope().cell.setWords(first_letter + words.substr(1, words.length-1));
    scope().cell.editing = true;
    scope().$apply();
    
    e.stopPropagation();
    e.preventDefault();
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

formatSong = function(e) {
  words = scope().cell.words;
  singer = words.split(",")[0].trim();
  title = words.split(",").length == 1 ? "" : '"' + words.split(",")[1].trim() + '"';
  title = title.replace('""', '"').replace('""', '"');
  music = "[MUSIC - " + singer + ", " + title + "]";
  scope().cell.setWords(music.replace(", ]", "]").toUpperCase());
  scope().$apply();
  e.preventDefault();
}

splitHyphen = function() {
  if (scope().cell.words.replace("-", "") != scope().cell.words) {
    scope().cell.setWords(scope().cell.words.replace("-", " "));
    scope().$apply();
  }
}
capitalize_hyphenated_words = function(e){
  words = scope().cell.words;
  hyphenated_words = words.split("-");
  if (hyphenated_words.length < 2 || (words.startsWith("--") && words.slice(2).indexOf("-") == -1))
  {
    return;
  }
  for (i in hyphenated_words)
  {
    if (hyphenated_words[i].toUpperCase()[0] != hyphenated_words[i][0] && hyphenated_words[i].length > 0)
    {
      hyphenated_words[i] = hyphenated_words[i][0].toUpperCase() + hyphenated_words[i].slice(1);
      scope().cell.setWords(hyphenated_words.join("-"));
      scope().$apply();
      e.stopPropagation();
      e.preventDefault();
      return;
    }
  }
  newWords = words.toUpperCase()[0] + words.toLowerCase().slice(1);
  if(words.startsWith("--"))
  {
    newWords = "--" + words.toUpperCase()[2] + words.toLowerCase().slice(3);
  }
  scope().cell.setWords(newWords);
}

loadSpeakerIDs = function() {
  ids = [];
  cells = $(".tp-transcript-paragraph span:first-child").each(function() {
    if (this.textContent.trim()[this.textContent.trim().length - 1] == ":" && ids.indexOf(this.textContent.trim()) == -1) {
      ids.push(this.textContent.trim());
    }
  });

  for (i in ids) {
    id = ids[i];
    setMacro(id, true, i);
  }
}

parseDuration = function() {
  return $(".tab-pane:eq(6) td.ng-binding:eq(13)").text();
}

parsePay = function() {
  return parseFloat($(".tab-pane:eq(6) td.ng-binding:eq(15)").text().substr(1));
}

parseName = function() {
  full_name = $(".tab-pane:eq(6) td.ng-binding:eq(3)").text();
  partial_name = full_name.split(") ").length>1 ? full_name.split(") ")[1] : full_name.split(") ")[0];
  return partial_name;
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

parseProjectName = function() {
   return $(".tab-pane:eq(6) td.ng-binding:eq(7)").text().trim();
}

getFilesData = function() {
  return JSON.parse(localStorage.getItem("files_data") || "{}");
}

getContentData = function() {
  return JSON.parse(localStorage.getItem("content_data") || "{}");
}

getContentData = function() {
  return JSON.parse(localStorage.getItem("content_data") || "{}");
}

getSameDurationFiles = function()
{
  output = {};
  filesData = getFilesData();
  for (id in filesData)
  {
    if(filesData[id].duration.split(".")[0] == parseDuration().split(".")[0])
    {
      output[id] = filesData[id];
    }
  }
  return output;
}

saveFileData = function() 
{
  files_data = getFilesData();
  file_data = files_data[parseID()];
  
  content = transcript().tpTranscriptSaveService.emergencySaveContent();
  content_data = getContentData();
  
  console.log("content");
  console.log(content_data[parseID()]);
  if (!file_data || !content_data[parseID()]) 
  {
    file_data = {};
    file_data.working_time = 0;
    file_data.pay = parsePay();
    file_data.duration = parseDuration();
    file_data.name = parseName();
    file_data.timestamp = Date.now();
    content_data[parseID()] = {};
    content_data[parseID()].original = content;
    
  } 
  else 
  {
    file_data.payRate = parseFloat(parsePay())/(parseFloat(file_data.working_time)/3600/1000).toFixed(2);
    content_data[parseID()].edited = content;
  }
  
  files_data[parseID()] = file_data;
  
  try 
  {   
    localStorage.setItem("files_data", JSON.stringify(files_data));
    localStorage.setItem("content_data", JSON.stringify(content_data));
    
  } 
  catch (error) 
  {
    deleteFileData();
    saveFileData();
  }
}

getSortedFileIDs = function(files_data = null, oldest_to_newest = true)
{
  scalar = oldest_to_newest ? 1 : -1;
  files_data = files_data || getFilesData();
  ids = Object.keys(files_data).sort(function(a, b) {
    let file_a = files_data[a];
    let file_b = files_data[b];
    return scalar * (parseInt(file_a.timestamp) - parseInt(file_b.timestamp));
  });
  return ids;
}

deleteFileData = function(file_id = null)
{
  files_data = getFilesData();
  content_data = getContentData();
  file_id = file_id || getSortedFileIDs()[0];
  delete files_data[file_id];
  delete content_data[file_id];
  localStorage.setItem("files_data", JSON.stringify(files_data));
  localStorage.setItem("content_data", JSON.stringify(content_data));
}

loadFileSelector = function()
{
  $("#duplicate_data").remove();
  select = "<select id = 'duplicate_data'><option value='blank'></option>";
  fileToLoad = null;
  sameDurationFiles = getSameDurationFiles();
  for (id of getSortedFileIDs(sameDurationFiles, false)) {
    name = id != parseID() ? sameDurationFiles[id].name : "Original ASR";
    select = select + "<option value = '" + id + "'>" + name + "</option>";
    console.log(name);
    console.log(parseName());
    console.log(parseName().indexOf(name) + name.indexOf(parseName()));
    if (!fileToLoad && parseName().indexOf(name) + name.indexOf(parseName()) != -2) 
    {
      i = parseInt(id);
      fileToLoad = i;
      setTimeout(function() 
      {
        if(scope().cell.words.indexOf("RETURN RETURN") == -1)
        {
          populateData(null, fileToLoad);
        }
      }, 500);
    }
  }
  select = select + "</select>";
  $($(".btn-group:last")).after(select);
  $("#duplicate_data").change(populateData);
  if(fileToLoad)
  {
    //$("#duplicate_data").val(fileToLoad);
  }
}

fixedData = function(fileData, currentData) {
  output = {
    words: {},
    paragraphs: fileData.paragraphs
  };

  //Copies over the timestamps only from currentData
  for (timestamp in currentData.words) {
    output.words[timestamp] = "";
  }

  //Overwrites the timestamp from the currentFile or creates a new entry in the output
  for (timestamp in fileData.words) {
    output.words[parseInt(timestamp)] = fileData.words[timestamp];
  }

  //Now sort the timestamps
  //If the timestamp exists in the currentData only, examine the two adjacent timestamps
  //Pick the closest timestamp which exists only in the fileData and copy its word into the middle timestampIndex
  //If that timestamp exists in the paragraphs, update it with the location of the new timestampIndex
  //Delete 


  sortedTimesteps = Object.keys(output.words).sort((i, j) => parseInt(i) - parseInt(j));
  selectedTimestamp = parseInt($(".user-selected").attr("timestamp"));
  for (timestepIndex in sortedTimesteps) {
    timestep = parseInt(sortedTimesteps[timestepIndex]);
    inFileData = fileData.words[timestep] != null;
    inCurrentData = currentData.words[timestep] != null;

    //We have an exact match, do nothing
    exactMatch = inFileData && inCurrentData;
    alreadyMoved = !inFileData && !inCurrentData;
    inFileDataOnly = inFileData && !inCurrentData;

    if (exactMatch || alreadyMoved || inFileDataOnly) {
      continue;
    }

    //Now we have a cell that only exists in the currentFile, so move the closest fileData only cell to it
    prevTimestep = parseInt(timestepIndex) > 0 ? parseInt(sortedTimesteps[parseInt(timestepIndex) - 1]) : -Infinity;
    nextTimestep = parseInt(timestepIndex) < sortedTimesteps.length - 1 ? parseInt(sortedTimesteps[parseInt(timestepIndex) + 1]) : Infinity;
    inFileDataPrev = fileData.words[prevTimestep] != null;
    inCurrentDataPrev = currentData.words[prevTimestep] != null;
    inFileDataNext = fileData.words[nextTimestep] != null;
    inCurrentDataNext = currentData.words[nextTimestep] != null;
    prevEligible = inFileDataPrev && !inCurrentDataPrev;
    nextEligible = inFileDataNext && !inCurrentDataNext;

    if (!prevEligible && !nextEligible) {
      continue;
    }

    nextDistance = nextTimestep - timestep;
    prevDistance = prevTimestep - timestep;
    timestepToMove = prevEligible && (!nextEligible || Math.abs(prevDistance) < Math.abs(nextDistance)) ?
      prevTimestep : nextTimestep;
    output.words[timestep] = output.words[timestepToMove];
    delete output.words[timestepToMove];
    delete fileData.words[timestepToMove];

    //Update the paragraphs if needed
    paragraphIndex = output.paragraphs.indexOf(timestepToMove);
    if (paragraphIndex != -1) {
      output.paragraphs.splice(paragraphIndex, 1, timestep);
    }
  }

  return output;
}

populateData = function(e, id, startingRange=null, endingRange=null, data = null)
{
  idToLoad = id ? id : $("#duplicate_data").val();
  if (idToLoad == "blank" && !data) {
    return;
  }
  
  console.log(data);
  
  setSpeed(3.0);
  if(!startingRange)
  {
    startingRange = parseFloat($(".user-selected").first().attr("timestamp"));
  }
  
  if(!endingRange)
  {
    endingRange = parseFloat($("span[timestamp]").last().attr("timestamp"));
  }
  emergencySaveContent = transcript().tpTranscriptSaveService.emergencySaveContent();
  //console.log(getContentData()[idToLoad]);
  //console.log(id);
  unfixedData = idToLoad == parseID() ? getContentData()[idToLoad].original : data || getContentData()[idToLoad].edited;
  fileData = fixedData(unfixedData, emergencySaveContent);

  for (timestamp in fileData.words) 
  {
    //ignore this cell if it falls outside the limited range we want to load
    if(parseInt(timestamp) < startingRange || parseInt(timestamp)>endingRange)
    {
      continue;
    }
    cell = transcript().getCell(timestamp) ? transcript().getCell(timestamp) : transcript().createCell(timestamp, "");
    cell.setWords(fileData.words[timestamp].replace("<i>", "").replace("</i>", ""));
    cell.setItalics(fileData.words[timestamp].indexOf("</i>") != -1);
    scope().$apply();

    if (cell.isFirstInParagraph() && fileData.paragraphs.indexOf(parseInt(timestamp)) == -1 && transcript().findCellParagraph(cell).paragraph > 0) {
      transcript().removeParagraph(transcript().findCellParagraph(cell).paragraph);
    } else if (!cell.isFirstInParagraph() && fileData.paragraphs.indexOf(parseInt(timestamp)) != -1) {
      transcript().makeNewParagraph(cell);
    }
  }
  scope().$apply();
  loadSpeakerIDs();
  if ($(".panel:contains('Speaker Identification - None')").length)
  {
    removeSpeakerIDs();
  }

  //setTimeout(checkadjacentwords, 5000);
}

removeSpeakerIDs = function() {
  first_cells = $(".tp-transcript-paragraph span:first-child");
  for (cell_span of first_cells)
  {
    cell_timestamp = cell_span.getAttribute("timestamp");
    cell = transcript().getCell(cell_timestamp);
    console.log(cell.speakerLabel);
    if (cell.speakerLabel)
    {
      cell.setWords("");
      next_cell_span = cell_span.nextElementSibling;
      next_cell_timestamp = next_cell_span.getAttribute("timestamp");
      next_cell = transcript().getCell(next_cell_timestamp);
      paragraph = transcript().findCellParagraph(cell);
      if(paragraph.index > 0)
      {
        transcript().removeParagraph(paragraph.paragraph);
      }
      transcript().makeNewParagraph(next_cell);
    }
  }
  scope().$apply();
}

checkadjacentwords = function() {

  dirtycells = $("span.cell-dirty");
  //console.log(dirtycells);
  for (let i = 1; i < dirtycells.length - 1; i++) {
    dirtycell = transcript().getCell($(dirtycells[i]).attr("timestamp"));
    prevdirtycell = transcript().getCell($(dirtycells[i - 1]).attr("timestamp"));
    nextdirtycell = transcript().getCell($(dirtycells[i + 1]).attr("timestamp"));
    if (prevdirtycell.originalData.words == dirtycell.words) {
      //prevdirtycell.setWords(dirtycell.words);
      //dirtycell.setWords("");
    }
    if (nextdirtycell.originalData.words == dirtycell.words) {
      nextdirtycell.setWords(dirtycell.words);
      dirtycell.setWords("");
      i = i + 1;
    }
  }
}

shiftright = function() {

  spans = $(".user-selected").parent().children();
  for (let i = spans.length - 2; i--; i > 0) {
    span = spans[i];
    cell = transcript().getCell($(span).attr("timestamp"));
    nextSpan = spans[i + 1];
    nextCell = transcript().getCell($(nextSpan).attr("timestamp"));
    nextCell.setWords(cell.words);
  }
  scope().$apply();
}

shiftleft = function() {

  spans = $(".user-selected").parent().children();
  for (let i = 1; i--; i > spans.length) {
    span = spans[i];
    cell = transcript().getCell($(span).attr("timestamp"));
    prevSpan = spans[i + 1];
    prevCell = transcript().getCell($(prevSpan).attr("timestamp"));
    prevCell.setWords(cell.words);
  }
  scope().$apply();
}

shiftAllLeft = function()
{
  timestamps = Object.keys(transcript().cellMap);
  for(timestamp_index in timestamps)
  {
    cell = transcript().getCell(timestamps[timestamp_index]);
    nextCell = transcript().getCell(timestamps[parseInt(timestamp_index)+1]);
    if(!nextCell)
    {
      continue;
    }
    cell.setWords(nextCell.words);
  }
}

shiftAllRight = function()
{
  timestamps = Object.keys(transcript().cellMap).reverse();
  for(timestamp_index in timestamps)
  {
    cell = transcript().getCell(timestamps[timestamp_index]);
    nextCell = transcript().getCell(timestamps[parseInt(timestamp_index)+1]);
    if(!nextCell)
    {
      continue;
    }
    cell.setWords(nextCell.words);
  }
}

offsetFile = function(id, offsetTime)
{
  content_data = getContentData();
  original = content_data[id];
  
  offset = {edited:{words:{}, paragraphs:[]}};
  for(timestamp in data.words)
  {
    offset.edited.words[parseInt(timestamp) + offsetTime] = original.edited.words[timestamp];
  }
  for(timestamp of original.edited.paragraphs)
  {
    offset.edited.paragraphs.push(parseInt(timestamp)+offsetTime);
  }
  key = id + " " + offsetTime;
  content_data[key] = offset;
  localStorage.setItem("content_data", content_data);
}

//This function fires on startup
finished = 0;

modal_dismissed = false;
onFileLoad = function() 
{
  if (!modal_dismissed && !$(".modal-footer button").click().length)
  {
    setTimeout(onFileLoad, 100);
    return;
  }
  modal_dismissed = true;
  
  if(switch_to_low_quality)
  {
    for(i of $("#video-playback-dropdown li a"))
    {
      if(i.textContent == "Switch to Low Quality Stream" || i.textContent == "Switch to HTML5 Audio")
      {
        i.click();
        switch_to_low_quality = false;
        setTimeout(onFileLoad, 500);
        return;
      }
    }
  }
  
  console.log("Got here");
  
  //If this is the initial loading, save the file first
  if (!getFilesData()[parseID()] || !getContentData()[parseID()]) 
  {
    //console.log("saving file");
    saveFileData();
  }
  //console.log("file exists");
  
  total_cells = $("span[timestamp]").length;
  non_empty_cells = $("span[timestamp]").filter(function() { return ($(this).text().trim().length > 0) }).length;
  
  if(parseFloat(non_empty_cells)/parseFloat(total_cells) < 0.1)
  {
    previousSpeed = 8.0;
    finished = 1.0;
  }
  else if(parseRate() < 0.5)
  {
    previousSpeed = 3.0;
  }
  else if(parseRate() < 0.65)
  {
    previousSpeed = 2.5;
  }
  toggleSpeed();

  if (previousSpeed == 8.0) 
  {
    if(start_music_slow)
    {
      toggleSpeed();
    }
    words = default_to_music ? "[MUSIC PLAYING]" : "[NO AUDIO]";
    if (default_to_music && $(".panel:contains('Handle Instrumental Music Only - Return')").length) 
    {
      words = "RETURN RETURN RETURN RETURN RETURN RETURN RETURN";
    }
    else if (default_to_music && $(".panel:contains('Handle Instrumental Music Only - Generic Music Tags')").length == 0) 
    {
      words = "DESCRIPTIVE MUSIC TAGS";
    }
    scope().cell.setWords(words);
    scope().$apply();
    angular.element($(".active-cell").eq(6)).scope().paragraph.transcript.makeNewParagraph(angular.element($(".active-cell").eq(6)).scope().cell);
    angular.element($("videogular")).scope().ctrl.tpVideoService.playerApi.play();
    $(".fa-check").parent().click();
  }
  
  loadFileSelector();
  
  $(".col-md-6").eq(1).prepend($(".panel-open").eq(1));
  $("#finish-dropdown a").mousedown(saveFileData);
  
  document.onmousemove = updateTimeWorked;
}

checkForPauses = function(){
  if(speed().val()==1.0)
  {
    return;
  }
  current_text = $(".video-highlighted").text().trim();
  current_timestamp = parseInt($(".video-highlighted").attr("timestamp"));
  next_word = $("[timestamp]").filter(function(index){
    text = $(this).text();
    upcoming = parseInt($(this).attr("timestamp")) > current_timestamp;
    return text.trim().length>0 && upcoming;
  }).eq(0);
  if (next_word.length == 0)
  {
    next_word = $("[timestamp]").last();
  }
  next_word_timestamp = parseInt(next_word.attr("timestamp"));
  if(autospeedup && current_text.length == 0 && Date.now() - previousSpace > 1000 && (next_word_timestamp - current_timestamp > 4000 || !next_word_timestamp))
  {
    setSpeed(8.0, false);
  }
  if(next_word_timestamp - current_timestamp < 4000 && speed().val() == 8.0)
  {
    setSpeed(previousSpeed);
    
  }
}

updateFile = function(id, new_name = null, new_timestamp = null)
{
  files = getFilesData();
  file = files[id];
  file.name = new_name || file.name;
  file.timestamp = new_timestamp || file.timestamp;
  localStorage.setItem("files_data",  JSON.stringify(files));
}

setInterval(checkForPauses, 100);

onFileLoad();
