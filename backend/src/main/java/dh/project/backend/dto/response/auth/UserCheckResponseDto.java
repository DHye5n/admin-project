package dh.project.backend.dto.response.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserCheckResponseDto {

    private final boolean exist;

}
