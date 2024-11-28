package dh.project.backend.service;

import dh.project.backend.domain.UserEntity;
import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.auth.SignInRequestDto;
import dh.project.backend.dto.request.auth.SignUpRequestDto;
import dh.project.backend.dto.response.auth.SignInResponseDto;
import dh.project.backend.enums.ResponseStatus;
import dh.project.backend.exception.ErrorException;
import dh.project.backend.repository.UserRepository;
import dh.project.backend.service.auth.PrincipalDetails;
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

    @Transactional
    public ApiResponseDto<String> signUp(SignUpRequestDto dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            return ApiResponseDto.failure(ResponseStatus.DUPLICATE_EMAIL);
        }

        if (userRepository.existsByUsername(dto.getUsername())) {
            return ApiResponseDto.failure(ResponseStatus.DUPLICATE_USERNAME);
        }

        if (!dto.isPasswordMatching()) {
            return ApiResponseDto.failure(ResponseStatus.PASSWORD_MISMATCH);
        }

        String encodedPassword = passwordEncoder.encode(dto.getPassword());

        UserEntity user = dto.toEntity(encodedPassword);

        userRepository.save(user);

        return ApiResponseDto.success(ResponseStatus.SUCCESS);
    }

    public ApiResponseDto<SignInResponseDto> signIn(SignInRequestDto dto) {

        UserEntity user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new ErrorException(ResponseStatus.SIGN_IN_FAIL, "Login information mismatch."));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new ErrorException(ResponseStatus.SIGN_IN_FAIL, "Login information mismatch.");
        }

        PrincipalDetails principalDetails = new PrincipalDetails(user);

        SignInResponseDto responseDto = jwtService.generateAccessToken(principalDetails);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    }
}
