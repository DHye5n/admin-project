package dh.project.backend.service;

import dh.project.backend.domain.UserEntity;
import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.response.user.SignInUserResponseDto;
import dh.project.backend.enums.ResponseStatus;
import dh.project.backend.exception.ErrorException;
import dh.project.backend.repository.UserRepository;
import dh.project.backend.service.principal.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    /**
     *   TODO: 유저 정보 반환
     * */
    public ApiResponseDto<SignInUserResponseDto> getSignInUser(PrincipalDetails user) {

        String username = user.getUsername();

        UserEntity userEntity = userRepository.findByUsername(username)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_USER));

        SignInUserResponseDto responseDto = SignInUserResponseDto.fromEntity(userEntity);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }
}
