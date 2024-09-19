package com.mram.service.core;

import com.mram.message.exception.FileStorageException;
import com.mram.message.exception.MyFileNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileStorageService {

    @Autowired
    private Environment env;

    @Autowired
    public FileStorageService(Environment env) {
        Path fileStorageLocation = Paths.get(env.getProperty("file.upload-dir", "./uploads/files"))
                .toAbsolutePath().normalize();

        try {
            Files.createDirectories(fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException(
                    "Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public String storeFile(MultipartFile file, String name, String path) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());

        // String fileName = new Date().getTime() + "-file." +
        // getFileExtension(file.getOriginalFilename());
        try {
            // Normalize file name
            String pathString = env.getProperty("file.upload-dir") + File.separator + path;
            File dtx = new File(pathString);
            if (!dtx.exists()) {
                boolean mkdirs = dtx.mkdirs();
                System.out.println("Folder created : " + mkdirs);
            }
            // Check if the file's name contains invalid characters
            if (fileName.contains("..")) {
                throw new FileStorageException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            // Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Path targetLocation = Paths.get(pathString);
            Files.copy(file.getInputStream(), targetLocation.resolve(name), StandardCopyOption.REPLACE_EXISTING);

            return pathString;
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null) {
            return null;
        }
        String[] fileNameParts = fileName.split("\\.");

        return fileNameParts[fileNameParts.length - 1];
    }

    public String storeMediaFile(MultipartFile file, String name, String path) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            // Normalize file name

            String pathString = env.getProperty("file.upload-dir") + File.separator + path;
            File dtx = new File(pathString);
            if (!dtx.exists()) {
                boolean mkdirs = dtx.mkdirs();
                System.out.println("Folder created : " + mkdirs);
            }
            // Check if the file's name contains invalid characters
            if (fileName.contains("..")) {
                throw new FileStorageException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = Paths.get(pathString);
            Files.copy(file.getInputStream(), targetLocation.resolve(name), StandardCopyOption.REPLACE_EXISTING);

            return pathString;
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public String storeTemplateFile(MultipartFile file, String fileName, String path) {
        try {

            String pathString = path + "/assets/reporttemplate/";
            File dtx = new File(pathString);
            if (!dtx.exists()) {
                boolean mkdirs = dtx.mkdirs();
                System.out.println("Folder created : " + mkdirs);
            }
            // Check if the file's name contains invalid characters
            if (fileName.contains("..")) {
                throw new FileStorageException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = Paths.get(pathString);
            Files.copy(file.getInputStream(), targetLocation.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);

            return pathString;
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public Resource loadFileAsResource(String username, String fileName) {
        try {
            String pathString = env.getProperty("file.upload-dir") + File.separator + username;
            Path filePath = Paths.get(pathString).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new MyFileNotFoundException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new MyFileNotFoundException("File not found " + fileName, ex);
        }
    }

    public String storeZipFile(File file, String generatedName, String path) {
        try {
            // Normalize file name

            String pathString = env.getProperty("file.upload-dir") + File.separator + path;
            File dtx = new File(pathString);
            if (!dtx.exists()) {
                boolean mkdirs = dtx.mkdirs();
                System.out.println("Folder created : " + mkdirs);
            }
            // Check if the file's name contains invalid characters
            if (generatedName.contains("..")) {
                throw new FileStorageException("Sorry! Filename contains invalid path sequence " + generatedName);
            }

            InputStream targetStream = new FileInputStream(file);

            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = Paths.get(pathString);
            Files.copy(targetStream, targetLocation.resolve(generatedName), StandardCopyOption.REPLACE_EXISTING);

            targetStream.close();
            return pathString;
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + generatedName + ". Please try again!", ex);
        }
    }

    public Resource loadFileAsUrlResource(String url) {
        try {
            // String pathString = env.getProperty("file.upload-dir") + File.separator +
            // username;
            Path filePath = Paths.get(url).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new MyFileNotFoundException("File not found " + resource.getFilename());
            }
        } catch (MalformedURLException ex) {
            throw new MyFileNotFoundException("File not found ", ex);
        }
    }
}
