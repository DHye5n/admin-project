package dh.project.backend.service;

import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.enums.ResponseStatus;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

@Slf4j
@Service
public class FileService {

    @Value("${file.path}")
    private String filePath;
    @Value("${file.url}")
    private String fileUrl;

    /**
     *   TODO: 이미지 업로드
     * */
    public ApiResponseDto<String> upload(MultipartFile file) {

        if (file.isEmpty()) {
            return ApiResponseDto.failure(ResponseStatus.FILE_EMPTY);
        }

        String originalFilename = file.getOriginalFilename();
        if (StringUtils.isBlank(originalFilename)) {
            return ApiResponseDto.failure(ResponseStatus.INVALID_FILE_NAME);
        }

        // 파일 확장자 검증
        String extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();

        // 허용된 확장자 목록 설정 (예: 이미지 파일만 허용)
        String[] allowedExtensions = {".png", ".jpg", ".jpeg"};
        boolean isValidExtension = false;

        for (String ext : allowedExtensions) {
            if (extension.equals(ext)) {
                isValidExtension = true;
                break;
            }
        }

        if (!isValidExtension) {
            return ApiResponseDto.failure(ResponseStatus.INVALID_FILE_EXTENSION);
        }

        // 저장할 파일 이름 생성
        String uuid = UUID.randomUUID().toString();
        String saveFileName = uuid + extension;
        String savePath = Paths.get(filePath, saveFileName).toString();

        // 파일 디렉토리 존재 여부 확인 및 생성
        File directory = new File(filePath);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        try {
            // 파일 저장
            file.transferTo(new File(savePath));
        } catch (IOException e) {
            log.error("Error during file upload: ", e);
            return ApiResponseDto.failure(ResponseStatus.FILE_UPLOAD_FAIL);
        }

        String url = String.format("%s/%s", fileUrl.replaceAll("/$", ""), saveFileName);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, url);
    }

    /**
     *   TODO: 이미지 불러오기
     * */
    public ResponseEntity<Resource> getImage(String fileName) {

        // 파일 경로 설정
        String filePath = Paths.get(this.filePath, fileName).toString();
        File file = new File(filePath);

        log.info("File path: {}", filePath);

        // 파일 존재 여부 확인
        if (!file.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        // 파일 읽기
        try {
            Resource resource = new FileSystemResource(file);
            String mimeType = Files.probeContentType(file.toPath());

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(mimeType))
                    .body(resource);
        } catch (IOException e) {
            log.error("Error during file read: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
