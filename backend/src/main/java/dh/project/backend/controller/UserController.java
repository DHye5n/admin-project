package dh.project.backend.controller;

import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.response.user.GetUserResponseDto;
import dh.project.backend.dto.response.user.SignInUserResponseDto;
import dh.project.backend.service.principal.PrincipalDetails;
import dh.project.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
@RestController
public class UserController {

    private final UserService userService;

    /**
     *   TODO: 로그인 유저 정보
     * */
    @GetMapping
    public ResponseEntity<ApiResponseDto<SignInUserResponseDto>> getSignInUser(@AuthenticationPrincipal PrincipalDetails user) {
        ApiResponseDto<SignInUserResponseDto> responseDto = userService.getSignInUser(user);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 유저 정보
     * */
    @GetMapping("/{email}")
    public ResponseEntity<ApiResponseDto<GetUserResponseDto>> getUser(@PathVariable("email") String email) {
        ApiResponseDto<GetUserResponseDto> responseDto = userService.getUser(email);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

}
