var options = new Options({
    "rain.notification.enabled": RAIN_NOTIFICATION_ENABLED,
    "rain.notification.type": RAIN_NOTIFICATION_TYPE,
    "rain.audio-notification.type": RAIN_AUDIO_NOTIFICATION_TYPE,

    "chat.notification.enabled": CHAT_NOTIFICATION_ENABLED,
    "chat.notification.type": CHAT_NOTIFICATION_TYPE,
    "chat.audio-notification.type": CHAT_AUDIO_NOTIFICATION_TYPE,
    "chat.announced-bets.hide": CHAT_ANNOUNCED_BETS_HIDE,
    "chat.command-menu.enabled": CHAT_COMMAND_MENU_ENABLED
});

var beep = (function() {
    var ctx = new(window.audioContext || window.AudioContext);
    return function(duration, type, startedCallback, finishedCallback) {
	if (typeof startedCallback != "function") {
            startedCallback = function() {};
        }
        if (typeof finishedCallback != "function") {
            finishedCallback = function() {};
        }

        var osc = ctx.createOscillator();

        osc.type = type;

        osc.connect(ctx.destination);
        osc.start(0);
	startedCallback(osc);

        setTimeout(function() {
            osc.stop(0);
            finishedCallback();
        }, duration);
    };
}());

var cached_osc;

(function init_handler()
{
    chrome.runtime.onMessageExternal.addListener(
	function(request, sender, sendResponse) {
	    switch (request.command) {
		case "NOTIFICATE":
		    switch (options.get(request.data.initiator+".notification.type")) {
			case "simple":
			    show_notification(request.data, {id: sender.tab.id, windowId: sender.tab.windowId});
			break;
			case "audio":
			    beep(request.data.duration, options.get(request.data.initiator+".audio-notification.type"), function(osc){cached_osc = osc});
			break;
			case "simple_audio":
			    show_notification(request.data, {id: sender.tab.id, windowId: sender.tab.windowId});
			    beep(request.data.duration, options.get(request.data.initiator+".audio-notification.type"), function(osc){cached_osc = osc});
			break;
		    }
		break;
		case "MUTE":
		    cached_osc.stop(0);
		break;
		case "GET_OPTION":
		    sendResponse({value: options.get(request.data.option)});
		break;
		case "GET_MESSAGES":
		    var messages = {};
		    for (var m in request.data.messages){
			messages[request.data.messages[m]] = chrome.i18n.getMessage(request.data.messages[m]);
		    }
		    sendResponse(messages);
		break;
	    }
    });

    function show_notification(data, tab)
    {
	chrome.notifications.create("",
	{
	    type:     "basic",
	    iconUrl:  "/icons/128.png",
	    title:    data.title,
	    message:  data.body,
	}, function() {});

	chrome.notifications.onClicked.addListener(function(){
	    chrome.windows.update(tab.windowId, {focused: true});
	    chrome.tabs.update(tab.id, {highlighted: true});
	});
    };
}());
