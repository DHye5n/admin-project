package dh.project.backend.service.auth;

import dh.project.backend.domain.UserEntity;
import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.auth.SignInRequestDto;
import dh.project.backend.dto.request.auth.SignUpRequestDto;
import dh.project.backend.dto.response.auth.DuplicateCheckResponseDto;
import dh.project.backend.dto.response.auth.SignInResponseDto;
import dh.project.backend.dto.response.auth.SignUpResponseDto;
import dh.project.backend.enums.ResponseStatus;
import dh.project.backend.exception.ErrorException;
import dh.project.backend.repository.UserRepository;
import dh.project.backend.service.JwtService;
import dh.project.backend.service.principal.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /**
     *   TODO: 회원가입
     * */
    @Transactional
    public ApiResponseDto<SignUpResponseDto> signUp(SignUpRequestDto dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            return ApiResponseDto.failure(ResponseStatus.DUPLICATE_EMAIL);
        }

        if (userRepository.existsByUsername(dto.getUsername())) {
            return ApiResponseDto.failure(ResponseStatus.DUPLICATE_USERNAME);
        }

//        if (userRepository.existsByPhone(dto.getPhone())) {
//            return ApiResponseDto.failure(ResponseStatus.DUPLICATE_PHONE);
//        }

        if (!dto.isPasswordMatching()) {
            return ApiResponseDto.failure(ResponseStatus.PASSWORD_MISMATCH);
        }

        String encodedPassword = passwordEncoder.encode(dto.getPassword());

        UserEntity user = dto.toEntity(encodedPassword);

        userRepository.save(user);

        SignUpResponseDto responseDto = SignUpResponseDto.fromEntity(user);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }

    /**
     *   TODO: 로그인
     * */
    public ApiResponseDto<SignInResponseDto> signIn(SignInRequestDto dto) {

        UserEntity user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new ErrorException(ResponseStatus.SIGN_IN_FAIL));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new ErrorException(ResponseStatus.SIGN_IN_FAIL);
        }

        PrincipalDetails principalDetails = new PrincipalDetails(user);

        SignInResponseDto responseDto = jwtService.generateAccessToken(principalDetails);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }

    /**
     *   TODO: 이메일 중복 체크
     * */
    public ApiResponseDto<DuplicateCheckResponseDto> checkEmailExists(String email) {

        boolean exists = userRepository.existsByEmail(email);
        DuplicateCheckResponseDto responseDto = new DuplicateCheckResponseDto(exists);
        ResponseStatus status = exists ? ResponseStatus.DUPLICATE_EMAIL : ResponseStatus.SUCCESS;
        return ApiResponseDto.success(status, responseDto);
    }

    /**
     *   TODO: 아이디 중복 체크
     * */
    public ApiResponseDto<DuplicateCheckResponseDto> checkUsernameExists(String username) {

        boolean exists = userRepository.existsByUsername(username);

        DuplicateCheckResponseDto responseDto = new DuplicateCheckResponseDto(exists);
        ResponseStatus status = exists ? ResponseStatus.DUPLICATE_USERNAME : ResponseStatus.SUCCESS;
        return ApiResponseDto.success(status, responseDto);
    }

}
