/**
* Client Side Logger Libray v0.1
* Date 2015-04-03
*
* Git Repsitory
* https://code.cognizant.com/367488/javascript-client-side-logging.git
* git@code.cognizant.com:367488/javascript-client-side-logging.git
*
* Capture logs from client side Javascript and send to server.
* Minimizes the server load by sending batch of logs at a time.
* Lightweight. Fully Independent and there is no dependencies with other Javascript frameworks
* Supported in IE 8 and above , Chrome, Safari, Opera, both desktop and mobile
*
* Include logger.js in html page
*
* Call the methods as below for capturing logs
*
* `Logger.info("Information Message")`
* `Logger.error("Error Message")`
* `Logger.error("Warn Message")`
* `Logger.debug("Debug Message")`
*
* If you want forcefully send logs to server then call the above methods passing send argument as true
*
* `Logger.info("Information Message", true)`
*
* Foceful sending is not allowed for "debug" method as it always logs message in console
*
* Set the server url(Server where logs are captured) as `Logger.url = "http://..."`
* Default buffer size is 50, if you want to change then `Logger.buffer = 100`
* Set `Logger.isServerInDifferentTimeZone = false` if client and server is in same time zone, default it is true
* If isServerInDifferentTimeZone is set to true then supply offset to calulate server date.
* By default logs message are send to server with request parameter "messages", you can change it `Logger.logParam = "myownparam"`
* If you dont want to send logs to server then set `Logger.track = false` so that logs will be captured in console always.
*
*/

