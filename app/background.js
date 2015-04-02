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

var options = new Options({
    "rain.notification.enabled":    RAIN_NOTIFICATION_ENABLED,
    "rain.notification.type":       RAIN_NOTIFICATION_TYPE,
    "rain.audio-notification.type": RAIN_AUDIO_NOTIFICATION_TYPE,

    "chat.notification.enabled":    CHAT_NOTIFICATION_ENABLED,
    "chat.notification.type":       CHAT_NOTIFICATION_TYPE,
    "chat.audio-notification.type": CHAT_AUDIO_NOTIFICATION_TYPE,
    "chat.announced-bets.hide":     CHAT_ANNOUNCED_BETS_HIDE,
    "chat.command-menu.enabled":    CHAT_COMMAND_MENU_ENABLED,

    "script.notification.type":     "simple"
});

var beep = (function() {
    var ctx = new window.AudioContext;

    return function(duration, type, started_callback, finished_callback) {
        var osc = ctx.createOscillator();
        osc.type = type;

        osc.connect(ctx.destination);
        osc.start(0);

        (typeof started_callback == "function" && started_callback(osc));

        setTimeout(function() {
            osc.stop(0);
            (typeof finished_callback == "function" && finished_callback());
        }, duration);
    };
}());

var cached_osc, tab_data = {}, is_rain;

(function init_handler()
{
    chrome.runtime.onMessageExternal.addListener(handler);
    chrome.runtime.onMessage.addListener(handler);

    function handler(request, sender, sendResponse) {
        switch (request.command) {
            case "NOTIFICATE":
                is_rain = request.data.initiator == "rain";
                switch (options.get(request.data.initiator+".notification.type")) {
                    case "simple":
                        show_notification(request.data, {id: sender.tab.id, windowId: sender.tab.windowId});
                    break;
                    case "audio":
                        if (is_rain && cached_osc) return;
                        beep(request.data.duration,
                            options.get(request.data.initiator+".audio-notification.type"),
                            is_rain && function(osc){cached_osc = osc},
                            is_rain && function(){cached_osc = null}
                        );
                    break;
                    case "simple_audio":
                        if (is_rain && cached_osc) return;
                        show_notification(request.data, {id: sender.tab.id, windowId: sender.tab.windowId});
                        beep(request.data.duration,
                             options.get(request.data.initiator+".audio-notification.type"),
                             is_rain && function(osc){cached_osc = osc},
                             is_rain && function(){cached_osc = null}
                        );
                    break;
                }
            break;
            case "MUTE":
                cached_osc && (cached_osc.stop(0), cached_osc = null);
            break;
            case "GET_OPTION":
                sendResponse({value: options.get(request.data.option)});
            break;
            case "GET_MESSAGES":
                var messages = {};
                for (var m in request.data.messages)
                    messages[request.data.messages[m]] = chrome.i18n.getMessage(request.data.messages[m]);
                sendResponse(messages);
            break;
        }
    }

    chrome.notifications.onClicked.addListener(notification_click);
    chrome.notifications.onClosed.addListener(notification_close);

    function show_notification(data, tab)
    {
        chrome.notifications.create("",
        {
            type:    "basic",
            iconUrl: "/icons/128.png",
            title:   data.title,
            message: data.body,
        }, function(id) { tab_data[id] = tab; });
    };

    function notification_click(id)
    {
        tab_data[id] && chrome.tabs.get(tab_data[id].id, function callback() {
            if (!chrome.runtime.lastError){
                chrome.windows.update(tab_data[id].windowId, {focused: true});
                chrome.tabs.update(tab_data[id].id, {active: true});
            }

            chrome.notifications.clear(id, function(){});
            notification_close(id);
        });
    }

    function notification_close(id)
    {
        tab_data[id] && delete tab_data[id];
    }
}());

(function init_installed_event()
{
    chrome.runtime.onInstalled.addListener(function(details){
        if (details.reason != "install")
            return;

        setTimeout(function(){
            var optionsUrl = chrome.extension.getURL("options.html#first-install");

            chrome.tabs.query({url: optionsUrl}, function(tabs) {
                if (tabs.length)
                    chrome.tabs.update(tabs[0].id, {active: true});
                else
                    chrome.tabs.create({url: optionsUrl});
            });
        }, 2500);
    });
}());
