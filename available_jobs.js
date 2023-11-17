!function(e){var n=!1;if("function"==typeof define&&define.amd&&(define(e),n=!0),"object"==typeof exports&&(module.exports=e(),n=!0),!n){var o=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=o,t}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var o=arguments[e];for(var t in o)n[t]=o[t]}return n}function n(o){function t(n,r,i){var c;if("undefined"!=typeof document){if(arguments.length>1){if("number"==typeof(i=e({path:"/"},t.defaults,i)).expires){var a=new Date;a.setMilliseconds(a.getMilliseconds()+864e5*i.expires),i.expires=a}i.expires=i.expires?i.expires.toUTCString():"";try{c=JSON.stringify(r),/^[\{\[]/.test(c)&&(r=c)}catch(e){}r=o.write?o.write(r,n):encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=(n=(n=encodeURIComponent(String(n))).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent)).replace(/[\(\)]/g,escape);var s="";for(var f in i)i[f]&&(s+="; "+f,!0!==i[f]&&(s+="="+i[f]));return document.cookie=n+"="+r+s}n||(c={});for(var p=document.cookie?document.cookie.split("; "):[],d=/(%[0-9A-Z]{2})+/g,u=0;u<p.length;u++){var l=p[u].split("="),C=l.slice(1).join("=");this.json||'"'!==C.charAt(0)||(C=C.slice(1,-1));try{var g=l[0].replace(d,decodeURIComponent);if(C=o.read?o.read(C,g):o(C,g)||C.replace(d,decodeURIComponent),this.json)try{C=JSON.parse(C)}catch(e){}if(n===g){c=C;break}n||(c[g]=C)}catch(e){}}return c}}return t.set=t,t.get=function(e){return t.call(t,e)},t.getJSON=function(){return t.apply({json:!0},[].slice.call(arguments))},t.defaults={},t.remove=function(n,o){t(n,"",e(o,{expires:-1}))},t.withConverter=n,t}return n(function(){})});
//# sourceMappingURL=/sm/f6937b1819ab68f00d8b787ead6c16bfb67977e0c408909621a3b2ff82dbad4a.map

//Adds the ability to automatically refresh the marketplace every 2 seconds

autorefresh_delay = 5000;
autorefresh_id = null;
should_autorefresh = false;
should_autoclaim = false;
autoclaim_duration = 40;
disable_autoclaim_id = null;
times_refreshed = 0;
should_hide_uniques = JSON.parse(Cookies.get('should_hide_uniques') || "false");
sort_by_duration = true;
max_times_refreshed = 25;
should_autoreload = false;
should_save_sort = true;
print_debugging = false;

refresh_rotation = [["Rate (lowest first)", function(){/*select_nonfavorites()*/}],
//["Bonus (highest first)", function(){}],
  ["Rate (highest first)", function(){}],
  ["Deadline (latest first)", function(){}]];

observe_market_container = function(mutationsList, observer) 
{
  for(let mutation of mutationsList) 
  {
    if (mutation.type === 'childList') 
    {
      for(node of mutation.addedNodes)
      {
        //The table has refreshed, so start the autotimer again if necessary
        if($(node).find("#jobs_table").length>0 || node.id == "empty_single")
        {
          display_percentages();
          if(should_autorefresh)
          {
            times_refreshed += 1;
            if (times_refreshed > max_times_refreshed && should_autoreload)
            {
              window.location.reload(true);
            }
            
          }
          if(should_autoclaim)
          {
            loop_rows();
          }
          
          //Need to recreate the buttons
          create_button();
        }
        if(node.textContent.trim() == "Claimed!")
        {
          file_was_claimed(node.parentNode.parentNode);
        }
      }
    }
  }
};

display_percentages = function()
{
  $(".greenColorBgReal").each(function()
  {
    var price = parseFloat($(this).parent().prev().text().replace("$", ""));
    var bonus = parseFloat($(this).text().replace("$", ""));
    var percentage = (bonus/price*100).toFixed(0) + "%";
    $(this).text(this.textContent + " (" + percentage + ")");
    $(this).parent().next().css("text-align", "center");
  });
}

market_container = document.getElementById('market-container');
config = { attributes: false, childList: true, subtree: true };
market_observer = new MutationObserver(observe_market_container);
if(market_container)
{
  market_observer.observe(market_container, config);
}

