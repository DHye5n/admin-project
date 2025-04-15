package dh.project.backend.config;

import dh.project.backend.filter.JwtAuthenticationFilter;
import dh.project.backend.filter.JwtExceptionFilter;
import dh.project.backend.handler.OAuth2SuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true)
@EnableWebSecurity
@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtExceptionFilter jwtExceptionFilter;
    private final DefaultOAuth2UserService oAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    @Bean
    protected SecurityFilterChain configure(HttpSecurity http) throws Exception {

        http
                .cors().and()
                .csrf().disable()
                .httpBasic().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .authorizeRequests(authorizeRequests ->
                        authorizeRequests
                                .antMatchers(
                                        "/", "/auth",
                                        "/api/v1/auth/**", "/api/v1/auth/oauth2/**",
                                        "/api/v1/auth/send-verification-code",
                                        "/api/v1/auth/resend-verification-code",
                                        "/api/v1/auth/verify-code",
                                        "/api/v1/auth/check-email",
                                        "/api/v1/auth/username/**/duplicates",
                                        "/api/v1/auth/username/**/exists",
                                        "/api/v1/file/**", "/api/v1/files/**", "/error"
                                ).permitAll()
                                .antMatchers(
                                        "/api/v1/users/**/**",
                                        "/api/v1/users/profile",
                                        "/api/v1/users/password",
                                        "/api/v1/boards/**/**",
                                        "/api/v1/comments/**/**",
                                        "/api/v1/searches/**/**",
                                        "/api/v1/messages/**/**"
                                ).authenticated()
                                .anyRequest().authenticated()
                )

        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
        .addFilterBefore(jwtExceptionFilter, jwtAuthenticationFilter.getClass())
                .formLogin(formLogin -> formLogin
                        .loginPage("/auth/sign-in")
                        .defaultSuccessUrl("/")
                        .permitAll()
                )
                .oauth2Login(oAuth2 -> oAuth2
                        .authorizationEndpoint(endpoints ->
                                endpoints.baseUri("/api/v1/auth/oauth2"))
                        .redirectionEndpoint(endpoint ->
                                endpoint.baseUri("/oauth2/callback/*"))
                        .userInfoEndpoint(endpoint -> endpoint.userService(oAuth2UserService))
                        .successHandler(oAuth2SuccessHandler)
                );

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

}
