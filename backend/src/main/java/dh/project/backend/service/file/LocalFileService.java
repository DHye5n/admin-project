package dh.project.backend.service.file;

import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.enums.ResponseStatus;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
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
import java.util.Arrays;
import java.util.UUID;


@Profile("local")
@RequiredArgsConstructor
@Service
public class LocalFileService implements FileStorageService {

    @Value("${file.path}")
    private String filePath;

    @Value("${file.url}")
    private String fileUrl;

    @Override
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
        String[] allowedExtensions = {".png", ".jpg", ".jpeg"};
        boolean isValidExtension = Arrays.asList(allowedExtensions).contains(extension);

        if (!isValidExtension) {
            return ApiResponseDto.failure(ResponseStatus.INVALID_FILE_EXTENSION);
        }

        // 저장할 파일 이름 생성
        String saveFileName = UUID.randomUUID() + extension;
        String savePath = Paths.get(filePath, saveFileName).toString();

        File directory = new File(filePath);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        try {
            file.transferTo(new File(savePath));
        } catch (IOException e) {
            return ApiResponseDto.failure(ResponseStatus.FILE_UPLOAD_FAIL);
        }

        String url = String.format("%s/%s", fileUrl.replaceAll("/$", ""), saveFileName);
        return ApiResponseDto.success(ResponseStatus.SUCCESS, url);
    }

    @Override
    public ResponseEntity<Resource> getImage(String fileName) {
        String filePath = Paths.get(this.filePath, fileName).toString();
        File file = new File(filePath);

        if (!file.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        try {
            Resource resource = new FileSystemResource(file);
            String mimeType = Files.probeContentType(file.toPath());
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(mimeType))
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