//Autoclaiming
parse_deadline = function (deadline)
{
  //////console.log(2);
  var pm = deadline.trim().slice(-2) == "pm";
  var deadline = deadline.trim().substring(0, deadline.trim().length-2);
  var hours = deadline.split(":")[0].slice(-2);
  var minutes = deadline.slice(-2);
  if (hours != "12" && pm)
  {
    var newHours = parseInt(hours) + 12;
    deadline = deadline.split(",")[0] + ", " + newHours.toString() + ":" + minutes;
  }
  deadline = deadline.split(",")[0] + ", 2023 " + deadline.split(", ")[1];
  deadline = deadline.replace("  ", " ");
  //////console.log("parsed deadline " + deadline);
  return  Date.parse(deadline);
}

parse_duration = function(row)
{
  var tds = $(row).find('td');
  duration = tds.eq(3).text().split(":")
  return parseFloat(duration[0])*60 + parseFloat(duration[1]) + parseFloat(duration[2])/60;
}

parse_project = function(row)
{
  var tds = $(row).find('td');
  return tds.eq(0).text();
}

const min_base_rate = "min_base_rate";
const max_base_rate = "max_base_rate";
const min_bonus_rate = "min_bonus_rate";
const min_duration_in_mins = "min_duration_in_mins";
const max_duration_in_mins = "max_duration_in_mins";
const min_deadline = "min_deadline";
const projects = "projects";
const min_bonus_ratio = "min_bonus_ratio";
const minutes_left_to_claim = "minutes_left_to_claim";
const duplicates_only = "duplicates_only";

date_from_time = function(time)
{
  var date = new Date();
  var hours = time.split(":")[0];
  var minutes = time.split(":")[1];
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  return date;
}

class AutoClaimFilter {
  
  constructor(params)
  {
    this.params = params;
    this.params[projects].filter(function(item, idx){
      return item.length>0;
    });
  }
  
  base_passes(rate)
  {
    var min_passes = rate >= parseFloat(this.params[min_base_rate]);
    var max_passes = rate <= parseFloat(this.params[max_base_rate]);
    return min_passes && max_passes;
    
  }
  
  bonus_passes(bonus)
  {
    var passes =  bonus >= parseFloat(this.params[min_bonus_rate]);
    if (!passes)
    {
      //////console.log("bonus " + bonus);
    }
    return passes;
  }
  
  deadline_passes(deadline)
  {
    return deadline > date_from_time(this.params[min_deadline]);
  }
  
  bonus_ratio_passes(ratio)
  {
    var passes = ratio >= parseFloat(this.params[min_bonus_ratio]);
    console.log(ratio);
    if (!passes)
    {
      //////console.log("ratio " + ratio);
    }
    return passes;
  }
  
  in_project(in_project, project)
  {
    if(in_project.length == 0)
    {
      return true;
    }
    for (i of in_project)
    {
      if(i.length == 0)
      {
        continue;
      }
      let i_split = i.split("&&");
      let passes = true;
      for(let j of i_split)
      {
        if(project.indexOf(j) == -1)
        {
          passes = false;
        }
      }
      if (passes)
      {
        return true;
      }
      
    }
    //////console.log("in project " + in_project);
    //////console.log("project" + project);
    return false;
  }
  
  not_in_project(not_in_project, project)
  {
    for(var i in not_in_project)
    {
      var not_project = not_in_project[i].substring(1);
      if (project.indexOf(not_project) != -1)
      {
        //////console.log("not in project " + not_project);
        return true;
      }
    }
    return false;
  }
  
  time_left_passes(duration)
  {
    var passes =  parseFloat(this.params[minutes_left_to_claim]) > duration;
    if (!passes)
    {
      //////console.log("time_left " + duration);
    }
    return passes;
  }
  
  duration_passes(duration)
  {
    var min_passes =  parseInt(this.params[min_duration_in_mins]) <= duration;
    var max_passes = parseInt(this.params[max_duration_in_mins]) >= duration || !this.params[max_duration_in_mins];
    return min_passes && max_passes;
  }
  
