package dh.project.backend.exception;

import dh.project.backend.dto.ApiResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ErrorException.class)
    public ResponseEntity<ApiResponseDto<Void>> handleError(ErrorException e) {
        log.error("Error occurred: {}", e.getMessage(), e);
        return ResponseEntity
                .status(e.getStatusCode())
                .body(ApiResponseDto.failure(e.getStatus()));
    }

    @ExceptionHandler({Exception.class, RuntimeException.class})
    public ResponseEntity<ApiResponseDto<Void>> handleUnexpectedException(Exception e) {
        log.error("Unexpected error: {}", e.getMessage(), e);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponseDto.failure("예상치 못한 오류가 발생했습니다."));
    }
}
