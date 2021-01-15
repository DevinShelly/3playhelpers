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

//This function fires on startup
previousSpeed = 2.0;

onStartup = function() {
  if ($(".modal-footer button").click().length == 0) {
    setTimeout(onStartup, 100);
    return;
  }
  
  if(parseRate() < 0.31)
  {
    previousSpeed = 8.0;
  }
  else if(parseRate() < 0.5)
  {
    previousSpeed = 3.0;
  }
  else if(parseRate() < 0.6)
  {
    previousSpeed = 2.5;
  }
  toggleSpeed();

  if (angular.element($(".active-cell")).scope().cell.words == "[NO SPEECH]") {
    words = "[MUSIC PLAYING]";
    if ($(".panel:contains('Handle Instrumental Music Only - Return')").length) {
      words = "RETURN RETURN RETURN RETURN RETURN RETURN RETURN";

    }
    setWords(scope().cell, words);
    scope().$apply();
    angular.element($(".active-cell").eq(6)).scope().paragraph.transcript.makeNewParagraph(angular.element($(".active-cell").eq(6)).scope().cell);
    angular.element($("videogular")).scope().ctrl.tpVideoService.playerApi.play();
    $(".fa-check").parent().click();
  } else {
    $("#finish-dropdown li").not(":eq(1)").remove();
  }
  
  
  
}

onStartup();

//Adds the following functunality to within a job
// Ctr + [ decreases playback speed by 0.1
// Ctr + ] increases playback speed by 0.1
// Double tapping Shift + Space will toggle between a speed of 1.0 and your previous non-1.0 speed
// Also increases the maximum speed from 2.0 to 4.0, at which point the audio cuts out

offsetDate = function() {
  //This starts a new day at 6 AM
  offset = 6 * 1000 * 3600;
  return new Date(Date.now() - offset);
}

//Speed functions
speed = function(){
  speed_dom = $("*[ng-model='ctrl.userSetting.video_playback_rate']");
  speed_dom.attr("max", 8);
  return speed_dom;
}

updateDisplay = function() {
  working_time = parseInt(Cookies.get('working_time'));
  hours = Math.floor(working_time / 1000 / 3600);
  minutes = Math.floor((working_time - hours * 1000 * 3600) / 60 / 1000);
  seconds = Math.floor((working_time - hours * 1000 * 3600 - minutes * 1000 * 60) / 1000);
  if ($("#speed-display").length === 0) {
    $($("#duplicate_data")).after("<div class = 'btn-group' id = 'speed-display'></div>")
    setTimeout(updateDisplay, 100);
  }
  file_working_hours = getDurationData()[parseID()]["file_working_time"]/1000/3600;
  pay_rate = parsePay()/file_working_hours;
  console.log(pay_rate);
  $("#speed-display").text("Speed: " + speed().val() + " | Time clocked: " + hours + "h, " + minutes + "m" + " | Pay rate: $" + pay_rate.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})); //, " + seconds + "s");
}

setSpeedTo = function(newSpeed) 
{
  changeSpeed(newSpeed - parseFloat(speed().val()));
}

changeSpeed = function(changeBy)
{
  speed().val(parseFloat(speed().val()) + changeBy);
  angular.element(speed()).triggerHandler("input");
  updateDisplay();
}

toggleSpeed = function() {
  
  currentSpeed = parseFloat(speed().val());
  if (currentSpeed != 1.0) {
    changeSpeed(1.0 - currentSpeed);
    previousSpeed = currentSpeed;
  } else {
    changeSpeed(previousSpeed - currentSpeed);
  }
}

