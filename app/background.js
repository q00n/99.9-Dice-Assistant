(function init_handler(){
    chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse)
	{
	    switch (request.command) {
		case "SHOW_NOTIFICATION":
		    show_notification(request.data);
		break;
	    }

	}
    );

    function show_notification(data)
    {
	chrome.notifications.create("",
	{
	    type:     "basic",
	    iconUrl:  "/icons/128x128.png",
	    title:    data.title,
	    message:  data.body,
	}, function() {});
    };
}());
