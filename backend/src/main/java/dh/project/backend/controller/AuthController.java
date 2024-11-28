package dh.project.backend.controller;

import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.auth.SignInRequestDto;
import dh.project.backend.dto.request.auth.SignUpRequestDto;
import dh.project.backend.dto.response.auth.SignInResponseDto;
import dh.project.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
@RestController
public class AuthController {

    private final AuthService authService;

    @PostMapping("/sign-up")
    public ResponseEntity<ApiResponseDto<String>> signUp(@Valid @RequestBody SignUpRequestDto dto) {
        ApiResponseDto<String> responseDto = authService.signUp(dto);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    @PostMapping("/sign-in")
    public ResponseEntity<ApiResponseDto<SignInResponseDto>> signIn(@Valid @RequestBody SignInRequestDto dto) {
        ApiResponseDto<SignInResponseDto> responseDto = authService.signIn(dto);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }
}
