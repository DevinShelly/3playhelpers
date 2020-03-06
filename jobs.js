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

//This function fires on startup
always4 = null;
previousSpeed = 2.0;

onStartup = function()
{
  console.log("Starting up");
  //Uncomment this to autostart the video and insert a [MUSIC PLAYING] in the first cell for batches of mostly audio only files
  if($(".modal-footer button").click().length==0)
  {
    setTimeout(onStartup, 100);
    return;
  }
  
  if(angular.element($(".active-cell")).scope().cell.words == "[NO SPEECH]")
  {
    angular.element($(".active-cell")).scope().cell.setWords("[MUSIC PLAYING]");
    angular.element($(".active-cell")).scope().$apply();
    angular.element($(".active-cell").eq(6)).scope().paragraph.transcript.makeNewParagraph(angular.element($(".active-cell").eq(6)).scope().cell);
    angular.element($("videogular")).scope().ctrl.tpVideoService.playerApi.play();
    always4 = setInterval(function(){setSpeedTo(8.0)}, 100);
    $(".fa-check").parent().click();
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
updateDisplay = function(speed) {
  working_time = parseInt(Cookies.get('working_time'));
  hours = Math.floor(working_time / 1000 / 3600);
  minutes = Math.floor((working_time - hours * 1000 * 3600) / 60 / 1000);
  seconds = Math.floor((working_time - hours * 1000 * 3600 - minutes * 1000 * 60) / 1000);
  while ($("#speed-display").length === 0) {
    $($("#duplicate_data")).after("<div class = 'btn-group' id = 'speed-display'></div>")
  }
  $("#speed-display").text("Speed: " + speed + " | Time clocked: " + hours + "h, " + minutes + "m"); //, " + seconds + "s");
}

setSpeedTo = function(speed)
{
  changeSpeed(speed - $("*[ng-model='ctrl.userSetting.video_playback_rate']").val());;
}

changeSpeed = function(changeBy, updateCookie) {
  //     <input type="range" ng-model="ctrl.userSetting.video_playback_rate" min="0.5" max="2" step="0.1" class="ng-valid ng-not-empty ng-dirty ng-valid-parse ng-touched">
  speed = $("*[ng-model='ctrl.userSetting.video_playback_rate']");
  speed.attr("max", 8);
  speed.val(parseFloat(speed.val()) + changeBy);
  angular.element(speed).triggerHandler("input");
  updateDisplay(speed.val());
}





toggleSpeed = function() {
  speed = $("*[ng-model='ctrl.userSetting.video_playback_rate']");
  currentSpeed = parseFloat(speed.val());
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
  if (elapsed_time < 5000) {
    working_time = working_time + elapsed_time;
    Cookies.set('working_time', working_time, {
      expires: 1
    });
  }
  changeSpeed(0.0);
}

save_and_load_macros = function(e)
{
  index = e.which - 97;
  var macroWords;
  if (e.which != f12 && e.which != f11) {
    macroWords = $("[ng-model='macroData.words']");
    macroSpeakers = $("[ng-click='ctrl.toggleMacroSpeakerLabel(macroData.id)']");
    index = e.which - 97;
    if (index < 0) {
      index = 9;
    }
  }

  macroWord = $(".user-selected").text().trim();
  if (macroWord.split("||").length == 2) {
    key = macroWord.split("||")[0];
    value = macroWord.split("||")[1];
    localStorage.setItem(key, value);
    macroWord = key;
  }

  if (localStorage.getItem(macroWord.toLowerCase())) {
    key = macroWord;
    macroWord = localStorage.getItem(macroWord.toLowerCase());
  }
  
  angular.element($(".user-selected")).scope().cell.setWords(macroWord);
  //angular.element($(".user-selected")).scope().cell.setDirty(true);
  if(macroWord[macroWord.length-1] == ":")
  {
    angular.element($(".user-selected")).scope().cell.setSpeakerLabel(macroWord.substr(0, macroWord.length-1));
  }
  angular.element($(".user-selected")).scope().$apply();

  if (e.which == f12 || e.which == f11) {
    e.preventDefault;
    return;
  }

  is_speaker = macroWord[macroWord.length - 1] == ":";

  macroWords[index].value = macroWord;
  $(macroWords[index]).trigger("input");
  speaker_checked = macroSpeakers[index].value == "true";
  if (speaker_checked != is_speaker) {
    $(macroSpeakers[index]).click();
  }
  e.preventDefault();
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
  if (Math.random() < threshhold) {
    updateTimeWorked();
  }

  leftBracket = 219;
  rightBracket = 221;
  space = 32;
  f5 = 116;
  f11 = 122;
  f12 = 123;
  k = 75;
  d = 68;
  left = 37;
  right = 39;

  if (!e.ctrlKey && e.which != f5 && e.which!= f11 && e.which != f12 && !(e.which == space && e.shiftKey) && !e.altKey && e.which < 96) 
  {
    return;
  }

  if ((e.which >= 96 && e.which <= 105) || e.which == f12 || e.which == f11) 
  {
    save_and_load_macros(e);
  }
  
  if(e.which == 37)
  {
    selectedTimestamp = parseInt($(".user-selected").attr("timestamp"));
    $(".cell-flagged").filter(function(){return $(this).attr("timestamp")<selectedTimestamp}).eq(0).click();
  }
  
  if(e.which == 39)
  {
    selectedTimestamp = parseInt($(".user-selected").attr("timestamp"));
    $(".cell-flagged").filter(function(){return $(this).attr("timestamp")>selectedTimestamp}).eq(0).click();
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
      if (Date.now() - previousSpace < 500) 
      {
        toggleSpeed();
        clearInterval(always4);
      }
      previousSpace = Date.now(0);
      break;
    case f5:
    case k:
      e.preventDefault();
      break;
  }
}

parseDuration = function()
{
  return $(".tp-transcript-controls span.ng-binding:eq(0)").text().split("/ ")[1];
}

parseName = function()
{
  return $(".tab-pane:eq(6) td.ng-binding:eq(3)").text()
}

parseID = function()
{
  return $(".tab-pane:eq(6) td.ng-binding:eq(1)").text();
}

getFileData = function(id)
{
  //console.log("Getting fileData");
  return JSON.parse(localStorage.getItem(id));
}

getDurationData = function()
{
  //console.log("Getting durationData");
  //Remove any files that are expired
  data = JSON.parse(localStorage.getItem(parseDuration()));
  return data;
}

deleteFiles = function(deleteNonPermanent)
{
  console.log("Deleting files");
  durations = Object.keys(localStorage).filter(k=> k.split(":").length==3);
  deleted = false;
  for (duration of durations)
  {
    files = JSON.parse(localStorage.getItem(duration));
    for (file in files)
    {
      console.log(files[file].expiration < Infinity);
      if(Date.now() - files[file].expiration > 0 || (deleteNonPermanent && files[file].expiration < Infinity))
      {
        console.log("Deleting file:" + JSON.stringify(files[file]));
        deleted = delete files[file];
        localStorage.removeItem(file);
      }
      else
      {
        console.log("Couldn't delete the following file: " + JSON.stringify(files[file]));
      }
    }
    Object.keys(duration).length ? localStorage.setItem(duration, JSON.stringify(files)) : localStorage.removeItem(duration);
  }
  return deleted;
}

saveDurationData = function()
{
  console.log("Saving durationData");
  durationData = JSON.parse(localStorage.getItem(parseDuration()));
  durationData = durationData ? durationData : {};
  durationData[parseID()] = {"name":parseName(), "expiration":Date.now() + 4*1000*60*60};
  localStorage.setItem(parseDuration(), JSON.stringify(durationData));
}

saveFileData = function()
{
  console.log("Saving fileData");
  fileData = getFileData(parseID());
  content = angular.element($(".active-cell")).scope().paragraph.transcript.tpTranscriptSaveService.emergencySaveContent();
  if(!fileData)
  {
    fileData = {};
    fileData.original = content;
  }
  else
  {
    fileData.edited = content;
  }
  
  try
  {
    localStorage.setItem(parseID(), JSON.stringify(fileData));
  }
  catch (error)
  {
    deleteFiles(false);
    try
    {
      localStorage.setItem(parseID(), JSON.stringify(fileData));
    }
    catch (error)
    {
      deleteFiles(true);
      try
      {
        localStorage.setItem(parseID(), JSON.stringify(fileData));
      }
      catch
      {
         alert("Unable to save save: " + error);
      }
    }
  }
}

saveData = function(e, callback) 
{
  console.log("Saving data");
  saveDurationData();
  saveFileData();
  console.log("Done saving");
  
}

loadFileSelector = function() 
{
  console.log("Loading File Selector");
  
  //If the file has yet to fully load, try again
  if (!$(".active-cell").length) 
  {
    setTimeout(loadFileSelector, 100);
    return;
  }
  
  //If this is the initial loading, save the file first
  if(!getFileData(parseID()))
  {
    console.log("Initially saving data");
    saveData();
    loadFileSelector();
    return;
  }
  
  durationData = getDurationData();
  $("#duplicate_data").remove();
  select = "<select id = 'duplicate_data'><option value='blank'></option>";
  for (id in durationData) 
  {
    name = id != parseID() ? durationData[id].name : "Original ASR";
    select = select + "<option value = '" + id + "'>" + name + "</option>";
  }
  select = select + "</select>";
  $($(".btn-group:last")).after(select);
  $("#duplicate_data").change(populateData);
}

fixedData = function(fileData, currentData)
{
  output = {words:{}, paragraphs:fileData.paragraphs};
  
  //Copies over the timestamps only from currentData
  for(timestamp in currentData.words)
  {
    output.words[timestamp] = "";
  }
  
  //Overwrites the timestamp from the currentFile or creates a new entry in the output
  for(timestamp in fileData.words)
  {
    output.words[timestamp] = fileData.words[timestamp];
  }
  
  //Now sort the timestamps
  //If the timestamp exists in the currentData only, examine the two adjacent timestamps
  //Pick the closest timestamp which exists only in the fileData and copy its word into the middle timestampIndex
  //If that timestamp exists in the paragraphs, update it with the location of the new timestampIndex
  //Delete 
  
  
  sortedTimesteps = Object.keys(output.words).sort((i, j) => parseInt(i)-parseInt(j));
  for(timestepIndex in sortedTimesteps)
  {
    timestep = parseInt(sortedTimesteps[timestepIndex]);
    inFileData = fileData.words[timestep] != null;
    inCurrentData = currentData.words[timestep] != null;
    
    //We have an exact match, do nothing
    exactMatch = inFileData && inCurrentData;
    alreadyMoved = !inFileData && !inCurrentData;
    inFileDataOnly = inFileData && !inCurrentData;
    
    if (exactMatch || alreadyMoved || inFileDataOnly)
    {
      continue;
    }
    
    //Now we have a cell that only exists in the currentFile, so move the closest fileData only cell to it
    prevTimestep = parseInt(timestepIndex) > 0 ? parseInt(sortedTimesteps[parseInt(timestepIndex)-1]) : -Infinity;
    nextTimestep = parseInt(timestepIndex) < sortedTimesteps.length - 1 ? parseInt(sortedTimesteps[parseInt(timestepIndex)+1]) : Infinity;
    inFileDataPrev = fileData.words[prevTimestep] != null;
    inCurrentDataPrev = currentData.words[prevTimestep] != null;
    inFileDataNext = fileData.words[nextTimestep] != null;
    inCurrentDataNext = currentData.words[nextTimestep] != null;
    prevEligible = inFileDataPrev && !inCurrentDataPrev;
    nextEligible = inFileDataNext && !inCurrentDataNext;
    
    if(!prevEligible && !nextEligible)
    {
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
    if(paragraphIndex != -1)
    {
      output.paragraphs.splice(paragraphIndex, 1, timestep);
    }
  }
  
  return output;
}

populateData = function() 
{
  idToLoad = $("#duplicate_data").val();
  if(idToLoad == "blank")
  {
    return;
  }
  scope = angular.element($(".active-cell")).scope();
  transcript = scope.cell.transcript;
  emergencySaveContent = transcript.tpTranscriptSaveService.emergencySaveContent();
  unfixedData = idToLoad == parseID() ? getFileData(idToLoad).original : getFileData(idToLoad).edited;
  console.log(unfixedData.paragraphs);
  fileData = fixedData(unfixedData, emergencySaveContent);
  console.log(fileData.paragraphs);
  
  for(timestamp in fileData.words)
  {
    cell = transcript.getCell(timestamp) ? transcript.getCell(timestamp) : transcript.createCell(timestamp, "");
    cell.setWords(fileData.words[timestamp].replace("<i>", "").replace("</i>", ""));
    cell.setItalics(fileData.words[timestamp].indexOf("</i>") != -1);
    scope.$apply();
    
    if(cell.isFirstInParagraph() && fileData.paragraphs.indexOf(parseInt(timestamp)) < 0)
    {
      transcript.removeParagraph(transcript.findCellParagraph(cell).paragraph);
    }
    else if(!cell.isFirstInParagraph() && fileData.paragraphs.indexOf(parseInt(timestamp)) != -1)
    {
      transcript.makeNewParagraph(cell);
    }
  }
  scope.$apply();
}

loadFileSelector();

setInterval(function()
{
  $(".col-md-6").eq(1).prepend($(".panel-open").eq(1));
  $("#finish-dropdown a").off("mousedown");
  $("#finish-dropdown a").mousedown(saveData);
}, 100);
