//Adds the ability to automatically refresh the marketplace every 2 seconds

interval_id = null;
interval_duration = 2000;

toggle_autorefresh = function()
{
    
    if (!interval_id)
    {
        interval_id = setInterval(function(){$(".btn.btn-icon").click()}, interval_duration);
        $("#auto_refresh").text("Stop Autorefreshing");
    }
    else
    {
        clearInterval(interval_id);
        interval_id = null;
        $("#auto_refresh").text("Start Autorefreshing");
    }
}

if (window.location.href === "http://jobs.3playmedia.com/available_jobs")
{
    $("#wrapper").prepend('<div class="pull-right" style="padding-right: 10px; padding-top: 20px"><button id="auto_refresh">Stop Autorefreshing</button></div>')
    $("#auto_refresh").click(toggle_autorefresh);
    toggle_autorefresh();
}
