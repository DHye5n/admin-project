package dh.project.backend.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.S3Object;
import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.enums.ResponseStatus;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamResource;
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

@RequiredArgsConstructor
@Service
public class FileService {

    @Value("${file.upload.type}")
    private String fileUploadType;
    @Value("${file.path}")
    private String filePath;
    @Value("${file.url}")
    private String fileUrl;
    @Value("${cloud.aws.s3.bucket}")
    private String s3Bucket;

    private final AmazonS3 amazonS3;

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

        if ("local".equals(fileUploadType)) {
            // 로컬 환경에서 파일 저장
            String savePath = Paths.get(filePath, saveFileName).toString();
            File directory = new File(filePath);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            try {
                // 파일 저장
                file.transferTo(new File(savePath));
            } catch (IOException e) {
                return ApiResponseDto.failure(ResponseStatus.FILE_UPLOAD_FAIL);
            }

            String url = String.format("%s/%s", fileUrl.replaceAll("/$", ""), saveFileName);
            return ApiResponseDto.success(ResponseStatus.SUCCESS, url);

        } else if ("s3".equals(fileUploadType)) {
            // S3 환경에서 파일 저장
            try {
                amazonS3.putObject(s3Bucket, saveFileName, file.getInputStream(), null);
            } catch (IOException e) {
                return ApiResponseDto.failure(ResponseStatus.FILE_UPLOAD_FAIL);
            }

            String url = "https://" + s3Bucket + ".s3.amazonaws.com/" + saveFileName;
            return ApiResponseDto.success(ResponseStatus.SUCCESS, url);
        }

        return ApiResponseDto.failure(ResponseStatus.FILE_UPLOAD_FAIL);
    }

    /**
     *   TODO: 이미지 불러오기
     * */
    public ResponseEntity<Resource> getImage(String fileName) {

        if ("local".equals(fileUploadType)) {
            // 로컬에서 이미지 불러오기
            String filePath = Paths.get(this.filePath, fileName).toString();
            File file = new File(filePath);

            // 파일 존재 여부 확인
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
        } else if ("s3".equals(fileUploadType)) {
            try {
                S3Object s3Object = amazonS3.getObject(s3Bucket, fileName);
                InputStreamResource inputStreamResource = new InputStreamResource(s3Object.getObjectContent());
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(s3Object.getObjectMetadata().getContentType()))
                        .body(inputStreamResource);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
