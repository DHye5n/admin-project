package dh.project.backend.dto;

import dh.project.backend.enums.ResponseStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApiResponseDto<T> {

    private final boolean success;
    private final String message;
    private final T data;
    private final String code;

    public static <T> ApiResponseDto<T> success(ResponseStatus status) {
        return new ApiResponseDto<>(true, status.getMessage(), null, status.getCode());
    }

    public static <T> ApiResponseDto<T> failure(ResponseStatus status) {
        return new ApiResponseDto<>(false, status.getMessage(), null, status.getCode());
    }

    public static <T> ApiResponseDto<T> failure(String message) {
        // Optionally, you can set a default status or error code
        return new ApiResponseDto<>(false, message, null, "ERROR");
    }
}
