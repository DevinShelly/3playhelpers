//Adds the ability to automatically refresh the marketplace every 2 seconds

interval_id = null;
interval_duration = 2000;

create_button = function()
{
    if ($(".auto-refresh").length === 0)
    {
        button_html = "<a class = 'btn btn-icon auto-refresh'>Stop Autorefreshing</button>";
        $("#main_container .btn-icon").parent().append(button_html)
        $(".auto-refresh").click(toggle_autorefresh);
        if (!interval_id)
        {
            $(".auto-refresh").text("Start Autorefreshing");
        }
    }
}

toggle_autorefresh = function()
{
    if (!interval_id)
    {
        interval_id = setInterval(function(){$(".btn.btn-icon").not(".auto-refresh").click(); }, interval_duration);
        $(".auto-refresh").text("Stop Autorefreshing");
    }
    else
    {
        clearInterval(interval_id);
        interval_id = null;
        $(".auto-refresh").text("Start Autorefreshing");
    }
}

if (window.location.href === "http://jobs.3playmedia.com/available_jobs")
{
    create_button();
    setInterval(create_button, 10);
    toggle_autorefresh();
    setInterval(function(){
        if($(".clickable_row").length == 1)
        {
            $(".clickable_row").click();
        }
    }, 0.5);
}
