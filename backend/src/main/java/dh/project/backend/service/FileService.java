package dh.project.backend.service;

import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.service.file.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@Service
public class FileService {

    private final FileStorageService fileStorageService;

    public ApiResponseDto<String> upload(MultipartFile file) {
        return fileStorageService.upload(file);
    }

    public ResponseEntity<Resource> getImage(String fileName) {
        return fileStorageService.getImage(fileName);
    }
}
