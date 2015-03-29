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

var bp = chrome.extension.getBackgroundPage();

(function init_i18n() {
    document.title = chrome.i18n.getMessage("options_title");

    innerText_i18n($("#settings-header"), "settings");
    innerText_i18n($("#rain-section h1"), "rain_options");
    innerText_i18n($("#chat-section h1"), "chat_options");

    innerText_i18n($("label[for='rain-started-notificate']"), "rain_notification_enabled");
    innerText_i18n($("label[for='chat-to-me-notificate']"), "chat_notification_enabled");

    innerText_i18n($("label[for='rain-simple']"), "simple_notification");
    innerText_i18n($("label[for='rain-audio']"), "audio_notification");
    innerText_i18n($("label[for='rain-simple_audio']"), "simple_audio_notification");

    innerText_i18n($("label[for='chat-simple']"), "simple_notification");
    innerText_i18n($("label[for='chat-audio']"), "audio_notification");
    innerText_i18n($("label[for='chat-simple_audio']"), "simple_audio_notification");

    innerText_i18n($("label[for='announced-bets']"), "hide_announced_bets");

    innerText_i18n($("label[for='command-menu']"), "command_menu_enabled");

    function innerText_i18n(object, message){
        $(object).contents().last().replaceWith(chrome.i18n.getMessage(message));
    }
})();

(function init_rain_notificate_option()
{
    $("#rain-started-notificate")[0].checked = bp.options.get("rain.notification.enabled");

    $("#rain-started-options").toggle($("#rain-started-notificate")[0].checked);

    $("#rain-started-notificate").change(function () {
        $("#rain-started-options").toggle("fast");
        bp.options.set("rain.notification.enabled", this.checked);
    });

    $("#rain-" + bp.options.get("rain.notification.type")).prop('checked', true);

    $("input[name=rr]:radio").change(function () {
        bp.options.set("rain.notification.type", this.id.split("-")[1]);
    });
}());

(function init_chat_notificate_option()
{
    $("#chat-to-me-notificate")[0].checked = bp.options.get("chat.notification.enabled");

    $("#chat-to-me-options").toggle($("#chat-to-me-notificate")[0].checked);

    $("#chat-to-me-notificate").change(function () {
        $("#chat-to-me-options").toggle("fast");
        bp.options.set("chat.notification.enabled", this.checked);
    });

    $("#chat-" + bp.options.get("chat.notification.type")).prop('checked', true);

    $("input[name=ctmr]:radio").change(function () {
        bp.options.set("chat.notification.type", this.id.split("-")[1]);
    });
}());

(function init_chat_announced_bets_option(){
    $("#announced-bets")[0].checked = bp.options.get("chat.announced-bets.hide");

    $("#announced-bets").change(function () {
        bp.options.set("chat.announced-bets.hide", this.checked);
    });
}());

(function init_chat_command_menu_option(){
    $("#command-menu")[0].checked = bp.options.get("chat.command-menu.enabled");

    $("#command-menu").change(function () {
        bp.options.set("chat.command-menu.enabled", this.checked);
    });
}());
