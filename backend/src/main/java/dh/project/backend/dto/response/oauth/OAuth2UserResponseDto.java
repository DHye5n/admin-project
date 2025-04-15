//package dh.project.backend.dto.response.oauth;
//
//import dh.project.backend.domain.OAuth2UserEntity;
//import lombok.Builder;
//import lombok.Getter;
//
//@Getter
//public class OAuth2UserResponseDto {
//
//    private final String email;
//    private final String username;
//    private final String name;
//    private final String phoneNumber;
//    private final String profileImage;
//
//    @Builder
//    public OAuth2UserResponseDto(String email, String username, String name, String phoneNumber, String profileImage) {
//        this.email = email;
//        this.username = username;
//        this.name = name;
//        this.phoneNumber = phoneNumber != null ? phoneNumber : "";
//        this.profileImage = profileImage != null ? profileImage : "";
//    }
//
//    public static OAuth2UserResponseDto fromEntity(OAuth2UserEntity user) {
//        return OAuth2UserResponseDto.builder()
//                .email(user.getEmail())
//                .username(user.getUsername())
//                .name(user.getName())
//                .phoneNumber(user.getPhoneNumber() != null ? user.getPhoneNumber() : "")
//                .profileImage(user.getProfileImage() != null ? user.getProfileImage() : "")
//                .build();
//    }
//}
