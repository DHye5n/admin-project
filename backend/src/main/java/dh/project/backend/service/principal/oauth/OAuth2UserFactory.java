package dh.project.backend.service.principal.oauth;

import dh.project.backend.domain.OAuth2UserEntity;
import dh.project.backend.enums.Role;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Map;

public class OAuth2UserFactory {

    public static OAuth2UserEntity create(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        if ("kakao".equals(registrationId)) {
            return createKakaoUser(oAuth2User);
        } else if ("google".equals(registrationId)) {
            return createGoogleUser(oAuth2User);
        } else {
            throw new IllegalArgumentException("연동되지 않은 서비스입니다.");
        }
    }

    private static OAuth2UserEntity createKakaoUser(OAuth2User oAuth2User) {
        Map<String, Object> attributeMap = oAuth2User.getAttribute("kakao_account");

        Object idObj = oAuth2User.getAttribute("id");
        String providerId = (idObj instanceof Number) ? String.valueOf(((Number) idObj).longValue()) : String.valueOf(idObj);

        String username = "kakao_" + ((String) ((Map)attributeMap.get("profile")).get("nickname"));

        return OAuth2UserEntity.builder()
                .email((String) attributeMap.get("email"))
                .provider("kakao")
                .providerId(providerId)
                .username(username)
                .name((String) attributeMap.get("name"))
                .phoneNumber((String) attributeMap.get("phone_number"))
                .profileImage((String) ((Map)attributeMap.get("profile")).get("profile_image_url"))
                .role(Role.SOCIAL)
                .build();
    }

    private static OAuth2UserEntity createGoogleUser(OAuth2User oAuth2User) {
        Map<String, Object> attributeMap = oAuth2User.getAttributes();

        String username = "google_" + (String) attributeMap.get("given_name");

        return OAuth2UserEntity.builder()
                .email((String) attributeMap.get("email"))
                .provider("google")
                .providerId((String) attributeMap.get("sub"))
                .username(username)
                .name((String) attributeMap.get("name"))
                .profileImage((String) attributeMap.get("picture"))
                .role(Role.SOCIAL)
                .build();
    }
}
