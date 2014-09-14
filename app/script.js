var options = new Options({
    'notification.enabled': NOTIFICATION_ENABLED,
    'audio-notification.enabled': AUDIO_NOTIFICATION_ENABLED,
    'audio-notification.type': AUDIO_NOTIFICATION_TYPE_DEFAULT
});

var is_focused = true;

var beep = (function() {
    var ctx = new(window.audioContext || window.webkitAudioContext);
    return function(duration, type, finishedCallback) {

        duration = +duration;

        if (typeof finishedCallback != "function") {
            finishedCallback = function() {};
        }

        var osc = ctx.createOscillator();

        osc.type = type;

        osc.connect(ctx.destination);
        osc.noteOn(0);

        setTimeout(function() {
            osc.noteOff(0);
            finishedCallback();
        }, duration);

    };
}());

function send_command(com, data)
{
    window.postMessage({type:"DICE_HELPER", command: com, data: data}, "*");
}

(function init_rain_notification()
{
    pipe.events.rainStarted = view.pipeevents.rainStarted = function (n, t) {
	++view.chatLineId;
	var i = $("<p/>").attr("data-chatnum", view.chatLineId).attr("class", "Rain"),
	    r = $("<span/>").attr("class", "TextButton").text(phrases.btc + " / " + phrases.doge);
	r.appendTo(i);
	data.chat.rainStart = (new Date).getTime();
	t || i.css({
	    opacity: "0.01",
	    position: "absolute",
	    left: "-1000px",
	    top: "-1000px"
	});
	view.addElementToChat(i);
	r.click(function () {
	    data.chat.rainClick = data.chat.rainCollect = (new Date).getTime() - data.chat.rainStart;
	    view.controls.openCollectRainBox()
	});
	if (t && n > 2 && ($("#ChatTab").is(":not(:visible)") || !is_focused)) {
	    if (options.get("audio-notification.enabled")){
		beep(1000, options.get("notification.audio-type"));
	    }
	    if (options.get("notification.enabled")){
		send_command("SHOW_NOTIFICATION", {title: EXTENSION_NAME, body: "Раздача началась!"});
	    }
	}
	!t || i.fadeTo(n * 1e3, .1);
	setTimeout(function () {
	    i.remove();
	    $("#CollectRainBox").is(":visible") && $.fancybox.close()
	}, n * 1e3)
    };
}());

(function init_focus_cheker()
{
    window.addEventListener('focus', function()
    {
	is_focused = true;
    });

    window.addEventListener('blur', function()
    {
    	is_focused = false;
    });
}());
