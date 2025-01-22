package dh.project.backend.controller;

import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.user.PatchUserRequestDto;
import dh.project.backend.dto.response.user.GetUserResponseDto;
import dh.project.backend.dto.response.user.PatchUserResponseDto;
import dh.project.backend.dto.response.user.SignInUserResponseDto;
import dh.project.backend.service.UserService;
import dh.project.backend.service.principal.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

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
    @GetMapping("/myPage")
    public ResponseEntity<ApiResponseDto<GetUserResponseDto>> getUser(@AuthenticationPrincipal PrincipalDetails user) {
        ApiResponseDto<GetUserResponseDto> responseDto = userService.getUser(user);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *
     *   TODO: 프로필 수정
     * */
    @PatchMapping("/profile/{email}")
    public ResponseEntity<ApiResponseDto<PatchUserResponseDto>> patchProfile(
            @Valid @RequestBody PatchUserRequestDto dto,
            @PathVariable("email") String email,
            @AuthenticationPrincipal PrincipalDetails user
            ) {
        ApiResponseDto<PatchUserResponseDto> responseDto = userService.patchProfile(dto, email, user);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

}
