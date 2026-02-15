package com.ecommerce.project.service;

import com.ecommerce.project.serviceInterface.FileService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {

    @Override
    public String uploadImage(String path, MultipartFile file) throws IOException {
        //file name of current / original file
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Image file is empty");
        }
        String originalFileName=file.getOriginalFilename();

        if (originalFileName == null || !originalFileName.contains(".")) {
            throw new IllegalArgumentException("Invalid image file name");
        }
        //check if path exist and create
        File folder = new File(path);
        if (!folder.exists()) {
            folder.mkdirs();   // ✅ creates parent directories also
        }


        //Generate a unique file name
        String randomId= UUID.randomUUID().toString();


        //mat.jpt -->1234 --> 1234.jpt //yasle yasto kam garxa so
        String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String fileName = randomId + extension;
        String filePath = path + File.separator + fileName;


        Files.copy(
                file.getInputStream(),
                Paths.get(filePath),
                StandardCopyOption.REPLACE_EXISTING
        );

        // update to server
        return fileName;
    }
}
