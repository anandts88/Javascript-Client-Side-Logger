package com.test;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

/**
 * Servlet implementation class MyLogger
 */
@WebServlet("/MyLogger")
public class MyLogger extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public MyLogger() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		// Set response content type
		System.out.println("Hello");
		response.setContentType("text/html");
		PrintWriter out = response.getWriter();
		out.println("<h1>My Logger </h1>");
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		   
		PrintWriter out = null;
		String jsonString = "";
		
		try {
			Gson gson = new Gson();
			jsonString = request.getParameter("messages");
			
			MyLog[] navigationArray = gson.fromJson(jsonString, MyLog[].class);
			System.out.println("Number of messages received: " + navigationArray.length);
			String userAgent = request.getHeader("User-Agent");
			Device device = new Device(userAgent);
			String browser = device.getBrowser();
			
			File file = new File("/Users/anand/aob.log");
			if(!file.exists()) {
				file.createNewFile();
			}
			
		    out = new PrintWriter(new BufferedWriter(new FileWriter(file, true)));
			for(MyLog log: navigationArray) {
				out.print(log.getType());
				
				out.print("	:	" + log.getDate());
				out.print("	:	" + request.getRemoteAddr());
				out.print("	:	" + browser);
				out.print("	:	" + log.getMessage());
						
				if(log.getUrl() != null) {
					out.print("  Url:" + log.getUrl());
				}
				
				if(log.getLine() != null) {
					out.print("  Line:" + log.getLine());
				}
				
				if(log.getColumn() != null) {
					out.print("  Column:" + log.getColumn());
				}
				
				if(log.getStack() != null) {
					out.println("");
					out.print(log.getStack());
				}
				
				out.println("");
			}
		} catch (Exception e) {
			System.out.println(jsonString);
		    System.err.println(e);
		} finally {
		    if(out != null) {
		        out.close();
		    }
		}
	}

}
