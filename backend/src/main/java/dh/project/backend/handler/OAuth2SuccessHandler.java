//package dh.project.backend.handler;
//
//import dh.project.backend.service.JwtService;
//import dh.project.backend.service.principal.oauth.OAuth2UserDetails;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
//import org.springframework.stereotype.Component;
//
//import javax.servlet.ServletException;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//import java.io.IOException;
//
//@RequiredArgsConstructor
//@Component
//public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
//
//    private final JwtService jwtService;
//
//    @Override
//    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
//
//        OAuth2UserDetails oAuth2User = (OAuth2UserDetails) authentication.getPrincipal();
//
//        String tokenInfo = jwtService.generateAccessTokenForOAuth2(oAuth2User);
//
//
//        // 문자열 파싱
//        String[] parts = tokenInfo.split(":");
//        String accessToken = parts[0];
//        String expirationTime = parts[1];
//
//        // 리다이렉트
//        String redirectUrl = "http://localhost:3000/auth/oauth-response/" + accessToken + "/" + expirationTime;
//        response.sendRedirect(redirectUrl);
//    }
//}
