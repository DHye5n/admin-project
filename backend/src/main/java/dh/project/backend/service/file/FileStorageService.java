package dh.project.backend.service.file;

import dh.project.backend.dto.ApiResponseDto;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    ApiResponseDto<String> upload(MultipartFile file);
    ResponseEntity<Resource> getImage(String fileName);
}