updateTimeWorked = function() {
  now = offsetDate();
  if (Cookies.get('current_date') != now.toDateString()) {
    Cookies.set('current_date', now.toDateString(), {
      expires: 1
    });
    Cookies.set('working_time', 0, {
      expires: 1
    });
  }
  last_keypress = parseInt(Cookies.get('last_keypress'));
  if (isNaN(last_keypress)) {
    last_keypress = now.getTime();
  }
  working_time = parseInt(Cookies.get('working_time'));
  Cookies.set('last_keypress', now.getTime(), {
    expires: 1
  });
  elapsed_time = Math.max(0, now.getTime() - last_keypress);
  if (elapsed_time < 60000) {
    updateFileWorkingTime(elapsed_time);
    working_time = working_time + elapsed_time;
    Cookies.set('working_time', working_time, {
      expires: 1
    });
  }
  updateDisplay();
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

setWords = function(cell, word)
{
  if(cell.words == word)
  {
    return;
  }
  cell.setWords("");
  previousLetter = "";
  for (letter of word)
  {
    cell.setWords(cell.words + previousLetter + letter);
    previousLetter = letter == " " ? " " : "";
  }
}

save_and_load_macros = function(e) {
  f12 = 123;
  f11 = 122;
  index = e.which > 57 ? e.which - 97: e.which - 49;
  console.log(index);
  var macroWords;
  if (e.which != f11 && e.which != f12) {
    if (index < 0) {
      index = 9;
    }
  }
  
  macroWord = $(".user-selected").text().trim();
  console.log(macroWord);
  if (macroWord.split("||").length == 2) {
    key = macroWord.split("||")[0];
    value = macroWord.split("||")[1];
    localStorage.setItem(key.toLowerCase(), value);
    macroWord = key;
  }
  
  if (localStorage.getItem(macroWord.toLowerCase())) {
    key = macroWord;
    macroWord = localStorage.getItem(macroWord.toLowerCase());
  }
  else if (parseInt(macroWord)) 
  {
    macroWord = parseInt(macroWord).toLocaleString();
    if (macroWord.length == 2)
    {
      macroWord = "'" + macroWord;
    }
  }
  else if (macroWord[0] == "'" && parseInt(macroWord.substr(1)) && macroWord.length == 3)
  {
    macroWord = macroWord.substr(1);
  }
  
  setWords(scope().cell, macroWord);
  scope().$apply();


  if (e.which == f12 || e.which == f11) {
    e.preventDefault;
    return;
  }

  isSpeaker = macroWord[macroWord.length - 1] == ":";
  setMacro(macroWord, isSpeaker, index);

  e.preventDefault();
  e.stopPropagation();
}

previousSpace = Date.now();
initialToggle = false;

clearSpeakerID = function() {
  if (scope().cell.speakerLabel) {
    setWords(scope().cell, "");
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
  if (e.ctrlKey && e.shiftKey && ((e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105)) || e.which == 123 || e.which == 122) 
  {
    save_and_load_macros(e);
  }
});

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
  if (e.ctrlKey && e.which == 219) {
    changeSpeed(-0.1, true);
    e.preventDefault();
  }
});

