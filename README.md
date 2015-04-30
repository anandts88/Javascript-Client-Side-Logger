Client Side Javascript Logging
==============================

Capture logs from client side Javascript and send to server.
Minimizes the server load by sending batch of logs at a time.
Lightweight. Fully Independent and there is no dependencies with other Javascript frameworks
Supported in IE 8 and above , Chrome, Safari, Opera, both desktop and mobile

Steps to follow
---------------

Include `logger.js` in html page
 
Call the methods as below for capturing logs
`Logger.info("Information Message")`
`Logger.error("Error Message")`
`Logger.error("Warn Message")`
`Logger.debug("Debug Message")`

If you want forcefully send logs to server then call the above methods passing send argument as `true`

`Logger.info("Information Message", true)`

Foceful sending is not allowed for `debug` method as it always logs message in `console`

Configuration paramteres
------------------------

Set the server url(Server where logs are captured) as `Logger.url = "http://..."`
Default buffer size is 50, if you want to change then `Logger.buffer = 100`
Set `Logger.isServerInDifferentTimeZone = false` if client and server is in same time zone, default it is true
If `isServerInDifferentTimeZone` is set to `true` then supply offset to calulate server date.
By default logs message are send to server with request parameter `messages`, you can change it `Logger.messageParam = "myownparam"`
If you dont want to send logs to server then set `Logger.sendToServer = false` so that logs will be captured in console always.
