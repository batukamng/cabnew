/*
package com.mram.controller.core;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import javax.imageio.IIOException;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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

import com.google.gson.Gson;

@Controller
@RequestMapping("/api/image/browser")
public class ImageBrowserController {

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
		System.out.println("@@@"+folderRoot);
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

	@GetMapping(value="/thumbnail")
	public void getThumbnail(HttpServletRequest req,  HttpServletResponse response) throws IIOException {
		try{
			String folderRoot = req.getParameter("path");
			Path rootLocation = Paths.get(folderRoot);
			File imgPath = new File(rootLocation.toAbsolutePath().toUri());
			String ext= FilenameUtils.getExtension(imgPath.getName());

			OutputStream outputStream = response.getOutputStream();
			if(ext.equalsIgnoreCase("png") || ext.equalsIgnoreCase("jpg") || ext.equalsIgnoreCase("jpeg") || ext.equalsIgnoreCase("gif")){
				BufferedImage bufferedImage = ImageIO.read(imgPath.getAbsoluteFile());
				int type = bufferedImage.getType() == 0? BufferedImage.TYPE_INT_ARGB : bufferedImage.getType();
				BufferedImage resizedImage = new BufferedImage(80, 50, type);
				Graphics2D g = resizedImage.createGraphics();
				g.drawImage(bufferedImage, 0, 0, 80, 50, null);
				g.dispose();
				ImageIO.write(resizedImage, ext, outputStream);
			}
			else{
				BufferedImage resizedImage = new BufferedImage(80, 50, 5);
				Graphics2D g = resizedImage.createGraphics();
				g.drawImage(resizedImage, 0, 0, 80, 50, null);
				g.dispose();
				ImageIO.write(resizedImage, ext, outputStream);
			}
			outputStream.close();
		}
		catch(Exception e){
			e.printStackTrace();
		}
	}

	@PostMapping("/upload")
	public @ResponseBody String handleFileUpload(@RequestParam("file") MultipartFile file,HttpServletRequest req) {
		String message = "";
		String folderRoot = req.getParameter("path");
		System.out.println("#####"+folderRoot);
		Gson gson=new Gson();
		try {
			if(folderRoot!=null && folderRoot.startsWith("upload-dir")){
				folderRoot = "editor";
			}
			else{
				folderRoot = "editor";
			}
			storageService.store(file,file.getOriginalFilename(),folderRoot);
			LutAttFile item = new LutAttFile();
			item.setType("f");
			item.setUseYn(1);
			item.setName(file.getOriginalFilename());
			item.setLocation("/api/file/downloadFile/editor/"+file.getOriginalFilename());
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

	@GetMapping("/image")
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
		String directory = env.getProperty("file.upload-dir");
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
