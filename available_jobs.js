!function(e){var n=!1;if("function"==typeof define&&define.amd&&(define(e),n=!0),"object"==typeof exports&&(module.exports=e(),n=!0),!n){var o=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=o,t}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var o=arguments[e];for(var t in o)n[t]=o[t]}return n}function n(o){function t(n,r,i){var c;if("undefined"!=typeof document){if(arguments.length>1){if("number"==typeof(i=e({path:"/"},t.defaults,i)).expires){var a=new Date;a.setMilliseconds(a.getMilliseconds()+864e5*i.expires),i.expires=a}i.expires=i.expires?i.expires.toUTCString():"";try{c=JSON.stringify(r),/^[\{\[]/.test(c)&&(r=c)}catch(e){}r=o.write?o.write(r,n):encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=(n=(n=encodeURIComponent(String(n))).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent)).replace(/[\(\)]/g,escape);var s="";for(var f in i)i[f]&&(s+="; "+f,!0!==i[f]&&(s+="="+i[f]));return document.cookie=n+"="+r+s}n||(c={});for(var p=document.cookie?document.cookie.split("; "):[],d=/(%[0-9A-Z]{2})+/g,u=0;u<p.length;u++){var l=p[u].split("="),C=l.slice(1).join("=");this.json||'"'!==C.charAt(0)||(C=C.slice(1,-1));try{var g=l[0].replace(d,decodeURIComponent);if(C=o.read?o.read(C,g):o(C,g)||C.replace(d,decodeURIComponent),this.json)try{C=JSON.parse(C)}catch(e){}if(n===g){c=C;break}n||(c[g]=C)}catch(e){}}return c}}return t.set=t,t.get=function(e){return t.call(t,e)},t.getJSON=function(){return t.apply({json:!0},[].slice.call(arguments))},t.defaults={},t.remove=function(n,o){t(n,"",e(o,{expires:-1}))},t.withConverter=n,t}return n(function(){})});
//# sourceMappingURL=/sm/f6937b1819ab68f00d8b787ead6c16bfb67977e0c408909621a3b2ff82dbad4a.map

//Adds the ability to automatically refresh the marketplace every 2 seconds

interval_id = null;
stop_autoclaim_id = null;
autoclaim_timeout_countdown_id = null;
interval_duration = 5000;
autoclaim_timeout = 40;

claim_id = null;

job_strings = [];

