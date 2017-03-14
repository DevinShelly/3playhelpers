//Adds the following functunality to within a job
// Ctr + [ decreases playback speed by 0.1
// Ctr + ] increases playback speed by 0.1
// Double tapping Ctr + Space will toggle between a speed of 1.0 and your previous non-1.0 speed
// Also increases the maximum speed from 2.0 to 4.0, at which point the audio cuts out

updateDisplay = function(display)
{
    while ($("#speed-display").length === 0)
    {
        $($(".btn-group:last")).after("<div class = 'btn-group' id = 'speed-display'></div>")
    }
    $("#speed-display").text(display);
}

changeSpeed = function(changeBy)
{
    speed = $("*[ng-model='ctrl.userSetting.video_playback_rate']");
    speed.attr("max", 4);
    speed.val(parseFloat(speed.val()) + changeBy);
    angular.element(speed).triggerHandler("input");
    updateDisplay(speed.val());
}

previousSpeed = 1.0;
toggleSpeed = function()
{
    speed = $("*[ng-model='ctrl.userSetting.video_playback_rate']");
    currentSpeed = parseFloat(speed.val());
    console.log(currentSpeed);
    if (currentSpeed != 1.0)
    {
        changeSpeed(1.0 - currentSpeed);
        previousSpeed = currentSpeed;
    }
    else
    {
        changeSpeed(previousSpeed - currentSpeed);
    }
}

previousSpace = Date.now();
document.onkeydown = function(e)
{
    leftBracket = 219;
    rightBracket = 221;
    space = 32;
    f5 = 116;
    
    if (!e.ctrlKey && e.which != f5 && !(e.which == space && e.shiftKey))
    {
        return;
    }
    
    switch (e.which)
    {
        case leftBracket:
            changeSpeed(-0.1);
            break;
        case rightBracket:
            changeSpeed(0.1);
            break;
        case space:
            if (Date.now() - previousSpace  < 500)
            {
                toggleSpeed();
            }
            previousSpace = Date.now(0);
            break;
        case f5:
            e.preventDefault();
            break;
    }
}
