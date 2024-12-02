package dh.project.backend.dto;

import dh.project.backend.enums.ResponseStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApiResponseDto<T> {

    private final boolean success;
    private final int status;
    private final String message;
    private final T data;
    private final String code;

    // 성공 응답 생성
    public static <T> ApiResponseDto<T> success(ResponseStatus status) {
        return new ApiResponseDto<>(true, status.getStatus(), status.getMessage(), null, status.getCode());
    }

    public static <T> ApiResponseDto<T> success(ResponseStatus status, T data) {
        return new ApiResponseDto<>(true, status.getStatus(), status.getMessage(), data, status.getCode());
    }

    // 실패 응답 생성
    public static <T> ApiResponseDto<T> failure(ResponseStatus status) {
        return new ApiResponseDto<>(false, status.getStatus(), status.getMessage(), null, status.getCode());
    }

    // boolean 타입을 포함한 성공 응답 생성
    public static ApiResponseDto<Boolean> success(boolean result) {
        return new ApiResponseDto<>(true, ResponseStatus.SUCCESS.getStatus(), ResponseStatus.SUCCESS.getMessage(), result, ResponseStatus.SUCCESS.getCode());
    }

    // boolean 타입을 포함한 실패 응답 생성
    public static ApiResponseDto<Boolean> failure(boolean result, ResponseStatus status) {
        return new ApiResponseDto<>(false, status.getStatus(), status.getMessage(), result, status.getCode());
    }
}
