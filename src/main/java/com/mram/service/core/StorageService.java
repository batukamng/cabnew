package com.mram.service.core;

import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.InvalidPathException;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class StorageService {

    @Autowired
    private Environment env;

    Logger log = LoggerFactory.getLogger(this.getClass().getName());

    public void store(MultipartFile file, String fileName, String dir) {
        try {
            String directory = env.getProperty("file.upload-dir");
            Path rootLocation = Paths.get(directory);

            String pathString = directory + File.separator + dir;
            File dtx = new File(pathString);
            if (!dtx.exists()) {
                dtx.mkdirs();
            }

            rootLocation = Paths.get(pathString);
            Files.copy(file.getInputStream(), rootLocation.resolve(fileName));
        } catch (FileNotFoundException e) {
            throw new RuntimeException("FAIL!");
        } catch (IOException e) {
            log.info("adfasdfs");
        }
    }

    public String storeGetName(MultipartFile file, String fileName, String dir) {
        try {
            String directory = env.getProperty("file.upload-dir");
            Path rootLocation = Paths.get(directory);

            String pathString = directory + File.separator + dir;
            File dtx = new File(pathString);
            if (!dtx.exists()) {
                dtx.mkdirs();
            }
            rootLocation = Paths.get(pathString);

            File oldFile = new File(pathString + File.separator + fileName);
            if (oldFile.exists()) {
                //File oldFile2 = new File(pathString + File.separator + fileName);
                FileDelete(oldFile);
                //oldFile2.delete();
            }
            fileName = fileName + "." + FilenameUtils.getExtension(file.getOriginalFilename().toLowerCase());
            Files.copy(file.getInputStream(), rootLocation.resolve(fileName));
            return dir + File.separator + fileName;
        } catch (FileNotFoundException e) {
            throw new RuntimeException("FAIL!");
        } catch (IOException e) {
            log.info("adfasdfs");
        }
        return null;
    }

    private synchronized void FileDelete(File file){
        file.delete();
    }

    public Resource loadFile(String filename, String path) throws InvalidPathException {
        try {
            String directory = env.getProperty("file.upload-dir");
            Path rootLocation = Paths.get(directory + File.separator + path);
            Path file = rootLocation.resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                return null;
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("FAIL!");
        }
    }

    public boolean deleteOne(String filePath) {
        File file = new File(filePath);
        return file.delete();
    }

    public void init() {
        String directory = env.getProperty("file.upload-dir");
        Path rootLocation = Paths.get(directory);
        if (!Files.exists(rootLocation)) {
            try {
                Files.createDirectory(rootLocation);
            } catch (IOException e) {
                throw new RuntimeException("Could not initialize storage!");
            }
        }

    }
}
