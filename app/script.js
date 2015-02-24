var is_focused;

function send_command(cmd, data, callback)
{
    chrome.runtime.sendMessage(extension_id, {command: cmd, data: data}, function(response) {
	typeof callback === 'function' && callback(response);
    });
}

(function init_rain_notification()
{
    pipe.events.rainStarted = view.pipeevents.rainStarted = (function() {
	var cached_function = pipe.events.rainStarted = view.pipeevents.rainStarted;

	return function() {
	    send_command("GET_OPTION", {option: "rain.notification.enabled"}, function(response){
		if ($("#ChatTab").is(":not(:visible)") || !is_focused && response.value) {
		    send_command("NOTIFICATE", {initiator: "rain", title: EXTENSION_NAME, body: "Раздача началась!"});
		}
	    });

	    cached_function.apply(this, arguments);
	};
    }());
}());

(function init_chat_notification()
{
    view.addChatLine = (function() {
	var cached_function = view.addChatLine;

	return function(n, t, i, r, u, f, e, o) {
	    send_command("GET_OPTION", {option: "chat.notification.enabled"}, function(response){
		if (response.value && (($("#ChatTab").is(":not(:visible)") || !is_focused) && typeof o == 'object' && typeof f == 'string' && f.indexOf("@" + data.user.friendlyName + ":") === 0)){
		    send_command("NOTIFICATE", {initiator: "chat", title: r, body: f.trim().replace("@"+data.user.friendlyName+": ", "")});
		}
	    });

	    cached_function.apply(this, arguments);
	};
    }());
}());

(function init_chat_announced_bets()
{
    pipe.events.receivedAnnouncedBets = view.pipeevents.receivedAnnouncedBets = (function() {
	var cached_function = pipe.events.receivedAnnouncedBets = view.pipeevents.receivedAnnouncedBets;

	return function() {
	    var arg = arguments;
	    send_command("GET_OPTION", {option: "chat.announced-bets.hide"}, function(response){
		if (!response.value) cached_function.apply(this, arg);
	    });
	};
    }());
}());

(function init_chat_command_menu()
{
    send_command("GET_OPTION", {option: "chat.command-menu.enabled"}, function(response){
	if (response.value){
	    view.controls.chatCommandMenu = function(n) {
		var t = $("<div id='ChatNameContextMenu'/>");
		n.preventDefault();
		$("#ChatNameContextMenu").remove();
		$("<span class='MenuItem'/>").text("Баланс").click("/balance", view.controls.sendChatCommand).appendTo(t);
		$("<span class='MenuItem'/>").text("Депозит").click("/deposit", view.controls.sendChatCommand).appendTo(t);
		$("<span class='MenuItem'/>").text("Черный список").click("/ignores", view.controls.sendChatCommand).appendTo(t);
		$("<span class='MenuItem'/>").text("Игнорировать балансы").click("/ignorebalance", view.controls.sendChatCommand).appendTo(t);
		$("<span class='MenuItem'/>").text("Не игнорировать балансы").click("/unignorebalance", view.controls.sendChatCommand).appendTo(t);
		$("<span class='MenuItem'/>").text("Игнорировать депозиты").click("/ignoredeposit", view.controls.sendChatCommand).appendTo(t);
		$("<span class='MenuItem'/>").text("Не игнорировать депозиты").click("/unignoredeposit", view.controls.sendChatCommand).appendTo(t);
		$("<span class='MenuItem'/>").text("Очистить чат").click("/clear", view.controls.sendChatCommand).appendTo(t);
		$("<span class='MenuItem'/>").text("Инфо о...").click(function (){$("#ChatTabText").val("/whois ")}).appendTo(t);
		$("<span class='MenuItem'/>").text("Правила").click("/rules", view.controls.sendChatCommand).appendTo(t);
		t.css("left", n.pageX - $(window).scrollLeft()).css("top", n.pageY - $(window).scrollTop() - 212);
		view.addWithInvisibleBackground(t);
	    }
	    view.controls.sendChatCommand = function(t) {
		var i, n;
		if (!view.chatControlsDisabled) {
		    for (i = !1, t = t.data, n = 0; n < chatCommands.length; ++n)
			if (t.indexOf(chatCommands[n].cmd) === 0) {
			    i = !0;
			    chatCommands[n].cmd.indexOf(" ") >= 0 ? view.addChatTextCommand(chatCommands[n].func(t.substring(chatCommands[n].cmd.length)), t) : view.addChatTextCommand(chatCommands[n].func(), t);
			    break
			}
		    i || pipe.server.sendChatText(config.chat.currentRoomId, t)
		}
	    }
	    $("#ChatTabSendButton").css("border-radius", "12px 0px 0px 12px");
	    $("#ChatTabSendButton").after($('<span />').addClass('TextButton').css({borderRadius: "0px 12px 12px 0px", marginLeft: "-3px"}).text('+').click(view.controls.chatCommandMenu));
	}
    });
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
