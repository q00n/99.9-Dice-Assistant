var is_focused = true;

function send_command(cmd, data)
{
    window.postMessage({type:"DICE_HELPER", command: cmd, data: data}, "*");
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
	    send_command("NOTIFICATE", {initiator: "rain", title: EXTENSION_NAME, body: "Раздача началась!"});
	}
	!t || i.fadeTo(n * 1e3, .1);
	setTimeout(function () {
	    i.remove();
	    $("#CollectRainBox").is(":visible") && $.fancybox.close()
	}, n * 1e3)
    };
}());

(function init_chat_notification()
{
    view.addChatLine = function (n, t, i, r, u, f, e) {
	var o, l, v, s, h, y, a, c;
	if (!($.inArray(i, config.chat.ignoreList) >= 0)) {
	    if (++view.chatLineId, o = $("<p/>").attr("data-chatnum", view.chatLineId).attr("data-accountid", i), n ? i == 1 ? o.attr("class", "ChatAdmin") : i == data.user.accountId && o.attr("class", "ChatSelf") : o.attr("class", "ChatError"), v = $("<span/>").text(r).attr("class", "ChatFriendlyName").click(function () {
		$("#ChatTabText").val() || $("#ChatTabText").focus().val("@" + $(this).text() + ": ")
	    }).attr("title", e ? view.util.utcDateFromISO(e) : new Date), s = $("<span/>").attr("class", "ChatUserID").attr("data-accountid", i).text(" (" + (u ? u : i) + ")"), u && (o.attr("data-identity", u), s.attr("data-identity", u), s.click(view.chatLineIdentityClick)), h = $("<span/>"), jQuery.type(f) === "string") {
		if (!f) return;
		s.text(s.text() + ": ");
		y = f.indexOf("@" + data.user.friendlyName + ":") === 0;
		h.text(f).attr("class", y ? "ChatTextToMe" : "ChatText")
		if (y && ($("#ChatTab").is(":not(:visible)") || !is_focused)) {
		    send_command("NOTIFICATE", {initiator: "chat", title: r, body: f.trim().replace("@"+data.user.friendlyName+": ", "")});
		}
	    } else {
		if (f.depositAddress) {
		    if (config.chat.ignoreDeposit) return;
		    h.text(" " + phrases.address + ": [...]").attr("data-addrs", f.depositAddress).click(function () {
			$(this).text(" " + phrases.address + ": " + $(this).attr("data-addrs")).unbind("click")
		    }).attr("style", "cursor:pointer")
		} else if (f.stats && jQuery.type(f.stats.balances) !== "undefined") {
		    if (config.chat.ignoreBalance) return;
		    for (a = " " + phrases.balance + ": ", c = 0; c < f.stats.currencies.length; ++c) a += (c ? ", " : "") + view.util.fixNumberString(f.stats.balances[c] / 1e8) + " " + getCurrencyName(f.stats.currencies[c]);
		    h.text(a)
		}
		h.attr("class", "ChatData");
		l = $("<span>").attr("class", "ChatData").text("*** ")
	    }
	    l && l.appendTo(o);
	    v.appendTo(o);
	    s.appendTo(o);
	    h.appendTo(o);
	    view.addElementToChat(o)
	}
    }
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
