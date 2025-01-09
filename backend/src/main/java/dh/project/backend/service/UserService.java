package dh.project.backend.service;

import dh.project.backend.domain.UserEntity;
import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.user.PatchUserRequestDto;
import dh.project.backend.dto.response.user.GetUserResponseDto;
import dh.project.backend.dto.response.user.PatchUserResponseDto;
import dh.project.backend.dto.response.user.SignInUserResponseDto;
import dh.project.backend.enums.ResponseStatus;
import dh.project.backend.exception.ErrorException;
import dh.project.backend.repository.UserRepository;
import dh.project.backend.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final AuthService authService;

    /**
     *   TODO: 로그인 유저 정보
     * */
    public ApiResponseDto<SignInUserResponseDto> getSignInUser() {

        UserEntity currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            throw new ErrorException(ResponseStatus.AUTHORIZATION_FAIL); // 또는 다른 적절한 예외 처리
        }


        SignInUserResponseDto responseDto = SignInUserResponseDto.fromEntity(currentUser);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }

    /**
     *   TODO: 유저 정보
     * */
    public ApiResponseDto<GetUserResponseDto> getUser(String email) {

        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_USER));

        GetUserResponseDto responseDto = GetUserResponseDto.fromEntity(userEntity);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }

    /**
     *   TODO: 프로필 수정
     * */
    @Transactional
    public ApiResponseDto<PatchUserResponseDto> patchProfile(PatchUserRequestDto dto, Long userId) {

        try {

            UserEntity currentUser = authService.getCurrentUser();
            if (currentUser == null) {
                throw new ErrorException(ResponseStatus.AUTHORIZATION_FAIL); // 권한 없는 사용자
            }

            authService.checkUserAuthorization(userId, currentUser.getUserId());

            UserEntity userEntity = userRepository.findById(userId)
                    .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_USER));

            if (dto.getUsername() != null) {
                if (userRepository.existsByUsername(dto.getUsername())) {
                    throw new ErrorException(ResponseStatus.DUPLICATE_USERNAME);
                }
                userEntity.updateUsername(dto.getUsername());
            }

            if (dto.getProfileImage() != null) {
                userEntity.updateProfileImage(dto.getProfileImage());
            }

            userRepository.save(userEntity);

            PatchUserResponseDto responseDto = PatchUserResponseDto.fromEntity(userEntity);

            return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ErrorException(ResponseStatus.DATABASE_ERROR);
        }
    }
}
