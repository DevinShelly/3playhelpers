!function(e){var n=!1;if("function"==typeof define&&define.amd&&(define(e),n=!0),"object"==typeof exports&&(module.exports=e(),n=!0),!n){var o=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=o,t}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var o=arguments[e];for(var t in o)n[t]=o[t]}return n}function n(o){function t(n,r,i){var c;if("undefined"!=typeof document){if(arguments.length>1){if("number"==typeof(i=e({path:"/"},t.defaults,i)).expires){var a=new Date;a.setMilliseconds(a.getMilliseconds()+864e5*i.expires),i.expires=a}i.expires=i.expires?i.expires.toUTCString():"";try{c=JSON.stringify(r),/^[\{\[]/.test(c)&&(r=c)}catch(e){}r=o.write?o.write(r,n):encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=(n=(n=encodeURIComponent(String(n))).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent)).replace(/[\(\)]/g,escape);var s="";for(var f in i)i[f]&&(s+="; "+f,!0!==i[f]&&(s+="="+i[f]));return document.cookie=n+"="+r+s}n||(c={});for(var p=document.cookie?document.cookie.split("; "):[],d=/(%[0-9A-Z]{2})+/g,u=0;u<p.length;u++){var l=p[u].split("="),C=l.slice(1).join("=");this.json||'"'!==C.charAt(0)||(C=C.slice(1,-1));try{var g=l[0].replace(d,decodeURIComponent);if(C=o.read?o.read(C,g):o(C,g)||C.replace(d,decodeURIComponent),this.json)try{C=JSON.parse(C)}catch(e){}if(n===g){c=C;break}n||(c[g]=C)}catch(e){}}return c}}return t.set=t,t.get=function(e){return t.call(t,e)},t.getJSON=function(){return t.apply({json:!0},[].slice.call(arguments))},t.defaults={},t.remove=function(n,o){t(n,"",e(o,{expires:-1}))},t.withConverter=n,t}return n(function(){})});
//# sourceMappingURL=/sm/f6937b1819ab68f00d8b787ead6c16bfb67977e0c408909621a3b2ff82dbad4a.map

//Adds the ability to automatically refresh the marketplace every 2 seconds

autorefresh_delay = 5000;
autorefresh_id = null;
should_autoclaim = false;
autoclaim_duration = 40;
disable_autoclaim_id = null;