  should_claim_row(row)
  {
    var tds = $(row).find('td');
    var project = parse_project(row);
    var base = parseFloat(tds.eq(4).text().substring(1));
    var bonus = parseFloat(tds.eq(5).text().trim().substring(1));
    bonus = bonus ? bonus : 0.0;
    var duration = parse_duration(row);
    var deadline = parse_deadline(tds.eq(8).text());
    
    var base_passes = this.base_passes(base);
    var bonus_passes = this.bonus_passes(bonus);
    var deadline_passes = this.deadline_passes(deadline);
    var bonus_ratio_passes = this.bonus_ratio_passes(bonus/base); //bonus / rate >= parseFloat(this.params[min_bonus_ratio]);
    var time_left_passes = this.time_left_passes(duration); //parseInt(this.params[minutes_left_to_claim]) > duration;
    var duration_passes = this.duration_passes(duration); //parseInt(this.params[min_duration_in_mins]) <= duration;
    
    var in_project = this.in_project(this.params[projects].filter(function(string){return string[0] != "-"}), project);
    var not_in_project = this.not_in_project(this.params[projects].filter(function(string){return string[0] == "-"}), project);
    
    if(print_debugging)
    {
      console.log({"base_passes":base_passes, 
      "bonus_passes":bonus_passes,
      "deadline_passes":deadline_passes,
      "bonus_ratio_passes":bonus_ratio_passes,
      "time_left_passes":time_left_passes,
      "duration_passes":duration_passes,
      "in_project":in_project,
      "not_in_project":not_in_project,
      "row":this.textContent
      });
    }
    
    return duration_passes && base_passes && bonus_passes && deadline_passes && bonus_ratio_passes && in_project  && time_left_passes && !not_in_project;
  }
  
  reduce_time_left(row)
  {
    var duration = parse_duration(row);
    this.params[minutes_left_to_claim] -= duration;
    
  }
}

filters = [];

name_duration_pair = function(row)
{
  var tds = $(row).find("td");
  var duration = tds.eq(3).text().trim();
  var name = tds.eq(0).text().split("| ")[1];
  name = name.split(")").length > 1 ? name.split(")")[1].trim() : name.trim();
  return {name:name, duration:duration};
}

file_was_claimed = function(row) 
{
  var previously_claimed_files = JSON.parse(localStorage.getItem("previously_claimed_files")) || [];
  previously_claimed_files.push(name_duration_pair(row));
  localStorage.setItem("previously_claimed_files", JSON.stringify(previously_claimed_files));
  //////console.log(filters);
  
  for (var f in filters)
  {
    var filter = filters[f];
    if(!filter.params[duplicates_only] && filter.should_claim_row(row))
    {
      //////console.log("Filter claimed file:" + row.textContent + " " + JSON.stringify(filter.params));
      filter.reduce_time_left(row);
      update_filters();
      return;
    }
  }
}

last_refresh = Date.now();
refresh_market = function()
{
  $(".icon-refresh").eq(0).parent().click();
}

refresh_id = null;
parse_row = function()
{
  for (var filter of filters)
  {
    if(!filter.params[duplicates_only] && filter.should_claim_row(this))
    {
      $(this).find(".btn").click();
      $(this).find(".btn").removeAttr("href"); //Disables the button so it can't be claimed multiple times
      market_observer.observe(this, config);
      clearTimeout(refresh_id);
      refresh_id = setTimeout(refresh_market, 500);
      return;
    }
    //////console.log("-------------------")
  }
}

loop_rows = function ()
{
  //////console.log("Looping rows");
  $("tr.clickable_row").each(parse_row);
  claim_duplicates();
}

create_autoclaim = function()
{
  //////console.log(7);
  if($("#autoclaim_filters").length === 0)
  {
    $("#main_container").prepend(`<div class="box-content" id="autoclaim_filters" style="min-height: 0px;"></div>`);
    $("#autoclaim_filters").append(`<div class="accordion-group accordion-heading clearfix autoclaim_row autoclaim_header">
    <label>Delay (mins): <input type="text" name = "delay" value = "0" style = "width:40px;" onchange = "delay_changed()" id = "autoclaim_delay"></input></label>
    <label>Timeout (mins): <input type="text" name = "timeout" value = "40" style = "width:40px;" onchange = "timeout_changed()" id = "autoclaim_timeout"></input></label>
    <input type="button" class ="btn" value="+" name="add_autoclaim_filter" style="margin-left:10px" onclick="create_autoclaim_row()" />
    <input type="button" class ="btn" value="Save" name="save_autoclaim" style="margin-left:10px" onclick="save_autoclaim()" />
    <input type="button" class ="btn" value="Reset" name="reset_autoclaim" style="margin-left:10px" onclick="reset_autoclaim()"/>
    <input type="button" class ="btn" value="Show Uniques" name="show_uniques" style="margin-left:10px" onclick="show_uniques()"/>
    <input type="button" class ="btn" value="Hide Uniques" name="hide_uniques" style="margin-left:10px" onclick="hide_uniques()"/>`);
    reset_autoclaim();
  }
}

