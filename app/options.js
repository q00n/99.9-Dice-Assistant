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

function toggle(element, stateOrSpeed) {
    if (stateOrSpeed === true || window.getComputedStyle(element).display === 'none') {
		element.style.display = '';
		return;
	}

	element.style.display = 'none';
}

(function init_i18n() {
    document.title = chrome.i18n.getMessage("options_title");

    innerText_i18n(document.querySelector("#settings-header"), "settings");
    innerText_i18n(document.querySelector("#rain-section h1"), "rain_options");
    innerText_i18n(document.querySelector("#chat-section h1"), "chat_options");

    innerText_i18n(document.querySelector("label[for='rain-started-notificate']"), "rain_notification_enabled");
    innerText_i18n(document.querySelector("label[for='chat-to-me-notificate']"), "chat_notification_enabled");

    innerText_i18n(document.querySelector("#rain-started-example"), "show_example");
    innerText_i18n(document.querySelector("#chat-to-me-example"), "show_example");

    innerText_i18n(document.querySelector("label[for='rain-simple']"), "simple_notification");
    innerText_i18n(document.querySelector("label[for='rain-audio']"), "audio_notification");
    innerText_i18n(document.querySelector("label[for='rain-simple_audio']"), "simple_audio_notification");

    innerText_i18n(document.querySelector("label[for='chat-simple']"), "simple_notification");
    innerText_i18n(document.querySelector("label[for='chat-audio']"), "audio_notification");
    innerText_i18n(document.querySelector("label[for='chat-simple_audio']"), "simple_audio_notification");

    innerText_i18n(document.querySelector("label[for='announced-bets']"), "hide_announced_bets");

    innerText_i18n(document.querySelector("label[for='command-menu']"), "command_menu_enabled");

    innerText_i18n(document.querySelector("#support-header"), "donate_header")

    document.querySelector("#bitcoin #support-message").innerHTML = chrome.i18n.getMessage("donate_message", "Bitcoin");
    document.querySelector("#dogecoin #support-message").innerHTML = chrome.i18n.getMessage("donate_message", "Dogecoin");
    document.querySelector("#litecoin #support-message").innerHTML = chrome.i18n.getMessage("donate_message", "Litecoin");

    function innerText_i18n(element, message) {
        element.lastChild.replaceWith(chrome.i18n.getMessage(message));
    }
})();

function send_command(cmd, data, callback)
{
    chrome.runtime.sendMessage({ command: cmd, data: data }, function(response) {
        typeof callback === "function" && callback(response);
    });
}

(function init_rain_notificate_option()
{
    var rainNotificatioEnabled = bp.options.get("rain.notification.enabled");

    document.querySelector("#rain-started-notificate").checked = rainNotificatioEnabled;

    document.querySelector("#rain-started-example").addEventListener("click", show_example);

    toggle(document.querySelector("#rain-started-options"), rainNotificatioEnabled);
    toggle(document.querySelector("#rain-started-example"), rainNotificatioEnabled);

    document.querySelector("#rain-started-notificate").addEventListener("change", function () {
        toggle(document.querySelector("#rain-started-options"), "fast");
        toggle(document.querySelector("#rain-started-example"), "fast");
        bp.options.set("rain.notification.enabled", this.checked);
    });

    document.querySelector("#rain-" + bp.options.get("rain.notification.type")).checked = true;

    function rr_radio_changed() {
        bp.options.set("rain.notification.type", this.id.split("-")[1]);
    }

    var rr_radio = document.querySelectorAll("input[name=rr][type=radio]");

    for (var i = 0; i < rr_radio.length; i++) {
        rr_radio[i].addEventListener('change', rr_radio_changed);
    }

    function show_example() {
        send_command("NOTIFICATE", {
            initiator: "rain",
            title: chrome.i18n.getMessage("ext_name"),
            body: chrome.i18n.getMessage("rain_started_test"),
            buttons: [
                { title: chrome.i18n.getMessage("show_rain") },
                { title: chrome.i18n.getMessage("ignore") }
            ],
            duration: 1e3
        });
    }
}());

(function init_chat_notificate_option()
{
    var chatToMeNotificate = bp.options.get("chat.notification.enabled");

    document.querySelector("#chat-to-me-notificate").checked = chatToMeNotificate;

    document.querySelector("#chat-to-me-example").addEventListener("click", show_example);

    toggle(document.querySelector("#chat-to-me-options"), chatToMeNotificate);
    toggle(document.querySelector("#chat-to-me-example"), chatToMeNotificate);

    document.querySelector("#chat-to-me-notificate").addEventListener('change', function () {
        toggle(document.querySelector("#chat-to-me-options"), "fast");
        toggle(document.querySelector("#chat-to-me-example"), "fast");
        bp.options.set("chat.notification.enabled", this.checked);
    });

    document.querySelector("#chat-" + bp.options.get("chat.notification.type")).checked = true;

    function ctmr_radio_changed() {
        bp.options.set("chat.notification.type", this.id.split("-")[1]);
    }

    var ctmr_radio = document.querySelectorAll("input[name=ctmr][type=radio]");

    for (var i = 0; i < ctmr_radio.length; i++) {
        ctmr_radio[i].addEventListener('change', ctmr_radio_changed);
    }

    function show_example(){
        send_command("NOTIFICATE", {
            initiator: "chat",
            title: "Monti",
            body: chrome.i18n.getMessage("chat_to_me_test"),
            buttons: [
                { title: chrome.i18n.getMessage("show_chat") }
            ],
            duration: 1e3
        });
    }
}());

(function init_chat_announced_bets_option(){
    document.querySelector("#announced-bets").checked = bp.options.get("chat.announced-bets.hide");

    document.querySelector("#announced-bets").addEventListener('change', function () {
        bp.options.set("chat.announced-bets.hide", this.checked);
    });
}());

(function init_chat_command_menu_option(){
    document.querySelector("#command-menu").checked = bp.options.get("chat.command-menu.enabled");

    document.querySelector("#command-menu").addEventListener('change', function () {
        bp.options.set("chat.command-menu.enabled", this.checked);
    });
}());

(function init_first_install_event(){
    if (window.location.hash && window.location.hash.split("#")[1] == "first-install") {
        var alert = document.createElement('div');

        alert.innerHTML = "<center><b>" + chrome.i18n.getMessage("first_install_message") + "</b></center>";
        alert.classList.add('alert');

        document.querySelector("#settings-header").before(alert);
    }
}());

(function init_tab_switch(){
    var tabsHeader = document.querySelectorAll("#tabs .tab-links a");

    for (var i = 0; i < tabsHeader.length; i++) {
        tabsHeader[i].addEventListener("click", tabHeaderClicked);
    }

    function tabHeaderClicked(e) {
        e.preventDefault();

        var currentTabHeader = this;

        var tabBody = document.querySelector("#tabs " + currentTabHeader.getAttribute("href"));

        tabBody.style.display = 'block';
        currentTabHeader.parentNode.classList.add('active');

        var tabBodySiblings = Array.prototype.filter.call(tabBody.parentNode.children, function(child) {
            return child !== tabBody;
        });

        for (var i = 0; i < tabBodySiblings.length; i++) {
            tabBodySiblings[i].style.display = 'none';
        }

        var tabHeaderSiblings = Array.prototype.filter.call(currentTabHeader.parentNode.parentNode.children, function(child) {
            return child !== currentTabHeader.parentNode;
        });

        for (var i = 0; i < tabHeaderSiblings.length; i++) {
            tabHeaderSiblings[i].classList.remove('active');
        }
    }
}());
