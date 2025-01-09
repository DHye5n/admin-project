package dh.project.backend.controller;

import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.user.PatchUserRequestDto;
import dh.project.backend.dto.response.user.GetUserResponseDto;
import dh.project.backend.dto.response.user.PatchUserResponseDto;
import dh.project.backend.dto.response.user.SignInUserResponseDto;
import dh.project.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<ApiResponseDto<SignInUserResponseDto>> getSignInUser() {
        ApiResponseDto<SignInUserResponseDto> responseDto = userService.getSignInUser();
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

    /**
     *   TODO: 프로필 수정
     * */
    @PatchMapping("/profile/{userId}")
    public ResponseEntity<ApiResponseDto<PatchUserResponseDto>> patchProfile(
            @Valid @RequestBody PatchUserRequestDto dto,
            @PathVariable("userId") Long userId
    ) {
        ApiResponseDto<PatchUserResponseDto> responseDto = userService.patchProfile(dto, userId);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }
}