create_autoclaim_row = function()
{
  //////console.log(8);
  row_html = `<div class="accordion-group accordion-heading clearfix autoclaim_row">
        <label>Projects: 
    <input type="text" name="projects">
</label>
        <label>Rate: 
    <input type="text" name="rate" style="max-width:60px" value = "0:0">
</label>
<label>Bonus: 
    <input type="text" name="bonus" style="max-width:40px" value = "0"></label>
<label>Duration: 
    <input type="text" name="duration" style="max-width:40px" value = "0"></label>
<label>Deadline: 
    <input type="text" name="deadline" style="max-width:60px" value = "0"></label>
<label>Ratio: 
    <input type="text" name="ratio" style="max-width:40px" value = "0"></label>
<label>Minutes: 
    <input type="text" name="minutes" style="max-width:40px" value = "0.0"></label>
    <label>Duplicates:<input type="checkbox" name="duplicates" style="max-width:40px"></label>
<input type="button" class = "btn" name="delete" value="Delete" onclick="delete_autoclaim(this)"></button>
</div>`;
  $("#autoclaim_filters").append(row_html);
  $("#autoclaim_filters label input").change(filters_changed);
}

save_autoclaim = function()
{
  //////console.log(9);
  var params = [];
  for (var filter of filters)
  {
    params.push(filter.params);
  }
  localStorage.setItem("autoclaim", JSON.stringify(params), {expires: 365});
  localStorage.setItem("autoclaim_backup", JSON.stringify(params), {expires: 365});
}

update_autoclaim_titles = function()
{
  $("input[name='deadline']").each(function()
  {
    $(this).attr("title",date_from_time(this.value).toLocaleString());
  });
}

reset_autoclaim = function()
{
  //////console.log(10);
  filters = JSON.parse(localStorage.getItem("autoclaim")).map(function(p) {return new AutoClaimFilter(p)});
  update_filters();
}

filters_changed = function()
{
  //////console.log(11);
  filters =[];
  $(".autoclaim_row").not(".autoclaim_header").each(function(index){
    var inputs = $(this).find("input");
    var params = {projects:inputs[0].value.split("|"), 
      min_base_rate:inputs[1].value.split(":")[0],
      max_base_rate:inputs[1].value.split(":")[1], 
      min_bonus_rate:inputs[2].value, 
      min_duration_in_mins:inputs[3].value.split(":")[0],
      max_duration_in_mins:inputs[3].value.split(":")[1],
      min_deadline:inputs[4].value, 
      min_bonus_ratio:inputs[5].value, 
      minutes_left_to_claim:inputs[6].value, 
      duplicates_only:inputs[7].checked};
    filters.push(new AutoClaimFilter(params));
    
  });
  update_filters();
}

update_filters = function()
{
  //////console.log(12);
  $(".autoclaim_row").not(".autoclaim_header").remove();
  for(var filter of filters)
  {
    create_autoclaim_row();
    var row = $(".autoclaim_row").not(".autoclaim_header").last()[0];
    var inputs = $(row).find("input");
    inputs[0].value = filter.params[projects].join("|");
    inputs[1].value = filter.params[min_base_rate] + ":" + filter.params[max_base_rate];
    inputs[2].value = filter.params[min_bonus_rate];
    inputs[3].value = filter.params[min_duration_in_mins];
    if(filter.params[max_duration_in_mins])
    {
      inputs[3].value = inputs[3].value + ":" + filter.params[max_duration_in_mins];
    }
    inputs[4].value = filter.params[min_deadline] || "0:00";
    inputs[5].value = filter.params[min_bonus_ratio];
    inputs[6].value = parseFloat(filter.params[minutes_left_to_claim]).toFixed(1);
    inputs[7].checked = filter.params[duplicates_only];
  }
}

