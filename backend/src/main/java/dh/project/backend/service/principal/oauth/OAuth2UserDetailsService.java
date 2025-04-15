package dh.project.backend.service.principal.oauth;

import dh.project.backend.domain.OAuth2UserEntity;
import dh.project.backend.repository.OAuth2UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class OAuth2UserDetailsService extends DefaultOAuth2UserService {

    private final OAuth2UserRepository oAuth2UserRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(request);
        String provider = request.getClientRegistration().getRegistrationId();
        String email = (String) oAuth2User.getAttribute("email");


        Optional<OAuth2UserEntity> existingUser = oAuth2UserRepository.findByEmailAndProvider(email, provider);

        // 이미 존재하는 사용자면 로그인 처리 (새 객체를 생성하지 않음)
        if (existingUser.isPresent()) {
            OAuth2UserEntity user = existingUser.get();
        }

        // 신규 사용자면 회원가입 처리
        OAuth2UserEntity newUser = OAuth2UserFactory.create(request, oAuth2User);
        OAuth2UserEntity savedUser = oAuth2UserRepository.save(newUser);

        return new OAuth2UserDetails(savedUser, oAuth2User.getAttributes());
    }
}
