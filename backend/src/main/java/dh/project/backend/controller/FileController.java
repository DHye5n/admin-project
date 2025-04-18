package dh.project.backend.controller;

import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@RequestMapping("/api/v1/files")
@RestController
public class FileController {

    private final FileService fileService;

    /**
     *   TODO: 이미지 업로드
     * */
    @PostMapping("/upload")
    public ResponseEntity<ApiResponseDto<String>> upload(@RequestParam("file") MultipartFile file) {
        ApiResponseDto<String> responseDto = fileService.upload(file);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 이미지 불러오기
     * */
    @GetMapping(value = "/{fileName}", produces = {MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE})
    public ResponseEntity<Resource> getImage(@PathVariable("fileName") String fileName) {
        return fileService.getImage(fileName);
    }
}