delete_autoclaim = function(button)
{
  //////console.log(13);
  
  if(window.confirm("Are you sure you want to delete the filter?"))
  { 
    $(button).parent().remove();
    filters_changed();
  }
}

delay_timeout = null;
countdown_interval = null;

delay_changed = function()
{
  //////console.log(14);
  countdown_interval = setInterval (function(){
      delay = $("#autoclaim_delay")[0];
      if (delay.value>0)
      {
        delay.value = delay.value - 1;
        autorefresh_delay = 5000*60;
        enable_autorefresh();
      }
      if (delay.value == 0)
      {
        autorefresh_delay = 5000;
        enable_autorefresh();
        enable_autoclaim();
        clearInterval(countdown_interval);
      }
    }, 1000*60);
}

timeout_changed = function()
{
  //////console.log(15);
  clearTimeout(disable_autoclaim_id);
  if(disable_autoclaim_id)
  {
    disable_autoclaim_id = setTimeout(disable_autoclaim, parseInt($("#autoclaim_timeout").val())*1000*60);
  }
}

autostart = true;
create_button = function()
{
  if ($(".auto-refresh").length == 0)
  {
      //////console.log("Creating buttons: " + disable_autoclaim_id);
      var autorefresh_button = "<a class = 'btn btn-icon auto-refresh'></a>";
      var autoclaim_button = "<a class = 'btn btn-icon auto-claim'></a>"
      $(".icon-refresh").parent().parent().append(autorefresh_button);
      $(".icon-refresh").parent().parent().append(autoclaim_button);
      if(!autostart)
      {
        should_autorefresh  ? enable_autorefresh() : disable_autorefresh();
        disable_autoclaim_id != null ? enable_autoclaim() : disable_autoclaim();
      }
      else
      {
        enable_autorefresh();
        enable_autoclaim();
        autostart = false;
      }
  }
}

enable_autorefresh = function()
{
  should_autorefresh = true;
  $(".auto-refresh").text("Stop Autorefreshing");
  $(".auto-refresh").click(disable_autorefresh);
  should_autorefresh = true;
  current_page = null;
}

disable_autorefresh = function()
{
  $('.auto-refresh').text("Start Autorefreshing");
  $('.auto-refresh').click(enable_autorefresh);
  autostart = false;
  should_autorefresh = false;
  current_page = null;
  clearTimeout(next_filter_function_id);
}

enable_autoclaim = function()
{
  //////console.log(19);
  should_autoclaim = true;
  clearTimeout(disable_autoclaim_id);
  $('.auto-claim').text("Stop Autoclaiming");
  $('.auto-claim').css('background-color', '#98FB98');
  $(".auto-claim").click(disable_autoclaim);
  if(!disable_autoclaim_id)
  {
    timeout = $("#autoclaim_timeout").val() ? $("#autoclaim_timeout").val() * 60 * 1000 : 40*60*1000;
    disable_autoclaim_id = setTimeout(disable_autoclaim, timeout);
  }
  document.onclick = function(){
    clearTimeout(disable_autoclaim_id);
    timeout = $("#autoclaim_timeout").val() ? $("#autoclaim_timeout").val() * 60 * 1000 : 40*60*1000;
    ////console.log(timeout);
    disable_autoclaim_id = setTimeout(disable_autoclaim, timeout);
  };
}

disable_autoclaim = function()
{
  ////console.log("Autoclaim disabled");
  //////console.log(20);
  should_autoclaim = false;
  //////console.log("Disabling autoclaim");
  clearTimeout(disable_autoclaim_id);
  $('.auto-claim').text("Start Autoclaiming");
  $('.auto-claim').css('background-color', '#FFA07A');
  $('.auto-claim').click(enable_autoclaim);
  clearTimeout(disable_autoclaim_id);
  disable_autoclaim_id = null;
  document.onclick = null;
}
//Calculating today's pay

offsetDate = function()
{
    //////console.log(23);
    //This starts a new day at 6 AM
    var offset = 6 * 1000 * 3600;
    return new Date(Date.now() - offset);
}

