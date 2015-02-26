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

(function init_handler()
{
    chrome.runtime.onMessageExternal.addListener(
	function(request, sender, sendResponse) {
	    switch (request.command) {
		case "NOTIFICATE":
		    switch (options.get(request.data.initiator+".notification.type")) {
			case "simple":
			    show_notification(request.data, {index: sender.tab.index, windowId: sender.tab.windowId});
			break;
			case "audio":
			    beep(1000, options.get(request.data.initiator+".audio-notification.type"));
			break;
			case "simple_audio":
			    show_notification(request.data, {index: sender.tab.index, windowId: sender.tab.windowId});
			    beep(1000, options.get(request.data.initiator+".audio-notification.type"));
			break;
		    }
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
	    chrome.windows.update(tab.windowId, {focused: true}, function (){})
	    chrome.tabs.highlight({windowId: tab.windowId, tabs: tab.index}, function (){})
	});
    };
}());