//Autoclaiming
parse_deadline = function (deadline)
{
  //console.log("1");
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
  //console.log("2");
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
  
  should_claim_row(row)
  {
    //console.log("3");
    var tds = $(row).find('td');
    var project = tds.eq(0).text();
    var rate = parseFloat(tds.eq(4).text().substring(1));
    var bonus = parseFloat(tds.eq(5).text().trim().substring(1));
    bonus = bonus ? bonus : 0.0;
    var duration = parse_duration(tds.eq(3).text().split(":"));
    var deadline = parse_deadline(tds.eq(8).text());
    
    var base_passes = rate <= parseFloat(this.params[max_base_rate]);
    var bonus_passes = bonus >= parseFloat(this.params[min_bonus_rate]);
    var deadline_passes = deadline >= ((new Date()).getTime() + parseInt(this.params[min_deadline_in_mins]) * 60 * 1000);
    var bonus_ratio_passes = bonus / rate >= parseFloat(this.params[min_bonus_ratio]);
    var projects_pass = true;
    
    var not_in_project = this.params[projects].filter(function(string){return string[0] == "-"});
    var in_project = this.params[projects].filter(function(string){return string[0] != "-"});
    for(var i in not_in_project)
    {
      var not_project = not_in_project[i].substring(1);
      if (project.indexOf(not_project) != -1)
      {
        return false;
      }
    }
    
    for (i in in_project)
    {
      projects_pass = false;
      if (project.indexOf(in_project[i]) != -1)
      {
        projects_pass = true;
        break;
      }
    }
    var time_left_passes = parseInt(this.params[minutes_left_to_claim]) > duration;
    var duration_passes = parseInt(this.params[min_duration_in_mins]) <= duration;
    
    return duration_passes && base_passes && bonus_passes && deadline_passes && bonus_ratio_passes && projects_pass && time_left_passes;
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

parse_row = function()
{
  //console.log("4");
  job_string = $(this).text().replace(/\n|\r/g, "|").split("|").filter(Boolean).join("|");
  if(job_strings.includes(job_string))
  {
    return;
  }
  job_strings.push(job_string);
  
  for (var filter in filters)
  {
    if(filters[filter].should_claim_row(this))
    {
      filters[filter].reduce_time_left(this);
      params = [];
      for (var f in filters)
      {
        params.push(filters[f].params);
      }
      update_filters(params);
      $(this).find(".btn").click();
      console.log("Claiming:", job_string);
      this.remove();
      return;
    }
  }
}

loop_rows = function ()
{
  //console.log("5");
  $("tr.clickable_row").each(parse_row);
}

create_autoclaim = function()
{
  //console.log("6");
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
  //console.log("7");
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
  //console.log("8");
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
  //console.log("9");
  update_filters(Cookies.getJSON("autoclaim"));
}

filters_changed = function()
{
  //console.log("10");
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
  //console.log("11");
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
  //console.log("12");
  $(button).parent().remove();
  filters_changed();
}

delay_timeout = null;
countdown_interval = null;

delay_changed = function()
{
  //console.log("13");
  delay = parseInt($("#autoclaim_delay")[0].value);
  clearTimeout(delay);
  delay_timeout = setTimeout(toggle_autoclaim, delay*1000*60);
  clearInterval(countdown_interval);
  countdown_interval = setInterval (function(){
      delay = $("#autoclaim_delay")[0];
      delay_in_mins = parseInt(delay.value);
      if (delay_in_mins>0)
      {
        delay.value = delay_in_mins - 1;
      }
    }, 1000*60);
}

timeout_changed = function()
{
  //console.log("14");
  autoclaim_timeout = parseInt($("#autoclaim_timeout")[0].value);
  reset_autoclaim_timeout();
}

create_button = function()
{
  //console.log("15");
  if ($(".auto-refresh").length === 0)
  {
    //console.log("28");
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
      style_autoclaim();
  }
}

toggle_autorefresh = function()
{
  //console.log("16");
  if (!interval_id)
  {
      interval_id = setInterval(function(){
        //console.log("26");
        $(".btn.btn-icon").not(".auto-refresh").not(".auto-claim").click(); 
      }, interval_duration);
      $(".auto-refresh").text("Stop Autorefreshing");
  }
  else
  {
    clearInterval(interval_id);
    interval_id = null;
    $(".auto-refresh").text("Start Autorefreshing");
  }
}

style_autoclaim = function()
{
  //console.log("17");
  if (claim_id)
  {
    $('.auto-claim').text("Stop Autoclaiming");
    $('.auto-claim').css('background-color', '#98FB98');
  }
  else
  {
    $('.auto-claim').text("Start Autoclaiming");
    $('.auto-claim').css('background-color', '#FFA07A');
  }
}

start_autoclaim = function()
{
  //console.log("18");
  claim_id = setInterval(loop_rows, 100);
  reset_autoclaim_timeout();
}

stop_autoclaim = function()
{
  //console.log("19");
  clearInterval(claim_id);
  clearInterval(autoclaim_timeout_countdown_id);
  claim_id = null;
}

toggle_autoclaim = function()
{
  //console.log("20");
  if (claim_id)
  {
    stop_autoclaim();
  }
  else
  {
    start_autoclaim();
  }
  style_autoclaim();
}


if (window.location.href === "https://jobs.3playmedia.com/available_jobs")
{
  //console.log("21");
    setInterval(create_button, 100);
    toggle_autorefresh();
    
    setInterval(function(){
      //console.log("27");
      job_strings = []
    }, 6000);
    setInterval(create_autoclaim, 100);
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
    console.log(end);
    console.log(end_i);
    if (end === end_i)
    {
      ytd_earnings += earnings[i][1];
    }
  }
  
  $("h1").after("<br><h5>Year to Date</h5><h1>$" + ytd_earnings.toLocaleString() + "</h1>")
}

//Calculating today's pay

offsetDate = function()
{
  //console.log("22");
    //This starts a new day at 6 AM
    offset = 6 * 1000 * 3600;
    return new Date(Date.now() - offset);
}

updatePay = function()
{
  //console.log("23");
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

reset_autoclaim_timeout = function()
{
  //console.log("24");
  clearTimeout(stop_autoclaim_id);
  clearTimeout(autoclaim_timeout_countdown_id);
  
  stop_autoclaim_id = setTimeout(function()
  {
    stop_autoclaim(); 
    style_autoclaim();
    
  }
  , autoclaim_timeout*1000*60);
  if(document.activeElement != $("#autoclaim_timeout")[0])
  {
    $("#autoclaim_timeout")[0].value = autoclaim_timeout;
  }
  autoclaim_timeout_countdown_id = setTimeout(function()
  {
    //console.log("25");
    $("#autoclaim_timeout")[0].value = Math.max(parseInt($("#autoclaim_timeout")[0].value) - 1, 0);
  }, 1000*60);
}


$(document).click(reset_autoclaim_timeout);

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
