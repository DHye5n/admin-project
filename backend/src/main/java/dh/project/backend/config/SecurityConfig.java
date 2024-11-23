package dh.project.backend.config;

import dh.project.backend.enums.Role;
import dh.project.backend.filter.JwtAuthenticationFilter;
import dh.project.backend.filter.JwtExceptionFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@RequiredArgsConstructor
@EnableWebSecurity
@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtExceptionFilter jwtExceptionFilter;

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
                                        "/", "/api/auth/**",
                                        "/api/auth/send-verification-code",
                                        "/api/auth/resend-verification-code",
                                        "/api/auth/verify-code",
                                        "/api/auth/check-email",
                                        "/api/auth/username/**/exists"
                                ).permitAll()
                                .antMatchers(
                                        "/api/admin/users/**"
                                )
                                .hasRole(Role.ADMIN.name())
                                .anyRequest().authenticated()
                )

        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
        .addFilterBefore(jwtExceptionFilter, jwtAuthenticationFilter.getClass())
                .formLogin(formLogin ->
                        formLogin
                                .loginPage("/auth/sign-in")
                                .permitAll()
                );

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

}
