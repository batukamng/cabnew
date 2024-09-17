/*
package com.mram.controller.core;

import com.google.gson.Gson;
import com.mram.model.core.LutAttFile;
import com.mram.service.core.StorageService;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/api/file/browser")
public class FileBrowserController {

	@Autowired
	private Environment env;

	@Autowired
	StorageService storageService;

	@PostMapping("/read")
	public @ResponseBody String getListFiles(HttpServletRequest req) throws IOException {
		String folderRoot = req.getParameter("path");
		Gson gson=new Gson();
		List<LutAttFile> items=new ArrayList<>();

		File folder = new File(folderRoot);
		if(!folder.exists()){
			folder.mkdir();
		}
		for (final File fileEntry : folder.listFiles()) {
			if (!fileEntry.isDirectory()) {
				LutAttFile item = new LutAttFile();
				item.setType("f");
				item.setName(fileEntry.getName());
				item.setSize(fileEntry.length());
				items.add(item);
			}
			else {
				LutAttFile item = new LutAttFile();
				item.setType("d");
				item.setName(fileEntry.getName());
				item.setSize(fileEntry.length());
				items.add(item);
			}
		}
		return gson.toJson(items);
	}

	@PostMapping("/upload")
	public @ResponseBody String handleFileUpload(@RequestParam("file") MultipartFile file,HttpServletRequest req) {
		String message = "";
		String folderRoot = req.getParameter("path");
		System.out.println("#####"+folderRoot);
		Gson gson=new Gson();
		try {
			storageService.store(file,file.getOriginalFilename(),folderRoot);
			LutAttFile item = new LutAttFile();
			item.setType("f");
			item.setName(file.getOriginalFilename());
			item.setSize(file.getSize());
			item.setMimeType(FilenameUtils.getExtension(file.getName()));
			return gson.toJson(item);
		} catch (Exception e) {
			message = "FAIL to upload " + file.getOriginalFilename() + "!";
			return message;
		}
	}

	@RequestMapping(value="/create",method=RequestMethod.GET)
	public @ResponseBody String create(@RequestParam final String name, @RequestParam final String type, @RequestParam String path,HttpServletRequest req) throws IOException {
		try{
			File destination = new File(path+File.separator+name);
			LutAttFile d = new LutAttFile();
			d.setType(type);
			d.setName(name);
			d.setSize(destination.length());
			if(!destination.exists()){
				System.out.println("shine folder uussen eseh "+ destination.getAbsolutePath());
				System.out.println("shine folder uussen eseh "+ destination.mkdir());
			}
			Gson gson = new Gson();
			return gson.toJson(d);
		}
		catch(Exception e){
			e.printStackTrace();
			return null;
		}
	}

	@GetMapping("/file")
	public ResponseEntity<Resource> downloadFile(HttpServletRequest req) throws MalformedURLException {
		String folderRoot = req.getParameter("path");
		Path rootLocation = Paths.get(folderRoot);
		File imgPath = new File(rootLocation.toAbsolutePath().toUri());
		Resource resource = new UrlResource(rootLocation.toAbsolutePath().toUri());
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + imgPath.getName() + "\"")
				.body(resource);
	}

	@PostMapping(value="/destroy")
	public @ResponseBody String destroy(HttpServletRequest req) {
		String directory = env.getProperty("mtef.paths.uploadedFiles");
		String folderRoot = req.getParameter("path");
		System.out.println(folderRoot);
		Path rootLocation = Paths.get(directory);
		File destination = new File(folderRoot+File.separator+req.getParameter("name"));
		if(destination.delete()){
			System.out.println(destination.getName() + " is deleted!");
		}else{
			System.out.println("Delete operation is failed.");
		}
		return "true";

	}
}
*/
