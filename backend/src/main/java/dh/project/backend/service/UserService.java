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
import dh.project.backend.service.principal.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;

    /**
     *   TODO: 로그인 유저 정보
     * */
    public ApiResponseDto<SignInUserResponseDto> getSignInUser(PrincipalDetails user) {

        if (user == null) {
            throw new ErrorException(ResponseStatus.AUTHORIZATION_FAIL);
        }

        SignInUserResponseDto responseDto = SignInUserResponseDto.fromEntity(user.getUser());

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
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public ApiResponseDto<PatchUserResponseDto> patchProfile(PatchUserRequestDto dto, PrincipalDetails user) {

        if (user == null) {
            throw new ErrorException(ResponseStatus.AUTHORIZATION_FAIL);
        }

        Long userId = user.getUserId();

        try {

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
