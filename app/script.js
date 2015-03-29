/*
 * This file is part of 99.9% Dice Assistant extension for Google Chrome browser
 *
 * Copyright (c) 2015 Ilya Petriv
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

var is_focused,
    messages = ["ext_name","rain_started","balance","deposit","ignores","ignore_balance","unignore_balance","ignore_deposit","unignore_deposit","clear_chat","whois","rules"];

var i18n_messages = send_command("GET_MESSAGES", {messages: messages}, function (response){
    i18n_messages = response;
});

function send_command(cmd, data, callback)
{
    chrome.runtime.sendMessage(extension_id, {command: cmd, data: data}, function(response) {
        typeof callback === "function" && callback(response);
    });
}

(function init_rain_notification()
{
    pipe.events.rainStarted = view.pipeevents.rainStarted = (function() {
        var cached_function = pipe.events.rainStarted = view.pipeevents.rainStarted;

        return function(n) {
            send_command("GET_OPTION", {option: "rain.notification.enabled"}, function(response){
                if ($("#ChatTab").is(":not(:visible)") || !is_focused && response.value)
                    send_command("NOTIFICATE", {initiator: "rain", title: i18n_messages.ext_name, body: i18n_messages.rain_started, duration: n*1e3});
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
            if (($("#ChatTab").is(":not(:visible)") || !is_focused) && typeof o == "object" && typeof f == "string" && f.indexOf("@" + data.user.friendlyName + ":") === 0)
                send_command("GET_OPTION", {option: "chat.notification.enabled"}, function(response){
                    if (response.value)
                        send_command("NOTIFICATE", {initiator: "chat", title: r, body: f.replace("@"+data.user.friendlyName+":", "").trim(), duration: 1e3});
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
                if (!response.value)
                    cached_function.apply(this, arg);
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
                $("<span class='MenuItem'/>").text(i18n_messages.balance).click("/balance", view.controls.sendChatCommand).appendTo(t);
                $("<span class='MenuItem'/>").text(i18n_messages.deposit).click("/deposit", view.controls.sendChatCommand).appendTo(t);
                $("<span class='MenuItem'/>").text(i18n_messages.ignores).click("/ignores", view.controls.sendChatCommand).appendTo(t);
                $("<span class='MenuItem'/>").text(i18n_messages.ignore_balance).click("/ignorebalance", view.controls.sendChatCommand).appendTo(t);
                $("<span class='MenuItem'/>").text(i18n_messages.unignore_balance).click("/unignorebalance", view.controls.sendChatCommand).appendTo(t);
                $("<span class='MenuItem'/>").text(i18n_messages.ignore_deposit).click("/ignoredeposit", view.controls.sendChatCommand).appendTo(t);
                $("<span class='MenuItem'/>").text(i18n_messages.unignore_deposit).click("/unignoredeposit", view.controls.sendChatCommand).appendTo(t);
                $("<span class='MenuItem'/>").text(i18n_messages.clear_chat).click("/clear", view.controls.sendChatCommand).appendTo(t);
                $("<span class='MenuItem'/>").text(i18n_messages.whois).click(function (){$("#ChatTabText").val("/whois "); $("#ChatTabText").focus()}).appendTo(t);
                $("<span class='MenuItem'/>").text(i18n_messages.rules).click("/rules", view.controls.sendChatCommand).appendTo(t);
                t.css("left", n.pageX - $(window).scrollLeft()).css("top", n.pageY - $(window).scrollTop() - 212);
                view.addWithInvisibleBackground(t);
            }
            view.controls.sendChatCommand = function(t) {
                var i, n;
                if (!view.chatControlsDisabled) {
                    for (i = !1, t = t.data, n = 0; n < chatCommands.length; ++n)
                        if (t.indexOf(chatCommands[n].cmd) === 0) {
                            i = !0;
                            if (chatCommands[n].cmd.indexOf(" ") >= 0)
                                view.addChatTextCommand(chatCommands[n].func(t.substring(chatCommands[n].cmd.length)), t);
                            else
                                view.addChatTextCommand(chatCommands[n].func(), t);
                            break;
                        }
                    i || pipe.server.sendChatText(config.chat.currentRoomId, t)
                }
            }
            $("#ChatTabSendButton").css("border-radius", "12px 0px 0px 12px").after(
                $("<span />").addClass("TextButton").css({borderRadius: "0px 12px 12px 0px", marginLeft: "-3px"}).text("+").click(view.controls.chatCommandMenu)
            );
        }
    });
}());

(function init_focus_cheker()
{
    window.addEventListener("focus", function(){
        is_focused = true;

        if (view.pipeevents.rainFadeTimer)
            send_command("GET_OPTION", {option: "rain.notification.enabled"}, function(response){
                if (response.value)
                    send_command("MUTE");
            });
    });

    window.addEventListener("blur", function(){
        is_focused = false;
    });
}());