updatePay = function()
{
  //////console.log(24);
  if($(".daily_pay").length != 0)
  {
    return;
  }
  var total = parseFloat($($("#current_pay h2")[0]).text().substr(1).replace(",", ""));
  if (total === null || isNaN(total))
  {
    return;
  }
  
  var now = offsetDate();
  if (Cookies.get('current_date') != now.toDateString())
  {
      Cookies.set ('current_date', now.toDateString(), {expires: 1} );
      Cookies.set('yesterdays_total', total, {expires: 1});
  }
  var today = total - parseFloat(Cookies.get('yesterdays_total'));
  if (today < 0)
  {
      Cookies.set('yesterdays_total', 0, {expires: 1});
      today = 0;
  }
  
  $("#current_pay").append('<h2 class = "muted daily_pay" style = "margin_top: 10px"> $' + today.toFixed(2) + "</h2>");
  $("#current_pay").append('<div class = "secondColor">TODAY</div>');
  $("#footer_nav ul.box_style li").css("height", 210);
  $(".boxes").css("width", 920)
}

if (window.location.href === "https://jobs.3playmedia.com/pay_stubs")
{
  var earnings = eval($(".main script")[0].text.split("var data = ")[1].split(";")[0])[0];
  var months = $(".tickLabel");
  var end = months[11].textContent.split(" ")[1];
  var ytd_earnings = earnings[11][1];
  for (var i = 10; i>=0; i--)
  {
    var end_i = months[i].textContent.split(" ")[1];
    //////console.log(end);
    //////console.log(end_i);
    if (end === end_i)
    {
      ytd_earnings += earnings[i][1];
    }
  }
  
  var year = (new Date()).getFullYear();
  var jan1 = new Date("January 1, " + year + " 00:00:00");
  var dec31 = (new Date("December 31, " + year + " 23:59:59"));
  var year_elapsed = (new Date()-jan1)/(dec31-jan1);
  var est_earnings = ytd_earnings/year_elapsed;
  $("h1").after("<br><h5>Year to Date</h5><h1>$" + ytd_earnings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + "</h1>" + "<br><h5>Estimated Full Year Earnings</h5><h1>$" +est_earnings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + "</h1>"); 
}

setInterval(updatePay, 100);


$("<style>")
    .prop("type", "text/css")
    .html(`
    
    .autoclaim_row
    {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0px !important;
    }
    .autoclaim_row label
    {
      margin: 5px !important;
    }
    .autoclaim_row label input 
    {
      margin: 0px !important;
    }
    `
    )
    .appendTo("head");

deselect_nonfavorites = function(num_favorites)
{
  if(sort_by_duration && should_autorefresh)
  {
    //console.log("Deselecting nonfavorites");
    //console.log(Date.now() - last_refresh);
    last_refresh = Date.now();
    $("#project-filter-actions div").eq(1).click();
    $(".project_filter").slice(0, 3).prop('checked', false);
    $(".project_filter").slice(0, num_favorites).prop('checked', true);
    $("#project-filter-actions").siblings("button").click();
  }
}

select_nonfavorites = function()
{
  if(sort_by_duration && should_autorefresh)
  {
    //console.log("Selecting nonfavorites");
    //console.log(Date.now() - last_refresh);
    last_refresh = Date.now();
    $(".project_filter").prop('checked', true);
    $("#project-filter-actions").siblings("button").click();
  }
}

current_page = null;
is_loading_next_page = false;

go_to_next_page = function()
{
  console.log("going to next page");
  if(!should_autorefresh || $(".pagination li").length == 0 || $(".pagination li").last().hasClass("disabled") || $(".clickable_row").last().text().indexOf("00:00:") != -1)
  {
    current_page = null;
    is_loading_next_page = false;
    return;
  }
  
  is_loading_next_page = true;
  setTimeout(go_to_next_page, 100);
  
  if(current_page != $(".pagination .active").children().last().text())
  {
    current_page = $(".pagination .active").children().last().text();
    $(".pagination li").last().children().click();
  }
}

next_filter_function_id = null;
switch_filter = function()
{
  console.log
  if(!should_autorefresh || is_loading_next_page)
  {
    return;
  }
  
  last_refresh = Date.now();
  if($("#sort_by").length == 0)
  {
    refresh_market();
  }
  else
  {
    for(i in refresh_rotation)
    {
      //console.log(i);
      //console.log(refresh_rotation[i]);
      filter_name = refresh_rotation[i][0];
      if ($("#sort_by").val() == filter_name || i==refresh_rotation.length-1)
      {
        next_index = parseInt(i) + 1  < refresh_rotation.length ? parseInt(i)+1: 0;
        next_filter_name = refresh_rotation[next_index][0];
        next_filter_function = refresh_rotation[next_index][1];
        $("#sort_by").val(next_filter_name).trigger("change");
        next_filter_function_id = setTimeout(next_filter_function, autorefresh_delay/2);
        break;
      }
    }
  }
  
  //console.log("Switching filter");
  //console.log(Date.now() - last_refresh);
}

