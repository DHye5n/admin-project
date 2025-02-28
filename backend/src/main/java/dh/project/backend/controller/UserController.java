package dh.project.backend.controller;

import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.request.user.PatchPasswordRequestDto;
import dh.project.backend.dto.request.user.PatchUserRequestDto;
import dh.project.backend.dto.response.user.*;
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
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponseDto<GetUserResponseDto>> getUser(
            @AuthenticationPrincipal PrincipalDetails user,
            @PathVariable("userId") Long userId) {
        ApiResponseDto<GetUserResponseDto> responseDto = userService.getUser(user, userId);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *
     *   TODO: 프로필 수정
     * */
    @PatchMapping("/profile/{userId}")
    public ResponseEntity<ApiResponseDto<PatchUserResponseDto>> patchProfile(
            @Valid @RequestBody PatchUserRequestDto dto,
            @PathVariable("userId") Long userId,
            @AuthenticationPrincipal PrincipalDetails user
            ) {
        ApiResponseDto<PatchUserResponseDto> responseDto = userService.patchProfile(dto, userId, user);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 유저 리스트
     * */
    @GetMapping("/list")
    public ResponseEntity<ApiResponseDto<GetAllUserListResponseDto>> getAllUserList() {
        ApiResponseDto<GetAllUserListResponseDto> responseDto = userService.getAllUserList();
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 팔로잉 리스트
     * */
    @GetMapping("/followings/{userId}")
    public ResponseEntity<ApiResponseDto<GetFollowingListResponseDto>> getFollowingList(@PathVariable("userId") Long userId) {
        ApiResponseDto<GetFollowingListResponseDto> responseDto = userService.getFollowingList(userId);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 팔로워 리스트
     */
    @GetMapping("/followers/{userId}")
    public ResponseEntity<ApiResponseDto<GetFollowerListResponseDto>> getFollowerList(@PathVariable("userId") Long userId) {
        ApiResponseDto<GetFollowerListResponseDto> responseDto = userService.getFollowerList(userId);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 유저 팔로우
     * */
    @PutMapping("/follows/{userId}")
    public ResponseEntity<ApiResponseDto<PutFollowResponseDto>> toggleFollow(
            @AuthenticationPrincipal PrincipalDetails user,
            @PathVariable("userId") Long userId
    ) {
        ApiResponseDto<PutFollowResponseDto> responseDto = userService.toggleFollow(user, userId);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

    /**
     *   TODO: 비밀번호 변경
     * */
    @PatchMapping("/password")
    public ResponseEntity<ApiResponseDto<PatchPasswordResponseDto>> patchPassword(
            @Valid @RequestBody PatchPasswordRequestDto dto,
            @AuthenticationPrincipal PrincipalDetails user
    ) {
        ApiResponseDto<PatchPasswordResponseDto> responseDto = userService.patchPassword(dto, user);
        return ResponseEntity.status(responseDto.getStatus()).body(responseDto);
    }

}
