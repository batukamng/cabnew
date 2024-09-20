package com.mram.controller.core;
import com.mram.base.exception.ResourceNotFoundException;
import com.mram.config.security.UserPrincipal;
import com.mram.dao.MainDao;
import com.mram.model.core.AttFile;
import com.mram.repository.core.AttFileRepository;
import com.mram.service.core.PaginatedResult;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.json.JSONException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/file")
public class SysFileController {

    private static final Logger logger = LoggerFactory.getLogger(SysFileController.class);

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    AttFileRepository fileRepository;

    @Autowired
    private MainDao dao;

    @PostMapping("/uploadFile")
    public AttFile uploadFile(@RequestParam("file") MultipartFile file) {
        Long userId = null;
        String username="";
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            userId = userPrincipal.getId();
            username = authentication.getName();
        }
        else{
            username = "AnonymousUser";
        }

        String generatedName = new Date().getTime()+ "-" +RandomStringUtils.randomAlphanumeric(10)+"."+FilenameUtils.getExtension(file.getOriginalFilename());
        //String fileName = fileStorageService.storeFile(file,generatedName,userDetail.getUsername());
        String fileName = fileStorageService.storeFile(file,generatedName,username);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/file/downloadFile/"+username+"/")
                .path(generatedName)
                .toUriString();
        String extension = FilenameUtils.getExtension(file.getOriginalFilename());
        AttFile item=new AttFile();
        item.setMimeType(extension);
        item.setType(extension);
        item.setRegId(userId);
        item.setFileSize(file.getSize());
        item.setSize(file.getSize());
        item.setFileSaveNm(generatedName);
        item.setFilePath(fileName);
        //item.setUri(fileDownloadUri);
        item.setUri("/api/file/downloadFile/"+username+"/"+generatedName);
        item.setName(file.getOriginalFilename());
        item.setUseYn(1);
        return fileRepository.save(item);
    }

    @PostMapping("/uploadMultipleFiles")
    public List<AttFile> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
        return Arrays.asList(files)
                .stream()
                .map(file -> uploadFile(file))
                .collect(Collectors.toList());
    }

   /* @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id, HttpServletRequest request) {
        LutAttFile file=fileRepository.getById(id);
        // Load file as Resource
        Resource resource = fileStorageService.loadFileAsResource(file.getLutUser().getUsername(),file.getFileSaveNm());

        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            logger.info("Could not determine file type.");
        }

        // Fallback to the default content type if type could not be determined
        if(contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }*/

    @GetMapping("/downloadFile/{username}/{year}/{fileName:.+}")
    public ResponseEntity<Resource> downloadNoteFile(@PathVariable String username,@PathVariable String year,@PathVariable String fileName, HttpServletRequest request) {
        // Load file as Resource
        Resource resource = fileStorageService.loadFileAsResource(username+File.separator+year,fileName);

        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            logger.info("Could not determine file type.");
        }

        // Fallback to the default content type if type could not be determined
        if(contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/downloadFile/{username}/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String username,@PathVariable String fileName, HttpServletRequest request) {
        // Load file as Resource
        Resource resource = fileStorageService.loadFileAsResource(username,fileName);

        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            logger.info("Could not determine file type.");
        }

        // Fallback to the default content type if type could not be determined
        if(contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, " filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/item/{id}")
    public AttFile getById(@PathVariable(value = "id") Long id) {
        return fileRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("LutAttFile", "id", id));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody AttFile noteDetails) throws IOException {
        Path fileToDeletePath = Paths.get(noteDetails.getFilePath()+ File.separator+noteDetails.getFileSaveNm());
        if (fileToDeletePath.toFile().exists()) {
            Files.delete(fileToDeletePath);
        }
        fileRepository.delete(noteDetails);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable long id) throws IOException {
        AttFile noteDetails =fileRepository.getById(id);
        Path fileToDeletePath = Paths.get(noteDetails.getFilePath()+ File.separator+noteDetails.getFileSaveNm());
        if (fileToDeletePath.toFile().exists()) {
            Files.delete(fileToDeletePath);
        }
        fileRepository.delete(noteDetails);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/list")
    public ResponseEntity<?> getList(@RequestBody String data) throws JSONException {
        return ResponseEntity
                .ok(new PaginatedResult()
                        .setData(this.dao.getListByPage(data,"LutAttFile"))
                        .setCurrentPage(0)
                        .setTotal(this.dao.getTotalPage(data,"LutAttFile")));
    }

}