observe_market_container = function(mutationsList, observer) 
{
  ////console.log(1);
  for(let mutation of mutationsList) 
  {
    
    if (mutation.type === 'childList') 
    {
      for(node of mutation.addedNodes)
      {
        //The table has refreshed, so start the autotimer again if necessary
        if($(node).find("#jobs_table").length>0)
        {
          if(autorefresh_id)
          {
            clearTimeout(autorefresh_id);
            autorefresh_id = setTimeout(click_refresh, autorefresh_delay);
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
        console.log(node.textContent)
        
      }
    }
  }
};

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
  ////console.log(2);
  pm = deadline.trim().slice(-2) == "pm";
  deadline = deadline.trim().substring(0, deadline.trim().length-2);
  hours = deadline.split(":")[0].slice(-2);
  minutes = deadline.slice(-2);
  if (hours != "12" && pm)
  {
    newHours = parseInt(hours) + 12;
    deadline = deadline.split(",")[0] + ", " + newHours.toString() + ":" + minutes;
  }
  deadline = deadline.split(",")[0] + ", 2020 " + deadline.split(", ")[1];
  return  Date.parse(deadline);
}

parse_duration = function(duration)
{
  ////console.log(3);
  return parseInt(duration[0])*60 + parseInt(duration[1]);
}

const max_base_rate = "max_base_rate";
const min_bonus_rate = "min_bonus_rate";
const min_duration_in_mins = "min_duration_in_mins";
const min_deadline_in_mins = "min_deadline_in_mins";
const projects = "projects";
const min_bonus_ratio = "min_bonus_ratio";
const minutes_left_to_claim = "minutes_left_to_claim";

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
    var passes = rate <= parseFloat(this.params[max_base_rate]);
    if (!passes)
    {
      ////console.log("base " + rate);
    }
    return passes;
    
  }
  
  bonus_passes(bonus)
  {
    var passes =  bonus >= parseFloat(this.params[min_bonus_rate]);
    if (!passes)
    {
      ////console.log("bonus " + bonus);
    }
    return passes;
  }
  
  deadline_passes(deadline)
  {
    
    var passes = deadline >= ((new Date()).getTime() + parseInt(this.params[min_deadline_in_mins]) * 60 * 1000);
    if (!passes)
    {
      ////console.log("deadline " + deadline);
    }
    return passes;
  }
  
  bonus_ratio_passes(ratio)
  {
    var passes = ratio >= parseFloat(this.params[min_bonus_ratio]);
    if (!passes)
    {
      ////console.log("ratio " + ratio);
    }
    return passes;
  }
  
  in_project(in_project, project)
  {
    if(in_project.length == 0)
    {
      return true;
    }
    for (i in in_project)
    {
      if (project.indexOf(in_project[i]) != -1)
      {
        return true;
      }
    }
    ////console.log("in project " + in_project);
    return false;
  }
  
  not_in_project(not_in_project, project)
  {
    for(var i in not_in_project)
    {
      var not_project = not_in_project[i].substring(1);
      if (project.indexOf(not_project) != -1)
      {
        ////console.log("not in project " + not_project);
        return true;
      }
    }
    return false;
  }
  
  time_left_passes(duration)
  {
    var passes =  parseInt(this.params[minutes_left_to_claim]) > duration;
    if (!passes)
    {
      ////console.log("time_left " + duration);
    }
    return passes;
  }
  
  duration_passes(duration)
  {
    var passes =  parseInt(this.params[min_duration_in_mins]) <= duration;
    if (!passes)
    {
      ////console.log("duration " + duration);
    }
    return passes;
  }
  
  should_claim_row(row)
  {
    ////console.log(4);
    
    if (this.params[projects] == ["DUPLICATES"])
    {
      previously_claimed_files = JSON.parse(localStorage.getItems("previously_claimed_files"));
      if (previously_claimed_files.indexOf(name_duration_pair(row)))
      {
        return true;
      }
    }
    
    var tds = $(row).find('td');
    var project = tds.eq(0).text();
    var rate = parseFloat(tds.eq(4).text().substring(1));
    var bonus = parseFloat(tds.eq(5).text().trim().substring(1));
    bonus = bonus ? bonus : 0.0;
    var duration = parse_duration(tds.eq(3).text().split(":"));
    var deadline = parse_deadline(tds.eq(8).text());
    
    var base_passes = this.base_passes(rate);
    var bonus_passes = this.bonus_passes(bonus);
    var deadline_passes = true;//this.deadline_passes(deadline);
    var bonus_ratio_passes = this.bonus_ratio_passes(bonus/rate); //bonus / rate >= parseFloat(this.params[min_bonus_ratio]);
    var time_left_passes = this.time_left_passes(duration); //parseInt(this.params[minutes_left_to_claim]) > duration;
    var duration_passes = this.duration_passes(duration); //parseInt(this.params[min_duration_in_mins]) <= duration;
    
    
    var in_project = this.in_project(this.params[projects].filter(function(string){return string[0] != "-"}), project);
    var not_in_project = this.not_in_project(this.params[projects].filter(function(string){return string[0] == "-"}), project);
    
    return duration_passes & base_passes & bonus_passes & deadline_passes & bonus_ratio_passes & in_project & time_left_passes & !not_in_project;
  }
  
  reduce_time_left(row)
  {
    var tds = $(row).find('td');
    var duration = parse_duration(tds.eq(3).text().split(":"));
    this.params[minutes_left_to_claim] -= duration;
  }
  
  toString()
  {
    return "base: " + this.max_base_rate.toString() + " bonus: " + this.min_bonus_rate.toString() + 
    " bonus_ratio: " + this.min_bonus_ratio.toString() +" duration: " + this.min_duration_in_mins.toString() + 
    " deadline: " + this.min_deadline_in_mins.toString() + " project: " + this.project_name + 
    " minutes left: " + this.minutes_left_to_claim.toString();
  }
}

filters = [];

name_duration_pair = function(row)
{
  tds = $(row).find("td");
  duration = tds.eq(3).text().trim();
  name = tds.eq(0).text().split("| ")[1];
  name = name.split(")").length > 1 ? name.split(")")[1].trim() : name.trim();
  return {name:name, duration:duration};
}

file_was_claimed = function(row) 
{
  console.log(row);
  previously_claimed_files = JSON.parse(localStorage.getItem("previously_claimed_files"));
  previously_claimed_files.push(name_duration_pair(row));
  localStorage.setItem("previously_claimed_files", JSON.stringify(previously_claimed_files));
  
  for (var filter of filters)
  {
    if(filter.should_claim_row(row))
    {
      console.log("Filter claimed file:" + row.textContent + " " + JSON.stringify(filter.params));
      filter.reduce_time_left(row);
      return;
    }
  }
}

