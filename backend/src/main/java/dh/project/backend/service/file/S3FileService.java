package dh.project.backend.service.file;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
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
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
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
        if (!Arrays.asList(allowedExtensions).contains(extension)) {
            return ApiResponseDto.failure(ResponseStatus.INVALID_FILE_EXTENSION);
        }

        String saveFileName = UUID.randomUUID() + extension;

        try {
            // 1. 업로드 초기화
            InitiateMultipartUploadRequest initRequest = new InitiateMultipartUploadRequest(s3Bucket, saveFileName);
            InitiateMultipartUploadResult initResponse = amazonS3.initiateMultipartUpload(initRequest);

            // 2. InputStream에서 버퍼 단위로 읽어 파트 업로드
            List<PartETag> partETags = new ArrayList<>();
            long contentLength = file.getSize();
            long partSize = 5 * 1024 * 1024; // 5MB 파트 크기

            InputStream inputStream = file.getInputStream();
            int partNumber = 1;
            long filePosition = 0;

            while (filePosition < contentLength) {
                long currentPartSize = Math.min(partSize, contentLength - filePosition);

                UploadPartRequest uploadRequest = new UploadPartRequest()
                        .withBucketName(s3Bucket)
                        .withKey(saveFileName)
                        .withUploadId(initResponse.getUploadId())
                        .withPartNumber(partNumber)
                        .withInputStream(inputStream)
                        .withPartSize(currentPartSize);

                UploadPartResult uploadResult = amazonS3.uploadPart(uploadRequest);
                partETags.add(uploadResult.getPartETag());

                filePosition += currentPartSize;
                partNumber++;
            }

            // 3. 멀티파트 업로드 완료
            CompleteMultipartUploadRequest compRequest = new CompleteMultipartUploadRequest(
                    s3Bucket,
                    saveFileName,
                    initResponse.getUploadId(),
                    partETags);

            amazonS3.completeMultipartUpload(compRequest);

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
