(function inject_script(scripts)
{
    document.getElementsByTagName("body")[0].appendChild(script = document.createElement('script'));
    script.innerHTML = "var extension_id = '" + chrome.runtime.id + "';"

    scripts.forEach(function (item)
    {
        document.getElementsByTagName("body")[0].appendChild(script = document.createElement('script'));
        script.setAttribute('src', chrome.extension.getURL(item+".js"));
    });
}(["/app/config","/app/script"]));
