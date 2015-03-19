(function inject_script(scripts)
{
    document.getElementsByTagName("body")[0].appendChild(script = document.createElement('script'));
    script.innerHTML = "var extension_id = '" + chrome.runtime.id + "';"

    document.getElementsByTagName("body")[0].appendChild(script = document.createElement('script'));
    script.setAttribute('src', chrome.extension.getURL("/app/script.js"));
}());
