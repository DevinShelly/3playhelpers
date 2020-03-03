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
  //Uncomment this to autostart the video and insert a [MUSIC PLAYING] in the first cell for batches of mostly audio only files 
  try
  {
  // angular.element($(".active-cell")).scope().cell.setWords("[MUSIC PLAYING]");
  // angular.element($(".active-cell")).scope().$apply();
  // angular.element($(".active-cell").eq(6)).scope().paragraph.transcript.makeNewParagraph(angular.element($(".active-cell").eq(6)).scope().cell);
  // angular.element($("videogular")).scope().ctrl.tpVideoService.playerApi.play();
  // always4 = setInterval(function(){setSpeedTo(4.0)}, 100);
  // $(".fa-check").parent().click();
  }
  catch
  {
  }
  return $(".modal-footer button").click().length;
}

startupInterval = setInterval(function(){
  if(onStartup())
  {
    clearInterval(startupInterval);
  }
}, 1000);

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
  speed.attr("max", 4);
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

saveParagraph = function(index, callback)
{
  ///clicks paragraph and tries again if not loaded
  //console.log("Saving paragraph");
  if($(".tp-transcript-paragraph").eq(index).children("span").not(".active-cell").length > 0)
  {
    $(".tp-transcript-paragraph").eq(index).children("span").click();
    setTimeout(saveParagraph, 100, index, callback);
    return;
  }
  //We've reached the end of the paragaphs, stop saving
  if(index<0)
  {
    console.log("Finished saving");
    loadFileSelector();
    callback ? callback() : null;
    clearInterval(disable_button);
    setInterval(function(){$(".modal-footer .btn").prop("disabled", false);}, 100);
    $("#duplicate_data").show();
    return;
  }
  
  //Adds the paragraph data to the file and then saves the next paragraph
  fileData = getFileData(parseID());
  $(".tp-transcript-paragraph").eq(index).children(".active-cell").each(function() {
    cell = angular.element($(this)).scope().cell;
    fileData.edited[cell.time] = {
      "words": cell.words,
      "flagged": cell.flagged,
      "tags": cell.tags,
      "tagged": cell.tagged,
      "italicized": cell.italicized,
      "bookmarked": cell.bookmarked,
      "speakerLabel": cell.speakerLabel,
      "isFirstInParagraph": cell.isFirstInParagraph()
  }});
  saveFileData(fileData);
  saveParagraph(index-1, callback);
}

deleteFiles = function(deleteNonPermanent)
{
  durations = Object.keys(localStorage).filter(k=> k.split(":").length==3);
  deleted = false;
  for (duration of durations)
  {
    files = JSON.parse(localStorage.getItem(duration));
    for (file in files)
    {
      if(Date.now() - files[file].expiration > 0 || (deleteNonPermanent && files[file].expiration < Infinity))
      {
        console.log(file);
        deleted = delete files[file];
        localStorage.removeItem(file);
        console.log()
      }
      else
      {
        //console.log(fileInfo);
      }
    }
    Object.keys(duration).count ? localStorage.setItem(duration, JSON.stringify(files)) : localStorage.removeItem(duration);
  }
  return deleted;
}

saveFileData = function(fileData)
{
  try
  {
    console.log("Saving file data");
    localStorage.setItem(parseID(), JSON.stringify(fileData));
  }
  catch(error)
  {
    if(!deleteFiles(false))
    {
      saveFileData(fileData);
    }
    else if(!deleteFiles(true))
    {
      saveFileData(fileData);
    }
    else
    {
      alert("Couldn't free up space to save file");
    }
  }
}

saveDurationData = function()
{
  console.log("Saving durationData");
  durationData = JSON.parse(localStorage.getItem(parseDuration()));
  durationData = durationData ? durationData : {};
  durationData[parseID()] = {"name":parseName(), "expiration":Date.now() + 4*1000*60*60};
  localStorage.setItem(parseDuration(), JSON.stringify(durationData));
}

disable_button = null;
saveData = function(e, callback) 
{
  console.log("Saving data");
  //console.log("the call back in saveData is:" + callback);
  //Clear up any pseudo paragraphs if necessary
  if ($(".paragraph-pseudo span").last().click().length > 0)
  {
    setTimeout(saveData, 1000, e, callback);
    return;
  }
  
  fileData = getFileData(parseID());
  if(!fileData)
  {
    fileData = {};
  }
  fileData.edited = {};
  saveFileData(fileData);
  saveDurationData();
  disable_button = setInterval(function(){$(".modal-footer .btn").eq(0).prop("disabled", true)}, 100);
  saveParagraph($(".tp-transcript-paragraph").length - 1, callback);
}

loadFileSelector = function() 
{
  console.log("Loading File Selector");
  $("#duplicate_data").remove();
  if (parseDuration() == undefined) {
    setTimeout(loadFileSelector, 100);
    return;
  }

  durationData = getDurationData();
  select = "<select id = 'duplicate_data'><option value='blank'></option>";
  for (id in durationData) 
  {
    name = id != parseID() ? durationData[id].name : "Original ASR";
    select = select + "<option value = '" + id + "'>" + name + "</option>";
  }
  select = select + "</select>";
  $($(".btn-group:last")).after(select);
  if (!durationData) 
  {
    $("#duplicate_data").hide();
  }
  else if(!getFileData(parseID()))
  {
    saveData(null, function()
    {
      //console.log("Saving original version");
      fileData = getFileData(parseID());
      fileData.original = fileData.edited;
      saveFileData(fileData);
    });
  }
  $("#duplicate_data").change(populateData);
}

