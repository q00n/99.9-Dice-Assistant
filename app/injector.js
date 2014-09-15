(function inject_script(scripts)
{
    scripts.forEach(function (item)
    {
        document.getElementsByTagName("body")[0].appendChild(script = document.createElement('script'));
        script.setAttribute('src', chrome.extension.getURL(item+".js"));
    });

    window.addEventListener("message", function(event)
    {
        if (event.source == window && event.data.type && (event.data.type == "DICE_HELPER"))
        {
            chrome.extension.sendMessage({command: event.data.command, data: event.data.data}, function(){});
        }
    }, false);

}(["/app/config","/com/options","/app/script"]));