window.Logger = (function() {

  // Default configuration parameters for Logger
  var conf = {
    url: null, // Url of the logging server.
    buffer: 3, // Buffer size to indicate no of logs send in a request.
    track: true, // If false then logs will be printed in console, set to true if logs needs to be captured in server
    isServerInDifferentTimeZone: true,
    offset: null,
    dateHeader: 'Date',
    device: null,
    serverDate: null,
    isProduction: false, // Dont log console messages in production
    logParam: "messages", // Request Parameter that holds log messages
    beforeUnloadMsg: "User pressed close or refresh or back or forward buttons in broswer.",
    onBeforeLoggerInit: null // Callback to do something before Logger is assigned to window
  };

  // Check supplied argument is undefined or null;
  var isNotValue = function(o) {
    return typeof o === "undefined" || o === null;
  }

  // Check supplied argument is String
  var isString = function(o) {
    return typeof o === "string" || (typeof o === "object" && o.constructor === String);
  };

  // Check supplied argument is Number
  var isNumber = function(o) {
    return typeof o === "number" || (typeof o === "object" && o.constructor === Number);
  };

  // Check supplied argument is Object
  var isObject = function(o) {
    return typeof o === "object";
  };

  var logInConsole = function(msg) {
    if(!logger.isProduction && window.console) {
      console.log(msg);
    }
  };

  // Custom configuration parameters(window.LoggerConfig) supplied by user.
  var loggerConfig = window.LoggerConfig;

  var logger = {
    logs: [] // Buffer to hold the log messages.
  };

  try {
    if(loggerConfig) {
      // Applying user supplied config parameters from window.LoggerConfig
      for (key in loggerConfig) {
        logger[key] = loggerConfig[key];
      }
    }

    // Apply default config parameters if user didnt supply them.
    for (key in conf) {
      if (isNotValue(logger[key])) {
        logger[key] = conf[key];
      }
    }

    if (logger.track && isNotValue(logger.url)) {
      throw new Error("Logger is configured for sending logs to server, but `url` is not supplied.");
    }

  } catch(ex) {
    logInConsole(ex);
  }
  /**
    Calculate offset based on server date

    @method calulateOffset
    @param {String} serverDate String representation of server date
  */
  var calulateOffset = function(serverDate) {
    var currentOffset,
        previousOffset;

    try {
      if (serverDate) {
        serverDate = new Date(serverDate.substr(0, 25)); // Remove timezone info at the end of date response
        currentOffset = serverDate - (new Date()); // Calulate offset between server and local time

        previousOffset = logger.offset || currentOffset;
        if (Math.abs(previousOffset - currentOffset) < 10 * 1000) {
          currentOffset = (previousOffset + currentOffset)/2;
        }
        logger.offset = currentOffset;
      }
    } catch(ex) {
      logInConsole(ex);
    }

  };

  /**
    Send log messages to server

    @method sendLogsToServer
    @param {Boolean} isAsync Flag indicates whether server call is async or sync
  */
  var sendLogsToServer = function(isAsync) {
    try {
      var logs = logger.logs,
          httpRequest;
      // Empty the logs buffer
      logger.logs = [];

      isAsync = isNotValue(isAsync) ? true: isAsync;

      // Initiating http request
      if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
          httpRequest = new XMLHttpRequest();
      } else { // code for IE6, IE5
          httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
      }

      httpRequest.open("POST", logger.url, isAsync);
      httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      httpRequest.onreadystatechange = function () {
        if(httpRequest.readyState === 4) { //Request finished and response is ready
          if(logger.isServerInDifferentTimeZone) {
            calulateOffset(httpRequest.getResponseHeader(logger.dateHeader));
          }
        }
      };
      httpRequest.send(logger.logParam + '=' + encodeURIComponent(JSON.stringify(logs)));

    } catch(e) {
      logInConsole(ex);
    }
  };

  /**
    Returns browser/client current date.
    Returns server date if server is in different time zone.

    @method getCurrentDate
    @return {Date} client/server date.
  */
  var getCurrentDate = function() {
    var date = new Date();
    try {
      if(logger.isServerInDifferentTimeZone && logger.offset) {
        date = new Date(new Date().getTime() + logger.offset);
      }
    } catch(ex) {
      logInConsole(ex);
    }
    return date;
  };

  /**
    Prepend "0" before given number.
    For example, it will convert month 1(Jan) to 01

    @method prefixZero
    @param {Integer/String} val Number which needs to be prefixed
    @return {Integer} numberOfdigits Maximum length of number.
  */
  var prefixZero = function(val, numberOfdigits) {
    var prefix          = "",
        digitsToAppend  = 0;

    try {
      numberOfdigits = numberOfdigits || 2;

      if (val) {
        val = val + "";
        digitsToAppend = numberOfdigits - val.length;

        while (digitsToAppend-- > 0) {
          prefix = prefix + "0";
        }

        val = prefix + val;

      }
      return val;
    } catch(ex) {
      logInConsole(ex);
    }

  };

  /**
    Format given date into format MM/DD/YYYY HH:mm:ss:S

    @method formatDate
    @param {Date} date
    @return {String} formatted date.
  */
  var formatDate = function(date) {
    try {
      var day = prefixZero(date.getDate());
      var month = prefixZero(date.getMonth() + 1);
      var year = date.getFullYear();
      var hours = prefixZero(date.getHours());
      var minutes = prefixZero(date.getMinutes());
      var seconds = prefixZero(date.getSeconds());
      var milliseconds = prefixZero(date.getMilliseconds(), 3);

      return (month + "/" + day + "/" + year + " " + hours + ":" + minutes + ":" + seconds + ":" + milliseconds);
    } catch(ex) {
      logInConsole(ex);
    }

  };

  /**
    Add log message to buffer and intiate the http request if buffer size met.

    @method appendOrSendMsg
    @param {String} type log
    @param {String/Object} msg log message
    @param {Boolean} isForceSend Set to true if you want to force the logs to reach server irrespective of buffer size
    @param {Boolean} isAsync Flag indicates whether server call is async or sync
  */
  var appendOrSendMsg = function(type, msg, isForceSend, isAsync) {
    try {
      var log;

      log = {
        type: type
      };

      var date = formatDate(getCurrentDate());
      log.date = date;

      if(isString(msg) || isNumber(msg)) {
        log.message = msg;
      } else if(isObject(msg)) {
        var keys = ['stack', 'line', 'column', 'url', 'message'];

        keys.forEach(function(key) {
          if (!isNotValue(msg[key])) {
            log[key] = msg[key];
          }
        });

        if (isNotValue(msg.message)) {
          log.message = "Some unexpected error thrown.";
        }
      }

      // If the log is added only for debugging or if you dont want to send logs to server then print lofs in console
      if (type === "DEBUG" || !logger.track) {
        logInConsole(log.type + "    :   "  + log.message);
      } else {
        // Add logs to buffer.
        logger.logs.push(log);
        // Check whether buffer reaches its maximum capacity or requested for focefull sending of logs to server
        if (logger.logs.length >= logger.buffer || isForceSend) {
          // Send logs to server
          sendLogsToServer(isAsync);
        }
      }
    } catch(e) {
      logInConsole(ex);
    }
  };

  /**
    Capture information logs

    @method info
    @param {String/Object} msg log message
    @param {Boolean} isForceSend Flag indicates message needs to send forcelly to server irrespective of buffer size
  */
  logger.info = function(msg, isForceSend) {
    appendOrSendMsg("INFO", msg, isForceSend);
  };

  /**
    Capture error logs

    @method error
    @param {String/Object} msg log message or error object
    @param {Boolean} isForceSend Flag indicates message needs to send forcelly to server irrespective of buffer size
  */
  logger.error = function(msg, isForceSend) {
    appendOrSendMsg("ERROR", msg, isForceSend);
  };

  /**
    Capture warning logs

    @method warn
    @param {String/Object} msg log message or warning trace object
    @param {Boolean} isForceSend Flag indicates message needs to send forcelly to server irrespective of buffer size
  */
  logger.warn = function(msg, isForceSend) {
    appendOrSendMsg("WARN", msg, isForceSend);
  };

  /**
    Capture debug logs

    @method debug
    @param {String/Object} msg log message or error object
  */
  logger.debug = function(msg) {
    appendOrSendMsg("DEBUG", msg);
  };

  /**
    Capture event logs

    @method event
    @param {String/Object} msg log message or error object
  */
  logger.event = function(msg) {
    appendOrSendMsg("EVENT", msg);
  };

  /**
    Capture custom type logs logs

    @method info
    @param {String/Object} msg log message
    @param {Boolean} isForceSend Flag indicates message needs to send forcelly to server irrespective of buffer size
    @param {Boolean} isAsync Flag indicates whether server call is async or sync
  */
  logger.custom = function(type, msg, isForceSend, isAsync) {
    appendOrSendMsg(type, msg, isForceSend, isAsync);
  };

  logger.errorstack = function(stack, msg, url, line, column) {
    try {
      var log = {
        message: msg,
        url: url,
        line: line,
        column: column,
        stack: (stack || {}).stack
      };

      // Last argument 'errorObj' is not available in certain browsers like IE/ Safari etc.
      // So error stack cant be captured for those type of browsers.
      if(stack) {
        log.column = column;
      } else {
        log.stack = "Error stack not available for this user agent " + navigator.userAgent;
      }

      logger.error(log, true);

    } catch(ex) {
      logInConsole(ex);
    }
  };

  /**
    Window event which triggers on close or refresh or back or forward actions in broswer.
    Log forcefully in server irrespective of buffer size when this action is triggerd.
  */
  window.onbeforeunload = function() {
    logger.info(logger.beforeUnloadMsg, true);
  };

  var scrollTimer = -1;
  // Track scroll events
  window.onscroll = function () {
    try {
      // Repeated logging of scroll events
      if (scrollTimer != -1) {
        clearTimeout(scrollTimer);
      }

      scrollTimer = window.setTimeout(function() {
        var body = document.getElementsByTagName('body')[0];
        logger.event("The client scrolled the application into " + body.scrollTop + " px.");
      }, 1000);
    } catch(ex) {
      logInConsole(ex);
    }

  };

  /**
    Window event triggered, whenever any javscript errors thorwn by application.
    Capture error trace and log forcefully in server irrespective of buffer size.
  */
  window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
    logger.errorstack(errorObj, errorMsg, url, lineNumber, column);

    // Tell browser to run its own error handler as well
    return false;
  }

  // Do on before Logger is assigned to window.
  try {
    if(logger.onBeforeLoggerInit && typeof logger.onBeforeLoggerInit === "function") {
      logger.onBeforeLoggerInit(logger);
    }
  } catch(ex) {
    logInConsole(ex);
  }


  return logger;

})();
