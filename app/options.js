var bp = chrome.extension.getBackgroundPage();

(function init_rain_notificate_option()
{
    $("#rain-started-notificate")[0].checked = bp.options.get("rain.notification.enabled");

    $("#rain-started-notificate")[0].checked ? $("#rain-started-options").show() : $("#rain-started-options").hide();

    $("#rain-started-notificate").change(function () {
        this.checked ? $("#rain-started-options").show("fast") && bp.options.set("rain.notification.enabled", true) : $("#rain-started-options").hide("fast") && bp.options.set("rain.notification.enabled",false);
    });

    $("#rain-simple")[0].checked = (bp.options.get("rain.notification.type") == "simple");

    $("#rain-audio")[0].checked = (bp.options.get("rain.notification.type") == "audio");

    $("#rain-simple_audio")[0].checked = (bp.options.get("rain.notification.type") == "simple_audio");

    $("input[name=rr]:radio").change(function () {
        bp.options.set("rain.notification.type", this.id.split('-')[1]);
    });
}());

(function init_chat_notificate_option()
{
    $("#chat-to-me")[0].checked = bp.options.get("chat.notification.enabled");

    $("#chat-to-me")[0].checked ? $("#chat-to-me-options").show() : $("#chat-to-me-options").hide();

    $("#chat-to-me").change(function () {
        this.checked ? $("#chat-to-me-options").show("fast") && bp.options.set("chat.notification.enabled", true) : $("#chat-to-me-options").hide("fast") && bp.options.set("chat.notification.enabled",false);
    });

    $("#chat-simple")[0].checked = (bp.options.get("chat.notification.type") == "simple");

    $("#chat-audio")[0].checked = (bp.options.get("chat.notification.type") == "audio");

    $("#chat-simple_audio")[0].checked = (bp.options.get("chat.notification.type") == "simple_audio");

    $("input[name=ctmr]:radio").change(function () {
        bp.options.set("chat.notification.type", this.id.split('-')[1]);
    });
}());