parse_row = function()
{
  for (var filter of filters)
  {
    if(filter.should_claim_row(this))
    {
      $(this).find(".btn").click();
      $(this).find(".btn").removeAttr("href"); //Disables the button so it can't be claimed multiple times
      row_observer.observe(this, config);
      console.log("Claiming:" + $(this).text());
      console.log(filter.params);
      return;
    }
    ////console.log("-------------------")
  }
  
}

loop_rows = function ()
{
  //console.log("Looping rows");
  $("tr.clickable_row").each(parse_row);
}

create_autoclaim = function()
{
  ////console.log(7);
  if($("#autoclaim_filters").length === 0)
  {
    $("#main_container").prepend(`<div class="box-content" id="autoclaim_filters" style="min-height: 0px;"></div>`);
    $("#autoclaim_filters").append(`<div class="accordion-group accordion-heading clearfix autoclaim_row autoclaim_header">
    <label>Delay (mins): <input type="text" name = "delay" value = "0" style = "width:40px;" onchange = "delay_changed()" id = "autoclaim_delay"></input></label>
    <label>Timeout (mins): <input type="text" name = "timeout" value = "40" style = "width:40px;" onchange = "timeout_changed()" id = "autoclaim_timeout"></input></label>
    <input type="button" value="+" name="add_autoclaim_filter" style="margin-left:10px" onclick="create_autoclaim_row()" />
    <input type="button" value="Save" name="save_autoclaim" style="margin-left:10px" onclick="save_autoclaim()" />
    <input type="button" value="Reset" name="reset_autoclaim" style="margin-left:10px" onclick="reset_autoclaim()"/>`);
    reset_autoclaim();
  }
}

create_autoclaim_row = function()
{
  ////console.log(8);
  row_html = `<div class="accordion-group accordion-heading clearfix autoclaim_row">
        <label>Projects: 
    <input type="text" name="projects">
</label>
        <label>Rate: 
    <input type="text" name="rate" style="max-width:40px">
</label>
<label>Bonus: 
    <input type="text" name="bonus" style="max-width:40px"></label>
<label>Duration: 
    <input type="text" name="duration" style="max-width:40px"></label>
<label>Deadline: 
    <input type="text" name="deadline" style="max-width:40px"></label>
<label>Ratio: 
    <input type="text" name="ratio" style="max-width:40px"></label>
<label>Minutes: 
    <input type="text" name="minutes" style="max-width:40px"></label>
<input type="button" name="delete" value="Delete" onclick="delete_autoclaim(this)"></button>
</div>`;
  $("#autoclaim_filters").append(row_html);
  $("#autoclaim_filters label input").change(filters_changed);
}

save_autoclaim = function()
{
  ////console.log(9);
  var params = [];
  for (var f in filters)
  {
    var filter = filters[f];
    params.push(filter.params);
  }
  Cookies.set("autoclaim", params, {expires: 365});
}

reset_autoclaim = function()
{
  ////console.log(10);
  update_filters(Cookies.getJSON("autoclaim"));
}

filters_changed = function()
{
  ////console.log(11);
  params = [];
  $(".autoclaim_row").not(".autoclaim_header").each(function(index){
    inputs = $(this).find("input");
    param = {projects:inputs[0].value.split("|"), max_base_rate:inputs[1].value, min_bonus_rate:inputs[2].value, min_duration_in_mins:inputs[3].value, 
    min_deadline_in_mins:inputs[4].value, min_bonus_ratio:inputs[5].value, minutes_left_to_claim:inputs[6].value};
    params.push(param);
  });
  update_filters(params);
}

update_filters = function(params)
{
  ////console.log(12);
  filters = [];
  $(".autoclaim_row").not(".autoclaim_header").remove();
  for(var p in params)
  {
    filters.push(new AutoClaimFilter(params[p]));
    create_autoclaim_row();
    row = $(".autoclaim_row").not(".autoclaim_header").last()[0];
    inputs = $(row).find("input");
    inputs[0].value = params[p][projects].join("|");
    inputs[1].value = params[p][max_base_rate];
    inputs[2].value = params[p][min_bonus_rate];
    inputs[3].value = params[p][min_duration_in_mins];
    inputs[4].value = params[p][min_deadline_in_mins];
    inputs[5].value = params[p][min_bonus_ratio];
    inputs[6].value = params[p][minutes_left_to_claim];
  }
}

delete_autoclaim = function(button)
{
  ////console.log(13);
  $(button).parent().remove();
  filters_changed();
}

delay_timeout = null;
countdown_interval = null;

delay_changed = function()
{
  ////console.log(14);
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
  ////console.log(15);
  clearTimeout(disable_autoclaim_id);
  if(disable_autoclaim_id)
  {
    disable_autoclaim_id = setTimeout(disable_autoclaim, parseInt($("#autoclaim_timeout").val())*1000*60);
  }
}