$("body").keydown(function(e) {
  if (e.ctrlKey && e.which == 221) {
    changeSpeed(0.1, true);
    e.preventDefault();
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
      setWords(scope().cell, "--" + words.substr(0, words.length-2));
      
    } else if (words.startsWith("--")) {
      setWords(scope().cell, words.substr(2));
    }
    else
    {
      setWords(scope().cell, words + "--");
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
    spelledWord = spelledWord.split("---").join("");
    spelledWord = spelledWord.substr(0, spelledWord.length - 1).toUpperCase();
    setWords(scope().cell, spelledWord);
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
/// TODO: Add ability to long press to ignore all spelling errors
// spellcheckTimestamp = null;
// clickstart = null;
// $("span").mousedown(function(e) {
//   if (this.classList.contains("spellcheck-misspelled"))
//   {
//     clickstart = Date.now();
//     spellcheckTimestamp = this.getAttribute("timestamp");
//   }
//   console.log(this.classList);
// });

// $("span").click(function(e) {
//   if(Date.now() - clickstart>100 && Date.now() - clickstart<1000 && this.getAttribute("timestamp") == spellcheckTimestamp)
//   {
//     $(".spellcheck-ignore").eq(1).click();
//     console.log("clicking");
//   }
//   console.log("click");
// });


characterSet = [32, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 45, 34, 47, 39, 44, 46, 45, 58, 91, 93, 35, 33, 64, 40, 41, 36, 37, 38, 193, 225, 201, 233, 205, 237, 211, 243, 218, 250];
/* Have to convert the characterSet to charCodes for encoding reasons(?) using the following

  characters = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-\"/',.-:[]#!@()$%&ÁáÉéÍíÓóÚú";
  characterSet = [];
  for (character of characters)
  {
    characterSet.push(character.charCodeAt(0));
  }
  console.log("characterSet = " + JSON.stringify(characterSet));
*/

pasteWord = function(word) {
  for (char of word) {
    if (characterSet.indexOf(char.charCodeAt(0)) == -1) {
      return;
    }
  }
  setWords(scope().cell, word);
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
    setWords(scope().cell, words.replace("-", ""));
    scope().$apply();
    e.stopPropagation();
    e.preventDefault();
  }
}

splitHyphen = function() {
  if (scope().cell.words.replace("-", "") != scope().cell.words) {
    setWords(scope().cell, scope().cell.words.replace("-", " "));
    scope().$apply();
  }
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
  return $(".tab-pane:eq(6) td.ng-binding:eq(3)").text();
}

parseID = function() {
  return $(".tab-pane:eq(6) td.ng-binding:eq(1)").text();
}

parsePrice = function() {
  return parseFloat($(".tab-pane:eq(6) td.ng-binding:eq(15)").text().replace("$", ""));
}

parseRate = function() {
  parts = parseDuration().split(":");
  minutes = parseFloat(parts[0]*60) + parseFloat(parts[1]) + parseFloat(parts[2])/60;
  return parsePrice()/minutes;
}

getFileData = function(id) {
  //console.log("Getting fileData");
  return JSON.parse(localStorage.getItem(id));
}

getDurationData = function() {
  //console.log("Getting durationData");  
  data = JSON.parse(localStorage.getItem(parseDuration()));
  return data;
}

deleteFiles = function(deleteNonPermanent) {
  console.log("Deleting files");
  durations = Object.keys(localStorage).filter(k => k.split(":").length == 3);
  deleted = false;
  for (duration of durations) {
    files = JSON.parse(localStorage.getItem(duration));
    for (file in files) {
      console.log(files[file].expiration < Infinity);
      if (Date.now() - files[file].expiration > 0 || (deleteNonPermanent && files[file].expiration < Infinity)) {
        console.log("Deleting file:" + JSON.stringify(files[file]));
        deleted = delete files[file];
        localStorage.removeItem(file);
      } else {
        console.log("Couldn't delete the following file: " + JSON.stringify(files[file]));
      }
    }
    Object.keys(duration).length ? localStorage.setItem(duration, JSON.stringify(files)) : localStorage.removeItem(duration);
  }
  return deleted;
}

saveDurationData = function() {
  durationData = getDurationData() || {};
  console.log(durationData);
  previousFileWorkingTime = durationData[parseID()] ? parseFloat(durationData[parseID()]["file_working_time"]) : 0;
  durationData[parseID()] = {
    "name": parseName(),
    "expiration": Date.now() + 4 * 1000 * 60 * 60,
    "file_working_time": isNaN(previousFileWorkingTime) ? 0 : previousFileWorkingTime
  };
  localStorage.setItem(parseDuration(), JSON.stringify(durationData));
}

updateFileWorkingTime = function(ellapsed_file_working_time) {
  durationData = getDurationData();
  previousFileWorkingTime = parseFloat(durationData[parseID()]["file_working_time"]);
  durationData[parseID()]["file_working_time"] = previousFileWorkingTime + ellapsed_file_working_time;
  localStorage.setItem(parseDuration(), JSON.stringify(durationData));
}

saveFileData = function() {
  console.log("Saving fileData");
  fileData = getFileData(parseID());
  content = transcript().tpTranscriptSaveService.emergencySaveContent();
  if (!fileData) {
    fileData = {};
    fileData.original = content;
  } else {
    fileData.edited = content;
  }

  try {
    localStorage.setItem(parseID(), JSON.stringify(fileData));
  } catch (error) {
    deleteFiles(false);
    try {
      localStorage.setItem(parseID(), JSON.stringify(fileData));
    } catch (error) {
      deleteFiles(true);
      try {
        localStorage.setItem(parseID(), JSON.stringify(fileData));
      } catch {
        alert("Unable to save save: " + error);
      }
    }
  }
}

saveData = function(e, callback) {
  console.log("Saving data");
  saveDurationData();
  saveFileData();
  console.log("Done saving");

}

loadFileSelector = function() {
  //If the file has yet to fully load, try again
  if (!$(".active-cell").length) {
    setTimeout(loadFileSelector, 100);
    return;
  }

  //If this is the initial loading, save the file first
  if (!getFileData(parseID())) {
    console.log("Initially saving data");
    saveData();
    loadFileSelector();
    return;
  }

  durationData = getDurationData();
  $("#duplicate_data").remove();
  select = "<select id = 'duplicate_data'><option value='blank'></option>";
  fileToLoad = null;
  for (id of Object.keys(durationData).reverse()) {
    name = id != parseID() ? durationData[id].name : "Original ASR";
    select = select + "<option value = '" + id + "'>" + name + "</option>";
    if (parseName().indexOf(name) + name.indexOf(parseName()) != -2) {
      i = parseInt(id);
      fileToLoad = i;
      setTimeout(function() 
      {
        if(scope().cell.words.indexOf("RETURN RETURN") == -1)
        {
          populateData(null, i);
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

savePermanently = function(duration, id, name)
{
  files = JSON.parse(localStorage.getItem(duration));
  file = files[id];
  file.name = name;
  file.expiration = "INFINITY";
  files[id] = file;
  localStorage.setItem(duration, JSON.stringify(files));
}

populateData = function(e, id, startingRange=0, endingRange=1000*60*60*24)
{
  idToLoad = id ? id : $("#duplicate_data").val();
  if (idToLoad == "blank") {
    return;
  }
  emergencySaveContent = transcript().tpTranscriptSaveService.emergencySaveContent();
  unfixedData = idToLoad == parseID() ? getFileData(idToLoad).original : getFileData(idToLoad).edited;
  fileData = fixedData(unfixedData, emergencySaveContent);

  for (timestamp in fileData.words) 
  {
    //ignore this cell if it falls outside the limited range we want to load
    if(parseInt(timestamp) < startingRange || parseInt(timestamp)>endingRange)
    {
      continue;
    }
    cell = transcript().getCell(timestamp) ? transcript().getCell(timestamp) : transcript().createCell(timestamp, "");
    setWords(cell, fileData.words[timestamp].replace("<i>", "").replace("</i>", ""));
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

  //setTimeout(checkadjacentwords, 5000);
}

checkadjacentwords = function() {

  dirtycells = $("span.cell-dirty");
  console.log(dirtycells);
  for (let i = 1; i < dirtycells.length - 1; i++) {
    dirtycell = transcript().getCell($(dirtycells[i]).attr("timestamp"));
    prevdirtycell = transcript().getCell($(dirtycells[i - 1]).attr("timestamp"));
    nextdirtycell = transcript().getCell($(dirtycells[i + 1]).attr("timestamp"));
    if (prevdirtycell.originalData.words == dirtycell.words) {
      //prevdirtycell.setWords(dirtycell.words);
      //dirtycell.setWords("");
    }
    if (nextdirtycell.originalData.words == dirtycell.words) {
      setWords(nextdirtycell, dirtycell.words);
      setWords(dirtycell, "");
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
    setWords(nextCell, cell.words);
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
    setWords(prevCell, cell.words);
  }
  scope().$apply();
}

offsetFile = function(id, offsetTime)
{
  offset = {edited:{words:{}, paragraphs:[]}};
  original = JSON.parse(localStorage.getItem(id));
  for(timestamp in original.edited.words)
  {
    offset.edited.words[parseInt(timestamp) + offsetTime] = original.edited.words[timestamp];
  }
  for(timestamp of original.edited.paragraphs)
  {
    offset.edited.paragraphs.push(parseInt(timestamp)+offsetTime);
  }
  key = id + " " + offsetTime;
  localStorage.setItem(key, JSON.stringify(offset));
  console.log(offset);
  console.log(key);
}


loadFileSelector();

setInterval(function() {
  $(".col-md-6").eq(1).prepend($(".panel-open").eq(1));
  $("#finish-dropdown a").off("mousedown");
  $("#finish-dropdown a").mousedown(saveData);
}, 100);

document.onmousemove = updateTimeWorked;
