package dh.project.backend.service.file;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.S3Object;
import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.enums.ResponseStatus;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.UUID;

@Profile("prod")
@RequiredArgsConstructor
@Service
public class S3FileService implements FileStorageService {

    @Value("${cloud.aws.s3.bucket}")
    private String s3Bucket;

    private final AmazonS3 amazonS3;

    @Override
    public ApiResponseDto<String> upload(MultipartFile file) {
        if (file.isEmpty()) {
            return ApiResponseDto.failure(ResponseStatus.FILE_EMPTY);
        }

        String originalFilename = file.getOriginalFilename();
        if (StringUtils.isBlank(originalFilename)) {
            return ApiResponseDto.failure(ResponseStatus.INVALID_FILE_NAME);
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
        String[] allowedExtensions = {".png", ".jpg", ".jpeg"};
        boolean isValidExtension = Arrays.asList(allowedExtensions).contains(extension);

        if (!isValidExtension) {
            return ApiResponseDto.failure(ResponseStatus.INVALID_FILE_EXTENSION);
        }

        String saveFileName = UUID.randomUUID() + extension;

        try {
            amazonS3.putObject(s3Bucket, saveFileName, file.getInputStream(), null);
        } catch (IOException e) {
            return ApiResponseDto.failure(ResponseStatus.FILE_UPLOAD_FAIL);
        }

        String url = "https://" + s3Bucket + ".s3.amazonaws.com/" + saveFileName;
        return ApiResponseDto.success(ResponseStatus.SUCCESS, url);
    }

    @Override
    public ResponseEntity<Resource> getImage(String fileName) {
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
}
