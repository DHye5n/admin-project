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

    // 실패 응답 생성
    public static <T> ApiResponseDto<T> failure(ResponseStatus status) {
        return new ApiResponseDto<>(false, status.getStatus(), status.getMessage(), null, status.getCode());
    }
}