hide_uniques_id = null;
hide_uniques = function()
{
  Cookies.set('should_hide_uniques', 'true');
  rows = $(".clickable_row, .claiming_action");
  rows.hide();
  if(rows.length == 1)
  {
    rows = $(".clickable_row, .claiming_action").hide();
  }
  for (let i = 0; i<rows.length-1; i++)
  {
    row = rows[i];
    nextRow = rows[i+1];
    time = $(row).children()[3].textContent;
    nextTime = $(nextRow).children()[3].textContent;
    if(time == nextTime)
    {
      $(row).show();
      $(nextRow).show();
    }
  }
  
  hide_uniques_id = setTimeout(hide_uniques, 100);
}

claim_duplicates = function()
{
  rows = $(".clickable_row, .claiming_action");
  for(let i = 0; i<rows.length-1; i++)
  {
    row = rows[i];
    nextRow = rows[i+1];
    time = $(row).children()[3].textContent;
    nextTime = $(nextRow).children()[3].textContent;
    
    name = $(row).children()[0].textContent.split("\n").filter(function(val){return val.split(" | ").length > 1})[0].split(" | ")[1];
    name = name.split(") ")[1] ? name.split(") ")[1] : name;
    nextName = $(nextRow).children()[0].textContent.split("\n").filter(function(val){return val.split(" | ").length > 1})[0].split(" | ")[1];
    if(!nextName)
    {
      console.log(nextRow.textContent);
    }
    nextName = nextName.split(") ")[1] ? nextName.split(") ")[1] : nextName;
    
    id = $(row).children()[0].textContent.split("\n").filter(function(val){return val.split(" | ").length > 1})[0].split(" | ")[0];
    nextID = $(nextRow).children()[0].textContent.split("\n").filter(function(val){return val.split(" | ").length > 1})[0].split(" | ")[1];
    
    if (id == nextID || name != nextName || time != nextTime)
    {
      continue;
    }
    
    for(filter of filters)
    {
      if(filter.params[duplicates_only] && filter.should_claim_row(row) && filter.should_claim_row(nextRow))
      {
        $(row).find(".btn").click();
        $(row).find(".btn").removeAttr("href"); //Disables the button so it can't be claimed multiple times
        
        $(nextRow).find(".btn").click();
        $(nextRow).find(".btn").removeAttr("href"); //Disables the button so it can't be claimed multiple times
        
        filter.reduce_time_left(row);
        update_filters();
        break;
      }
    }
  }
}


show_uniques = function()
{
  clearInterval(hide_uniques_id);
  $(".clickable_row").show();
  Cookies.set('should_hide_uniques', 'false');
}

if(document.URL.startsWith("https://jobs.3playmedia.com/available_jobs"))
{
  create_button();
  display_percentages();
  setInterval(create_autoclaim, 100);
  autorefresh_id = setInterval(switch_filter, autorefresh_delay);
  
  if(should_hide_uniques)
  {
    hide_uniques();
  }
  
  setInterval(update_autoclaim_titles, 1000);
}

save_sort = function()
{
  Cookies.set("sort_by", $("#sort_by").val());
}

save_old_file_contents = function()
{
  words = {};
  $(".p3-transcript-main span").each(function(){words[this.getAttribute("m")] = this.textContent});
  
  first_spans = $(".p3-transcript-main span:first-child")
  paragraphs = $.map(first_spans, function(e){return parseInt(e.getAttribute("m"))});
  edited = {"words":words, "paragraphs":paragraphs};
  console.log(JSON.stringify(edited));
}

setInterval(function(){$(".clickable_row td").filter(function(){return $(this).index() <9}).removeClass("no-click no_follow")}, 200);

if (document.URL.startsWith("https://jobs.3playmedia.com/assigned_jobs"))
{
  $("#sort_by").change(save_sort);
  if(Cookies.get("sort_by") && should_save_sort)
  {
    $("#sort_by").val(Cookies.get("sort_by")).trigger("change");
  }
  else
  {
    save_sort();
  }
}



  
