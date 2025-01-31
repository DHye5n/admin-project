package dh.project.backend.service;

import dh.project.backend.domain.FollowEntity;
import dh.project.backend.domain.UserEntity;
import dh.project.backend.domain.UserListViewEntity;
import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.dto.object.UserListItem;
import dh.project.backend.dto.request.user.PatchUserRequestDto;
import dh.project.backend.dto.response.user.*;
import dh.project.backend.enums.ResponseStatus;
import dh.project.backend.exception.ErrorException;
import dh.project.backend.repository.FollowRepository;
import dh.project.backend.repository.UserListViewRepository;
import dh.project.backend.repository.UserRepository;
import dh.project.backend.service.principal.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;

    private final UserListViewRepository userListViewRepository;
    private final FollowRepository followRepository;

    /**
     *   TODO: 로그인 유저 정보
     * */
    public ApiResponseDto<SignInUserResponseDto> getSignInUser(PrincipalDetails user) {

        if (user == null) {
            throw new ErrorException(ResponseStatus.AUTHORIZATION_FAIL);
        }

        SignInUserResponseDto responseDto = SignInUserResponseDto.fromEntity(user.getUser());

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    };

    /**
     *   TODO: 유저 정보
     * */
    public ApiResponseDto<GetUserResponseDto> getUser(PrincipalDetails user, Long userId) {

        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_USER));

        boolean isFollowing = followRepository.findFollowedUser(user.getUserId(), userId);

        GetUserResponseDto responseDto = GetUserResponseDto.fromEntity(userEntity, isFollowing);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    };


    /**
     *   TODO: 프로필 수정
     * */
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public ApiResponseDto<PatchUserResponseDto> patchProfile(PatchUserRequestDto dto, Long userId, PrincipalDetails user) {

        if (user == null) {
            throw new ErrorException(ResponseStatus.AUTHORIZATION_FAIL);
        }

        if (!user.getUserId().equals(userId)) {
            throw new ErrorException(ResponseStatus.NO_PERMISSION);
        }

        try {

            UserEntity userEntity = userRepository.findById(userId)
                    .orElseThrow(() -> new ErrorException(ResponseStatus.NOT_FOUND_USER));

            if (dto.getUsername() != null && !dto.getUsername().isEmpty()
                    && !dto.getUsername().equals(userEntity.getUsername())) {
                if (userRepository.existsByUsername(dto.getUsername())) {
                    throw new ErrorException(ResponseStatus.DUPLICATE_USERNAME);
                }
                userEntity.updateUsername(dto.getUsername());
            }

            if (dto.getProfileImage() != null) {
                userEntity.updateProfileImage(dto.getProfileImage());
            }

            userRepository.save(userEntity);

            PatchUserResponseDto responseDto = PatchUserResponseDto.fromEntity(userEntity);

            return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ErrorException(ResponseStatus.DATABASE_ERROR);
        }
    };

    /**
     *   TODO: 유저 리스트
     * */
    @Transactional(readOnly = true)
    public ApiResponseDto<GetAllUserListResponseDto> getAllUserList() {

        List<UserListViewEntity> allUserList = userListViewRepository.findAllUsers();

        List<UserListItem> userListItems = UserListItem.fromEntityList(allUserList);

        GetAllUserListResponseDto responseDto = new GetAllUserListResponseDto(userListItems);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    };

    /**
     *   TODO: 팔로잉 리스트
     * */
    @Transactional(readOnly = true)
    public ApiResponseDto<GetFollowingListResponseDto> getFollowingList(Long userId) {

        // 내가 팔로우한 사람 리스트
        List<FollowEntity> followingEntities = followRepository.findFollowingsByUserId(userId);

        GetFollowingListResponseDto responseDto = GetFollowingListResponseDto.fromEntity(followingEntities);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    };

    /**
     *   TODO: 유저 팔로우
     * */
    @Transactional
    public ApiResponseDto<PutFollowResponseDto> toggleFollow(PrincipalDetails user, Long userId) {

        if (user == null) {
            throw new ErrorException(ResponseStatus.AUTHORIZATION_FAIL);
        }

        Optional<UserEntity> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new ErrorException(ResponseStatus.NOT_FOUND_USER);
        }
        UserEntity userEntity = userOptional.get();


        Optional<FollowEntity> followEntity = followRepository.findByFollower_UserIdAndFollowing_UserId(user.getUserId(), userId);
        boolean isFollowing = followEntity.isPresent();

        if (followEntity.isPresent()) {
            // 기존 팔로우 삭제
            followRepository.delete(followEntity.get());

            // 팔로워 수 감소 (팔로우 받는 사람의 팔로워 수 감소)
            if (userEntity.getFollowersCount() > 0) {
                followRepository.decreaseFollowerCount(userId);  // 팔로워 수 감소
            }

            // 팔로잉 수 감소 (팔로우 하는 사람의 팔로잉 수 감소)
            if (user.getUser().getFollowingsCount() > 0) {
                followRepository.decreaseFollowingCount(user.getUserId());  // 팔로잉 수 감소
            }

            isFollowing = false;
        } else {
            // 새로운 팔로우 생성
            FollowEntity newFollow = FollowEntity.builder()
                    .follower(user.getUser())  // 팔로우 하는 사람 (유저)
                    .following(userEntity)  // 팔로우 받는 사람 (상대)
                    .build();
            followRepository.save(newFollow);

            // 팔로잉 수 증가 (팔로우 하는 사람의 팔로잉 수 증가)
            followRepository.increaseFollowingCount(user.getUserId());  // 팔로잉 수 증가

            // 팔로워 수 증가 (팔로우 받는 사람의 팔로워 수 증가)
            followRepository.increaseFollowerCount(userId);  // 팔로워 수 증가

            isFollowing = true;
        }

        PutFollowResponseDto responseDto = PutFollowResponseDto.fromEntity(userEntity, isFollowing);

        return ApiResponseDto.success(ResponseStatus.SUCCESS, responseDto);
    };
}