populateCell = function(cell, cellsData, previousParagraphTimestamp)
{
  nextCell = $(cell).next()[0];
  nextTimestamp = nextCell ? parseInt(nextCell.getAttribute("timestamp")) : previousParagraphTimestamp;
  timestamp = cell.getAttribute("timestamp");
  scope = angular.element($(cell)).scope();
  
  times = Object.keys(cellsData).filter(i => parseInt(i) >= timestamp && parseInt(i) < nextTimestamp).sort((n1, n2) => parseInt(n2) - parseInt(n1));
  
  words = "";
  
  
  for (time of times)
  {
    cellData = cellsData[time];
    words = (cellData["words"] + " " + words).trim();
    scope.cell.setFlagged(cellData["flagged"] || times.length>1);
    scope.cell.setTags(cellData["tags"]);
    scope.cell.setItalics(cellData["italicized"]);
    scope.cell.setBookmarked(cellData["bookmarked"]);
  }
  scope.cell.setWords(words);
  if(scope.cell.dirty)
  {
    scope.$apply();
  }
}

createParagraphs = function(cellsData, startingTimestamp)
{
  //Create new paragraphs where they should be
  cellsToBreakOn = Object.keys(cellsData).filter(i=>cellsData[i].isFirstInParagraph && !cellsData[i].isBroken);
  for(cellToBreakOn of cellsToBreakOn)
  {
    cells = $(".tp-transcript-paragraph span").filter(function(){return parseInt($(this).attr("timestamp"))<=parseInt(cellToBreakOn)});
    cell = cells[cells.length-1];
    if($(cell).hasClass("active-cell"))
    {
      scope = angular.element($(cell)).scope();
      scope.paragraph.transcript.makeNewParagraph(scope.cell);
      scope.$apply();
      cellsData[cellToBreakOn].isBroken = true;
    }
    else
    {
      $(cell).click();
      setTimeout(createParagraphs, 100, cellsData);
      return;
    }
  }
  
  //Now merge the paragraphs back up that shouldn't be a new paragraph
  startingTimestamp = startingTimestamp ? startingTimestamp : 0;
  firstCells = $(".tp-transcript-paragraph span:first-child").filter(function(){return parseInt($(this).attr("timestamp")) >= parseInt(startingTimestamp)}).slice(1);
  
  console.log(cellsData);
  for(cell of firstCells)
  {
    if($(cell).hasClass("active-cell"))
    {
      //Set the words so that it updates the speaker IDs if needed
      scope = angular.element($(cell)).scope();
      scope.cell.setWords(scope.cell.words);
      console.log(cellsData[$(cell).attr("timestamp")]);
      console.log($(cell).attr("timestamp"));
      if(!cellsData[$(cell).attr("timestamp")] || !cellsData[$(cell).attr("timestamp")].isFirstInParagraph)
      {
        $(cell).click();
        scope.paragraph.transcript.removeParagraph(scope.paragraph.transcript.userCellParagraph());
      }
      else
      {
        console.log("Not removing paragraph");
        console.log(cell);
        console.log(cellsData[$(cell).attr("timestamp")]);
      }
    }
    else
    {
      cell.click();
      setTimeout(createParagraphs, 100, cellsData, $(cell).attr("timestamp"));
      return;
    }
  }
  angular.element($(".active-cell").eq(0)).scope().$apply();
  
  
}

populateParagraph = function(index, cellsData, previousParagraphTimestamp)
{
  //Load paragraph if needed
  if($(".tp-transcript-paragraph").eq(index).children("span").not(".active-cell").length > 0)
  {
    //console.log("Reloading paragraph:" + index);
    $(".tp-transcript-paragraph").eq(index).children("span").click();
    setTimeout(populateParagraph, 100, index, cellsData);
    return;
  }
  
  //Break the paragraphs now that all the words are loaded
  if(index < 0)
  {
    createParagraphs(cellsData, 0);
    return;
  }
  
  //console.log("populating paragraph:" + index);
  cells = $(".tp-transcript-paragraph").eq(index).children(".active-cell").each(function(){
    populateCell(this, cellsData, previousParagraphTimestamp)});
  populateParagraph(index-1, cellsData, parseInt(cells[0].getAttribute("timestamp")));
}

populateData = function() 
{
  
  idToLoad = $("#duplicate_data").val();
  if (idToLoad === "blank") {
    return;
  }
  
  //if there are pseudo paragraphs, click them and them retry later after paragraphs have loaded
  if ($(".paragraph-pseudo span").last().click().length > 0)
  {
    setTimeout(populateData, 1000);
    return;
  }
  
  //console.log("Starting to populate paragraphs");
  fileData = getFileData(idToLoad);
  paragraphCount = $(".tp-transcript-paragraph").length;
  if (parseID() == idToLoad) 
  {
    populateParagraph(paragraphCount-1, fileData.original, Infinity);
  }
  else
  {
    populateParagraph(paragraphCount-1, fileData.edited, Infinity);
  }
  
}

loadFileSelector();

setInterval(function()
{
  $(".col-md-6").eq(1).prepend($(".panel-open").eq(1));
  $("#finish-dropdown a").off("mousedown");
  $("#finish-dropdown a").mousedown(saveData);
}, 100);
