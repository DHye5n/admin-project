package dh.project.backend.exception;

import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.enums.ResponseStatus;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ErrorException.class)
    public ResponseEntity<ApiResponseDto<Void>> handleError(ErrorException e) {
        return ResponseEntity
                .status(e.getStatusCode())
                .body(ApiResponseDto.failure(e.getStatus()));
    }

    @ExceptionHandler({Exception.class, RuntimeException.class})
    public ResponseEntity<ApiResponseDto<Void>> handleUnexpectedException(Exception e) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponseDto.failure(ResponseStatus.DATABASE_ERROR));
    }
}
