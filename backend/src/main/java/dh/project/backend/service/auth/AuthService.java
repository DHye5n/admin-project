package dh.project.backend.service.auth;

import dh.project.backend.domain.UserEntity;
import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.auth.*;
import dh.project.backend.dto.response.auth.UserCheckResponseDto;
import dh.project.backend.dto.response.auth.SignInResponseDto;
import dh.project.backend.dto.response.auth.SignUpResponseDto;
import dh.project.backend.enums.ResponseStatus;
import dh.project.backend.exception.ErrorException;
import dh.project.backend.repository.UserRepository;
import dh.project.backend.service.JwtService;
import dh.project.backend.service.principal.user.PrincipalDetails;
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
    private final EmailCodeService emailCodeService;
    private final EmailService emailService;

    /**
     *   TODO: 회원가입
     * */
    @Transactional
    public ApiResponseDto<SignUpResponseDto> signUp(SignUpRequestDto dto) {

        validateSignUp(dto);

        String encodedPassword = passwordEncoder.encode(dto.getPassword());

        UserEntity user = dto.toEntity(encodedPassword);

        UserEntity saveUser = userRepository.save(user);

        SignUpResponseDto responseDto = SignUpResponseDto.fromEntity(saveUser);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }

    /**
     *   TODO: 로그인
     * */
    public ApiResponseDto<SignInResponseDto> signIn(SignInRequestDto dto) {

        UserEntity user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_USER));

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
    public ApiResponseDto<UserCheckResponseDto> checkEmailExists(String email) {

        boolean exists = userRepository.existsByEmail(email);
        UserCheckResponseDto responseDto = new UserCheckResponseDto(exists);
        ResponseStatus status = exists ? ResponseStatus.DUPLICATE_EMAIL : ResponseStatus.SUCCESS;
        return ApiResponseDto.success(status, responseDto);
    }

    /**
     *   TODO: 아이디 중복 체크
     * */
    public ApiResponseDto<UserCheckResponseDto> duplicateUsernameCheck(String username) {

        boolean exists = userRepository.existsByUsername(username);

        UserCheckResponseDto responseDto = new UserCheckResponseDto(exists);
        ResponseStatus status = exists ? ResponseStatus.DUPLICATE_USERNAME : ResponseStatus.SUCCESS;
        return ApiResponseDto.success(status, responseDto);
    }

    /**
     *   TODO: 아이디 존재 여부 체크
     * */
    public ApiResponseDto<UserCheckResponseDto> existUsernameCheck(String username) {

        boolean exists = userRepository.existsByUsername(username);

        UserCheckResponseDto responseDto = new UserCheckResponseDto(exists);
        ResponseStatus status = exists ? ResponseStatus.SUCCESS : ResponseStatus.NOT_EXISTED_USER;
        return ApiResponseDto.success(status, responseDto);
    }

    /**
     *   TODO: 비밀번호 찾기(email, username, 인증코드) 검증
     * */
    @Transactional
    public ApiResponseDto<Boolean> findPassword(FindPasswordRequestDto dto) {

        // 1. 이메일 인증 코드 검증
        EmailCodeRequestDto emailCodeRequestDto = EmailCodeRequestDto.builder()
                .email(dto.getEmail())
                .verificationCode(dto.getVerificationCode())
                .build();

        emailCodeService.verifyCode(emailCodeRequestDto);

        // 2. 이메일과 사용자 이름이 일치하는 사용자 정보 확인
        UserEntity userEntity = userRepository.findByEmailAndUsername(dto.getEmail(), dto.getUsername())
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_USER));

        // 3. 임시 비밀번호 생성 및 암호화 후 저장
        String temporaryPassword = emailCodeService.generateTemporaryPassword();
        String encodedPassword = passwordEncoder.encode(temporaryPassword);
        userEntity.patchPassword(encodedPassword);

        userRepository.save(userEntity);

        // 4. 임시 비밀번호 이메일 전송
        emailService.sendTemporaryPassword(userEntity.getEmail(), temporaryPassword);

        // 5. 성공 응답 반환
        return ApiResponseDto.success(true);
    }

    /**
     *   TODO: 아이디 찾기(email, 인증코드) 검증
     * */
    @Transactional
    public ApiResponseDto<Boolean> findUsername(FindUsernameRequestDto dto) {

        // 1. 이메일 인증 코드 검증
        EmailCodeRequestDto emailCodeRequestDto = EmailCodeRequestDto.builder()
                .email(dto.getEmail())
                .verificationCode(dto.getVerificationCode())
                .build();

        emailCodeService.verifyCode(emailCodeRequestDto);

        // 2. 이메일을 기반으로 등록된 사용자 조회
        UserEntity userEntity = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_USER));

        // 3. 이메일로 아이디 전송
        emailService.sendUsername(userEntity.getEmail(), userEntity.getUsername());

        // 4. 성공 응답 반환
        return ApiResponseDto.success(true);
    }

    /**
     *   TODO: 회원가입 유효성 검사
     * */
    private void validateSignUp(SignUpRequestDto dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new ErrorException(ResponseStatus.DUPLICATE_EMAIL);
        }
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new ErrorException(ResponseStatus.DUPLICATE_USERNAME);
        }

        if (!dto.isPasswordMatching()) {
            throw new ErrorException(ResponseStatus.PASSWORD_MISMATCH);
        }
    }

    /**
     *   TODO: 유저 권한 체크
     * */
    public void checkUserAuthorization(Long userId, Long currentId) {

        if (!userId.equals(currentId)) {
            throw new ErrorException(ResponseStatus.AUTHORIZATION_FAIL);
        }
    }

}
