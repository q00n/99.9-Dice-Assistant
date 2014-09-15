var options = new Options({
    "rain.notification.enabled": RAIN_NOTIFICATION_ENABLED,
    "rain.notification.type": RAIN_NOTIFICATION_TYPE,
    "rain.audio-notification.type": RAIN_AUDIO_NOTIFICATION_TYPE,

    "chat.notification.enabled": CHAT_NOTIFICATION_ENABLED,
    "chat.notification.type": CHAT_NOTIFICATION_TYPE,
    "chat.audio-notification.type": CHAT_AUDIO_NOTIFICATION_TYPE
});

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

(function init_handler(){
    chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse)
	{
	    switch (request.command) {
		case "NOTIFICATE":
		    if (options.get(request.data.initiator+".notification.enabled")) {
			switch (options.get(request.data.initiator+".notification.type")){
			    case "simple":
				show_notification(request.data);
			    break;
			    case "audio":
				beep(1000, options.get(request.data.initiator+".audio-notification.type"));
			    break;
			    case "simple_audio":
				show_notification(request.data);
				beep(1000, options.get(request.data.initiator+".audio-notification.type"));
			    break;
			}
		    }
		break;
	    }

	}
    );

    function show_notification(data)
    {
	chrome.notifications.create("",
	{
	    type:     "basic",
	    iconUrl:  "/icons/128x128.png",
	    title:    data.title,
	    message:  data.body,
	}, function() {});
    };
}());
