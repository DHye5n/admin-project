package dh.project.backend.controller;

import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.auth.EmailCodeRequestDto;
import dh.project.backend.dto.request.auth.SignInRequestDto;
import dh.project.backend.dto.request.auth.SignUpRequestDto;
import dh.project.backend.dto.response.auth.DuplicateCheckResponseDto;
import dh.project.backend.dto.response.auth.SignInResponseDto;
import dh.project.backend.dto.response.auth.SignUpResponseDto;
import dh.project.backend.service.auth.AuthService;
import dh.project.backend.service.auth.EmailCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
@RestController
public class AuthController {

    private final AuthService authService;
    private final EmailCodeService emailCodeService;

    /**
     *   TODO: 회원가입
     * */
    @PostMapping("/sign-up")
    public ResponseEntity<ApiResponseDto<SignUpResponseDto>> signUp(@Valid @RequestBody SignUpRequestDto dto) {
        ApiResponseDto<SignUpResponseDto> responseDto = authService.signUp(dto);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 로그인
     * */
    @PostMapping("/sign-in")
    public ResponseEntity<ApiResponseDto<SignInResponseDto>> signIn(@Valid @RequestBody SignInRequestDto dto) {
        ApiResponseDto<SignInResponseDto> responseDto = authService.signIn(dto);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 인증 코드 발송
     * */
    @PostMapping("/send-verification-code")
    public ResponseEntity<ApiResponseDto<String>> sendVerificationCode(@RequestParam String email) {
        ApiResponseDto<String> responseDto = emailCodeService.sendVerificationCode(email);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 인증 코드 재발송
     * */
    @PostMapping("/resend-verification-code")
    public ResponseEntity<ApiResponseDto<String>> resendVerificationCode(@RequestParam String email) {
        ApiResponseDto<String> responseDto = emailCodeService.resendVerificationCode(email);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 인증 코드 검증
     * */
    @PostMapping("/verify-code")
    public ResponseEntity<ApiResponseDto<Boolean>> verifyCode(@RequestBody EmailCodeRequestDto dto) {
        ApiResponseDto<Boolean> responseDto = emailCodeService.verifyCode(dto);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 이메일 중복 체크
     * */
    @GetMapping("/check-email")
    public ResponseEntity<ApiResponseDto<DuplicateCheckResponseDto>> checkEmailExists (@RequestParam String email) {
        ApiResponseDto<DuplicateCheckResponseDto> responseDto = authService.checkEmailExists(email);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 아이디 중복 체크
     * */
    @GetMapping("/username/{username}/exists")
    public ResponseEntity<ApiResponseDto<DuplicateCheckResponseDto>> checkUsernameExists (@PathVariable String username) {
        ApiResponseDto<DuplicateCheckResponseDto> responseDto = authService.checkUsernameExists(username);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }
}
