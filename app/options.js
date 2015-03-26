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
    $("#settings-header").text(chrome.i18n.getMessage("settings"));
    $("#rain-section h1").text(chrome.i18n.getMessage("rain_options"));
    $("#chat-section h1").text(chrome.i18n.getMessage("chat_options"));

    $("label[for='rain-started-notificate']").contents().last().replaceWith(chrome.i18n.getMessage("rain_notification_enabled"));
    $("label[for='chat-to-me-notificate']").contents().last().replaceWith(chrome.i18n.getMessage("chat_notification_enabled"));

    $("label[for='rain-simple']").contents().last().replaceWith(chrome.i18n.getMessage("simple_notification"));
    $("label[for='rain-audio']").contents().last().replaceWith(chrome.i18n.getMessage("audio_notification"));
    $("label[for='rain-simple_audio']").contents().last().replaceWith(chrome.i18n.getMessage("simple_audio_notification"));

    $("label[for='chat-simple']").contents().last().replaceWith(chrome.i18n.getMessage("simple_notification"));
    $("label[for='chat-audio']").contents().last().replaceWith(chrome.i18n.getMessage("audio_notification"));
    $("label[for='chat-simple_audio']").contents().last().replaceWith(chrome.i18n.getMessage("simple_audio_notification"));

    $("label[for='announced-bets']").contents().last().replaceWith(chrome.i18n.getMessage("hide_announced_bets"));

    $("label[for='command-menu']").contents().last().replaceWith(chrome.i18n.getMessage("command_menu_enabled"));
})();

(function init_rain_notificate_option()
{
    $("#rain-started-notificate")[0].checked = bp.options.get("rain.notification.enabled");

    $("#rain-started-notificate")[0].checked ? $("#rain-started-options").show() : $("#rain-started-options").hide();

    $("#rain-started-notificate").change(function () {
        $("#rain-started-options").toggle("fast");
        bp.options.set("rain.notification.enabled", $("#rain-started-notificate")[0].checked);
    });

    $("#rain-" + bp.options.get("rain.notification.type")).prop('checked', true);

    $("input[name=rr]:radio").change(function () {
        bp.options.set("rain.notification.type", this.id.split("-")[1]);
    });
}());

(function init_chat_notificate_option()
{
    $("#chat-to-me-notificate")[0].checked = bp.options.get("chat.notification.enabled");

    $("#chat-to-me-notificate")[0].checked ? $("#chat-to-me-options").show() : $("#chat-to-me-options").hide();

    $("#chat-to-me-notificate").change(function () {
        $("#chat-to-me-options").toggle("fast");
        bp.options.set("chat.notification.enabled", $("#chat-to-me-notificate")[0].checked);
    });

    $("#chat-" + bp.options.get("chat.notification.type")).prop('checked', true);

    $("input[name=ctmr]:radio").change(function () {
        bp.options.set("chat.notification.type", this.id.split("-")[1]);
    });
}());

(function init_chat_announced_bets_option(){
    $("#announced-bets")[0].checked = bp.options.get("chat.announced-bets.hide");

    $("#announced-bets").change(function () {
        this.checked ? bp.options.set("chat.announced-bets.hide", true) : bp.options.set("chat.announced-bets.hide", false);
    });
}());

(function init_chat_command_menu_option(){
    $("#command-menu")[0].checked = bp.options.get("chat.command-menu.enabled");

    $("#command-menu").change(function () {
        this.checked ? bp.options.set("chat.command-menu.enabled", true) : bp.options.set("chat.command-menu.enabled", false);
    });
}());
