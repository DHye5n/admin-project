package dh.project.backend.controller;

import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.user.SignUpRequestDto;
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
}
