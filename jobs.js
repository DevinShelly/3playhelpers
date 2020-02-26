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

changeSpeed = function(changeBy, updateCookie) {
  //     <input type="range" ng-model="ctrl.userSetting.video_playback_rate" min="0.5" max="2" step="0.1" class="ng-valid ng-not-empty ng-dirty ng-valid-parse ng-touched">
  speed = $("*[ng-model='ctrl.userSetting.video_playback_rate']");
  speed.attr("max", 4);
  speed.val(parseFloat(speed.val()) + changeBy);
  angular.element(speed).triggerHandler("input");
  updateDisplay(speed.val());
}

previousSpeed = 2.0;
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

previousSpace = Date.now();

initialToggle = false;
document.onkeydown = function(e) {
  if (!initialToggle) {
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

  if (!e.ctrlKey && e.which != f5 && e.which != f12 && !(e.which == space && e.shiftKey) && !e.altKey && e.which < 96) {
    return;
  }

  if ((e.which >= 96 && e.which <= 105) || e.which == f12 || e.which == f11) {
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

    angular.element($(".user-selected")).scope().cell.words = macroWord;
    angular.element($(".user-selected")).scope().cell.dirty = true;
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

  switch (e.which) {
    case leftBracket:
      changeSpeed(-0.1, true);
      break;
    case rightBracket:
      changeSpeed(0.1, true);
      break;
    case space:
      if (Date.now() - previousSpace < 500) {
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

saveParagraph = function(index, id, callback)
{
  ///clicks paragraph and tries again if not loaded
  if($(".tp-transcript-paragraph").eq(index).children("span").not(".active-cell").length > 0)
  {
    $(".tp-transcript-paragraph").eq(index).children("span").click();
    setTimeout(saveParagraph, 100, index, id);
    return;
  }
  
  //We've reached the end of the paragaphs, stop saving
  if(index<0)
  {
    loadData();
    callback ? callback() : null;
    setTimeout(function(){$(".modal-footer .btn").eq(0).prop("disabled", false)}, 300);
    return;
  }
  
  console.log("Saving paragraph:" + index);
  
  //Adds the paragraph data to the file and then saves the next paragraph
  fileData = getFileData(id);
  cellsData = {};
  $(".tp-transcript-paragraph").eq(index).children(".active-cell").each(function() {
    cell = angular.element($(this)).scope().cell;
    cellsData[cell.time] = {
      "words": cell.words,
      "flagged": cell.flagged || $(this).is(":first-child"),
      "tags": cell.tags,
      "tagged": cell.tagged,
      "italicized": cell.italicized,
      "bookmarked": cell.bookmarked,
      "speakerLabel": cell.speakerLabel
  }});
  for(time in cellsData)
  {
    fileData.cellsData[time] = cellsData[time];
  }
  saveFileData(fileData);
  //setTimeout(saveParagraph, 50, index-1, id);
  saveParagraph(index-1, id);
}

saveFileData = function(fileData)
{
  filesData = getFilesData()
  previousCopy = filesData.findIndex(i => i.id == fileData.id);
  if (previousCopy != -1) 
  {
    filesData.splice(previousCopy, 1);
  }
  filesData.push(fileData);
  if (filesData.length > 20) {
    filesData.shift();
  }
  localStorage.setItem("filesData", JSON.stringify(filesData));
}

getFilesData = function()
{
  return JSON.parse(localStorage.getItem("filesData"));
}

getFileData = function(id)
{
  return getFilesData().filter(i => i.id == id)[0];
}

saveData = function(callback) 
{
  console.log("saving data")
  setTimeout(function(){$(".modal-footer .btn").eq(0).prop("disabled", true)}, 200);
  id = $(".tab-pane:eq(6) td.ng-binding:eq(1)").text();
  name = $(".tab-pane:eq(6) td.ng-binding:eq(3)").text();
  duration = $(".tp-transcript-controls span.ng-binding:eq(0)").text().split("/ ")[1];
  
  fileData = {
    "duration": duration,
    "name": name,
    "id": id,
    "cellsData":{}
  };
  saveFileData(fileData);
  saveParagraph($(".tp-transcript-paragraph").length - 1, id, callback);
}

loadData = function() {
  $("#duplicate_data").remove();
  duration = $(".tp-transcript-controls span.ng-binding:eq(0)").text().split("/ ")[1];
  if (duration == undefined) {
    setTimeout(loadData, 100);
    return;
  }

  permanentFilesData = JSON.parse(localStorage.getItem("permanentFilesData")).filter(i => i.duration == duration);
  filesData = JSON.parse(localStorage.getItem("filesData")).filter(i => i.duration == duration);
  select = "<select id = 'duplicate_data'><option value='blank'></option>";
  for (const i in filesData.concat(permanentFilesData)) {
    fileData = filesData[i];
    select = select + "<option value = '" + fileData.id + "'>" + fileData.name + "</option>";
  }
  select = select + "</select>";
  $($(".btn-group:last")).after(select);
  if (filesData.length == 0) {
    $("#duplicate_data").hide();
  }
  $("#duplicate_data").change(populateData);
}

populateCell = function(cell, cellsData, previousParagraphTimestamp)
{
  nextCell = $(cell).next()[0];
  nextTimestamp = nextCell ? parseInt(nextCell.getAttribute("timestamp")) : previousParagraphTimestamp;
  timestamp = cell.getAttribute("timestamp");
  scope = angular.element($(cell)).scope();
  
  originalState = {
      "words": scope.cell.words,
      "flagged": !scope.cell.flagged ? false : true,
      "tags": scope.cell.tags,
      "tagged": !scope.cell.tagged ? false : true,
      "italicized": !scope.cell.italicized ? false : true,
      "bookmarked": !scope.cell.bookmarked ? false : true,
      "speakerLabel": scope.cell.speakerLabel,
      "empty": !scope.cell.empty ? false : true
    };
  
  times = Object.keys(cellsData).filter(i => parseInt(i) >= timestamp && parseInt(i) < nextTimestamp).sort((n1, n2) => parseInt(n2) - parseInt(n1));
  multipleCellData = times.count>1;
  scope.cell.words = "";
  for (time of times)
  {
    cellData = cellsData[time];
    scope.cell.words = (scope.cell.words + " " + cellData["words"]).trim();
    scope.cell.flagged = cellData["flagged"] || multipleCellData;
    scope.cell.tags = cellData["tags"];
    scope.cell.tagged = cellData["tagged"];
    scope.cell.italicized = cellData["italicized"];
    scope.cell.bookmarked = cellData["bookmarked"];
    scope.cell.speakerLabel = cellData["speakerLabel"];
    scope.cell.empty = (scope.cell.words == "");
  }
  
  currentState = 
  {
    "words": scope.cell.words,
    "flagged": !scope.cell.flagged ? false : true,
    "tags": scope.cell.tags,
    "tagged": !scope.cell.tagged ? false : true,
    "italicized": !scope.cell.italicized ? false : true,
    "bookmarked": !scope.cell.bookmarked ? false : true,
    "speakerLabel": scope.cell.speakerLabel,
    "empty": !scope.cell.empty ? false : true
  };
  
  if (JSON.stringify(originalState) != JSON.stringify(currentState)) 
  {
      scope.cell.dirty = true;
      scope.$apply();
  }
}

populateParagraph = function(index, cellsData, previousParagraphTimestamp)
{
  //Load paragraph if needed
  if($(".tp-transcript-paragraph").eq(index).children("span").not(".active-cell").length > 0)
  {
    console.log("Reloading paragraph:" + index);
    $(".tp-transcript-paragraph").eq(index).children("span").click();
    setTimeout(populateParagraph, 100, index, cellsData);
    return;
  }
  
  if(index < 0)
  {
    return;
  }
  
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
  
  id = $(".tab-pane:eq(6) td.ng-binding:eq(1)").text();
  fileData = getFileData(idToLoad);
  paragraphCount = $(".tp-transcript-paragraph").length;
  
  //save the data if we're loading a different file
  if (id != idToLoad) 
  {
    callback = function(){populateParagraph(paragraphCount-1, fileData.cellsData, Infinity)};
    saveData(callback);
    return;
  }
  
  console.log("Starting to populate paragraphs");
  //directly load without saving if we're restoring a previous version of this file
  populateParagraph(paragraphCount-1, fileData.cellsData, Infinity);
}

setInterval(function() {
  $(".col-md-6").eq(1).prepend($(".panel-open").eq(1));
}, 100);

setTimeout(function() {
   $("#finish-dropdown a").mousedown(saveData);
}, 2000);

loadData();
