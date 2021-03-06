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

    innerText_i18n($("#rain-started-example"), "show_example");
    innerText_i18n($("#chat-to-me-example"), "show_example");

    innerText_i18n($("label[for='rain-simple']"), "simple_notification");
    innerText_i18n($("label[for='rain-audio']"), "audio_notification");
    innerText_i18n($("label[for='rain-simple_audio']"), "simple_audio_notification");

    innerText_i18n($("label[for='chat-simple']"), "simple_notification");
    innerText_i18n($("label[for='chat-audio']"), "audio_notification");
    innerText_i18n($("label[for='chat-simple_audio']"), "simple_audio_notification");

    innerText_i18n($("label[for='announced-bets']"), "hide_announced_bets");

    innerText_i18n($("label[for='command-menu']"), "command_menu_enabled");

    innerText_i18n($("#support-header"), "donate_header")
    $("#bitcoin #support-message").html(chrome.i18n.getMessage("donate_message", "Bitcoin"));
    $("#dogecoin #support-message").html(chrome.i18n.getMessage("donate_message", "Dogecoin"));
    $("#litecoin #support-message").html(chrome.i18n.getMessage("donate_message", "Litecoin"));

    function innerText_i18n(object, message){
        $(object).contents().last().replaceWith(chrome.i18n.getMessage(message));
    }
})();

function send_command(cmd, data, callback)
{
    chrome.runtime.sendMessage({command: cmd, data: data}, function(response) {
        typeof callback === "function" && callback(response);
    });
}

(function init_rain_notificate_option()
{
    $("#rain-started-notificate")[0].checked = bp.options.get("rain.notification.enabled");

    $("#rain-started-example").on("click", show_example);

    $("#rain-started-options").toggle($("#rain-started-notificate")[0].checked);
    $("#rain-started-example").toggle($("#rain-started-notificate")[0].checked);

    $("#rain-started-notificate").change(function () {
        $("#rain-started-options").toggle("fast");
        $("#rain-started-example").toggle("fast");
        bp.options.set("rain.notification.enabled", this.checked);
    });

    $("#rain-" + bp.options.get("rain.notification.type")).prop('checked', true);

    $("input[name=rr]:radio").change(function () {
        bp.options.set("rain.notification.type", this.id.split("-")[1]);
    });

    function show_example(){
        send_command("NOTIFICATE", {initiator: "rain", title: chrome.i18n.getMessage("ext_name"), body: chrome.i18n.getMessage("rain_started_test"), buttons: [{title: chrome.i18n.getMessage("show_rain")}, {title: chrome.i18n.getMessage("ignore")}], duration: 1e3});
    }
}());

(function init_chat_notificate_option()
{
    $("#chat-to-me-notificate")[0].checked = bp.options.get("chat.notification.enabled");

    $("#chat-to-me-example").on("click", show_example);

    $("#chat-to-me-options").toggle($("#chat-to-me-notificate")[0].checked);
    $("#chat-to-me-example").toggle($("#chat-to-me-notificate")[0].checked);

    $("#chat-to-me-notificate").change(function () {
        $("#chat-to-me-options").toggle("fast");
        $("#chat-to-me-example").toggle("fast");
        bp.options.set("chat.notification.enabled", this.checked);
    });

    $("#chat-" + bp.options.get("chat.notification.type")).prop('checked', true);

    $("input[name=ctmr]:radio").change(function () {
        bp.options.set("chat.notification.type", this.id.split("-")[1]);
    });

    function show_example(){
        send_command("NOTIFICATE", {initiator: "chat", title: "Monti", body: chrome.i18n.getMessage("chat_to_me_test"), buttons: [{title: chrome.i18n.getMessage("show_chat")}], duration: 1e3});
    }
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

(function init_first_install_event(){
    if (window.location.hash && window.location.hash.split("#")[1] == "first-install")
        $("#settings-header").before($("<div />").addClass("alert").html("<center><b>"+chrome.i18n.getMessage("first_install_message")+"</b></center>"));
}());

(function init_tab_switch(){
    $("#tabs .tab-links a").on("click", function(e) {
        e.preventDefault();

        $("#tabs " + $(this).attr("href")).show().siblings().hide();
        $(this).parent("li").addClass("active").siblings().removeClass("active");
    });
}());
