//package dh.project.backend.service.principal.oauth;
//
//import dh.project.backend.domain.OAuth2UserEntity;
//import lombok.Getter;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.oauth2.core.user.OAuth2User;
//
//import java.util.Collection;
//import java.util.List;
//import java.util.Map;
//
//@Getter
//@RequiredArgsConstructor
//public class OAuth2UserDetails implements OAuth2User, UserDetails {
//
//    private final OAuth2UserEntity oAuth2User;
//    private final Map<String, Object> attributeMap;
//
//    public String getEmail() {
//        return this.oAuth2User.getEmail();
//    }
//
//    public String getProviderId() {
//        return this.oAuth2User.getProviderId();
//    }
//
//    @Override
//    public Map<String, Object> getAttributes() {
//        return this.attributeMap;
//    }
//
//    @Override
//    public Collection<? extends GrantedAuthority> getAuthorities() {
//        return List.of(() -> "ROLE_" + this.oAuth2User.getRole());
//    }
//
//    @Override
//    public String getPassword() {
//        return null;
//    }
//
//    @Override
//    public String getUsername() {
//        return this.oAuth2User.getUsername();
//    }
//
//    @Override
//    public boolean isAccountNonExpired() {
//        return true;
//    }
//
//    @Override
//    public boolean isAccountNonLocked() {
//        return true;
//    }
//
//    @Override
//    public boolean isCredentialsNonExpired() {
//        return true;
//    }
//
//    @Override
//    public boolean isEnabled() {
//        return true;
//    }
//
//    @Override
//    public String getName() {
//        return this.oAuth2User.getUsername();
//    }
//}
