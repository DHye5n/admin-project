package dh.project.backend.controller;

import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.auth.*;
import dh.project.backend.dto.response.auth.SignInResponseDto;
import dh.project.backend.dto.response.auth.SignUpResponseDto;
import dh.project.backend.dto.response.auth.UserCheckResponseDto;
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
    public ResponseEntity<ApiResponseDto<UserCheckResponseDto>> checkEmailExists (@RequestParam String email) {
        ApiResponseDto<UserCheckResponseDto> responseDto = authService.checkEmailExists(email);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 아이디 중복 체크
     * */
    @GetMapping("/username/{username}/duplicates")
    public ResponseEntity<ApiResponseDto<UserCheckResponseDto>> duplicateUsernameCheck (@PathVariable String username) {
        ApiResponseDto<UserCheckResponseDto> responseDto = authService.duplicateUsernameCheck(username);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 아이디 존재 여부 체크
     * */
    @GetMapping("/username/{username}/exists")
    public ResponseEntity<ApiResponseDto<UserCheckResponseDto>> existUsernameCheck (@PathVariable String username) {
        ApiResponseDto<UserCheckResponseDto> responseDto = authService.existUsernameCheck(username);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 비밀번호 찾기(email, username, 인증코드) 검증
     * */
    @PostMapping("/find-password")
    public ResponseEntity<ApiResponseDto<Boolean>> findPassword(@RequestBody FindPasswordRequestDto dto) {
        ApiResponseDto<Boolean> responseDto = authService.findPassword(dto);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 아이디 찾기(email, 인증코드) 검증
     * */
    @PostMapping("/find-username")
    public ResponseEntity<ApiResponseDto<Boolean>> findUsername(@RequestBody FindUsernameRequestDto dto) {
        ApiResponseDto<Boolean> responseDto = authService.findUsername(dto);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

}