create_button = function()
{
  //console.log("Creating buttons");
  if ($(".auto-refresh").length == 0)
  {
      //console.log("Creating buttons: " + disable_autoclaim_id);
      autorefresh_button = "<a class = 'btn btn-icon auto-refresh'></a>";
      autoclaim_button = "<a class = 'btn btn-icon auto-claim'></a>"
      $("#main_container .btn-icon").parent().append(autorefresh_button);
      $("#main_container .btn-icon").parent().append(autoclaim_button);
      autorefresh_id != null ? enable_autorefresh() : disable_autorefresh();
      disable_autoclaim_id != null ? enable_autoclaim() : disable_autoclaim();
  }
}

enable_autorefresh = function()
{
  clearTimeout(autorefresh_id);
  autorefresh_id = setTimeout(click_refresh, autorefresh_delay);
  $(".auto-refresh").text("Stop Autorefreshing");
  $(".auto-refresh").click(disable_autorefresh);
}

disable_autorefresh = function()
{
  //console.log("Disabling autorefresh");
  clearTimeout(autorefresh_id);
  autorefresh_id = null;
  $('.auto-refresh').text("Start Autorefreshing");
  $('.auto-refresh').click(enable_autorefresh);
}

enable_autoclaim = function()
{
  ////console.log(19);
  should_autoclaim = true;
  clearTimeout(disable_autoclaim_id);
  $('.auto-claim').text("Stop Autoclaiming");
  $('.auto-claim').css('background-color', '#98FB98');
  $(".auto-claim").click(disable_autoclaim);
  if(!disable_autoclaim_id)
  {
    disable_autoclaim_id = setTimeout(disable_autoclaim, $("#autoclaim_timeout").val()*60*1000);
  }
  document.onclick = function(){
    clearTimeout(disable_autoclaim_id);
    disable_autoclaim_id = setTimeout(disable_autoclaim, $("#autoclaim_timeout").val()*60*1000);
    ////console.log("Resetting autoclaim delay");
  };
  //console.log("Enabled autoclaim:" + disable_autoclaim_id);
}

disable_autoclaim = function()
{
  ////console.log(20);
  should_autoclaim = false;
  //console.log("Disabling autoclaim");
  clearTimeout(disable_autoclaim_id);
  $('.auto-claim').text("Start Autoclaiming");
  $('.auto-claim').css('background-color', '#FFA07A');
  $('.auto-claim').click(enable_autoclaim);
  clearTimeout(disable_autoclaim_id);
  disable_autoclaim_id = null;
  document.onclick = null;
}

if (window.location.href === "https://jobs.3playmedia.com/available_jobs")
{
    ////console.log(22);
    setInterval(create_autoclaim, 100);
}

//Calculating today's pay

offsetDate = function()
{
    ////console.log(23);
    //This starts a new day at 6 AM
    offset = 6 * 1000 * 3600;
    return new Date(Date.now() - offset);
}

updatePay = function()
{
  ////console.log(24);
  if($(".daily_pay").length != 0)
  {
    return;
  }
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
  
  $("#current_pay").append('<h2 class = "muted daily_pay" style = "margin_top: 10px"> $' + today.toFixed(2) + "</h2>");
  $("#current_pay").append('<div class = "secondColor">TODAY</div>');
  $("#footer_nav ul.box_style li").css("height", 210);
  $(".boxes").css("width", 920)
}

if (window.location.href === "https://jobs.3playmedia.com/pay_stubs")
{
  earnings = eval($(".main script")[0].text.split("var data = ")[1].split(";")[0])[0];
  months = $(".tickLabel");
  end = months[11].textContent.split(" ")[1];
  ytd_earnings = earnings[11][1];
  for (var i = 10; i>=0; i--)
  {
    end_i = months[i].textContent.split(" ")[1];
    ////console.log(end);
    ////console.log(end_i);
    if (end === end_i)
    {
      ytd_earnings += earnings[i][1];
    }
  }
  
  year = (new Date()).getFullYear();
  jan1 = new Date("January 1, " + year + " 00:00:00");
  dec31 = (new Date("December 31, " + year + " 23:59:59"));
  year_elapsed = (new Date()-jan1)/(dec31-jan1);
  est_earnings = ytd_earnings/year_elapsed;
  $("h1").after("<br><h5>Year to Date</h5><h1>$" + ytd_earnings.toLocaleString() + "</h1>" + "<br><h5>Estimated Full Year Earnings</h5><h1>$" +est_earnings.toLocaleString() + "</h1>"); 
  
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
  
click_refresh = function()
{
   //console.log("Clicking refresh");
  $(".icon-refresh").eq(0).parent().click();
}

create_button();
  
