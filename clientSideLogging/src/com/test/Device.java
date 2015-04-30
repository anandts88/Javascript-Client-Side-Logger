package com.test;

public class Device {
	private String userAgent;
	
	public Device(String userAgent) {
		this.userAgent = userAgent;
	}
	
	public String getOS() {
		String currentLowerUA = this.userAgent.toLowerCase();
		
		// Windows Phone
	    if (currentLowerUA.indexOf("windows phone") >= 0) {
	        return "Windows Phone";
	    }

	    // Windows
	    if (currentLowerUA.indexOf("windows") >= 0) {
	        return "Windows";
	    }

	    // Android
	    if (currentLowerUA.indexOf("android") >= 0) {
	        return "Android";
	    }

	    // iOS
	    if (currentLowerUA.indexOf("apple-i") >= 0) {
	        return "iOS";
	    }

	    if (currentLowerUA.indexOf("iphone") >= 0) {
	        return "iOS";
	    }

	    if (currentLowerUA.indexOf("ipad") >= 0) {
	        return "iOS";
	    }

	    // BlackBerry
	    if (currentLowerUA.indexOf("blackberry") >= 0) {
	        return "BlackBerry";
	    }

	    // BlackBerry
	    if (currentLowerUA.indexOf("(bb") >= 0) {
	        return "BlackBerry";
	    }

	    // Kindle
	    if (currentLowerUA.indexOf("kindle") >= 0) {
	        return "Kindle";
	    }

	    // Macintosh
	    if (currentLowerUA.indexOf("macintosh") >= 0) {
	        return "Macintosh";
	    }

	    // Linux
	    if (currentLowerUA.indexOf("linux") >= 0) {
	        return "Linux";
	    }

	    // OpenBSD
	    if (currentLowerUA.indexOf("openbsd") >= 0) {
	        return "OpenBSD";
	    }

	    // Firefox OS
	    if (currentLowerUA.indexOf("firefox") >= 0) {
	        return "Firefox OS"; // Web is the plaform
	    }

	    return "Unknown operating system";
	}
	
	public String getBrowser() {
	    String browsername = "";
	    String browserversion = "";
	    String browser = this.userAgent;
	    try {
	    	if (browser.contains("MSIE")) {
	  	      String subsString = browser.substring(browser.indexOf("MSIE"));
	  	      String info[] = (subsString.split(";")[0]).split(" ");
	  	      browsername = info[0];
	  	      browserversion = info[1];
	  	    } else if (browser.contains("Firefox")) {

	  	      String subsString = browser.substring(browser.indexOf("Firefox"));
	  	      String info[] = (subsString.split(" ")[0]).split("/");
	  	      browsername = info[0];
	  	      browserversion = info[1];
	  	    } else if (browser.contains("Chrome")) {

	  	      String subsString = browser.substring(browser.indexOf("Chrome"));
	  	      String info[] = (subsString.split(" ")[0]).split("/");
	  	      browsername = info[0];
	  	      browserversion = info[1];
	  	    } else if (browser.contains("Opera")) {

	  	      String subsString = browser.substring(browser.indexOf("Opera"));
	  	      String info[] = (subsString.split(" ")[0]).split("/");
	  	      browsername = info[0];
	  	      browserversion = info[1];
	  	    } else if (browser.contains("Safari")) {

	  	      String subsString = browser.substring(browser.indexOf("Safari"));
	  	      String info[] = (subsString.split(" ")[0]).split("/");
	  	      browsername = info[0];
	  	      browserversion = info[1];
	  	    } else {
	  	    	browsername = "Native";
	  	    }	
	    } catch(Exception ex) {
	    	browsername = "";
	    }
	    
	    
	    return browsername + " " + browserversion;
	  }
}
