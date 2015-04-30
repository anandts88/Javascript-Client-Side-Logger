window.LoggerConfig = {
  url: "http://10.7.189.204:8080/clientSideLogging/MyLogger",
  isServerInDifferentTimeZone: false /*,
  onBeforeLoggerInit: function(logger) {
    if(logger.isServerInDifferentTimeZone) {
      logger.custom("OFFSET", "Sending log for getting offset.", true, false);
    }
  }*/
};