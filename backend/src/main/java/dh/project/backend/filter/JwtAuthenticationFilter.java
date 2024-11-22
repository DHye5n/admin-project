package dh.project.backend.filter;

import dh.project.backend.service.JwtService;
import dh.project.backend.service.auth.PrincipalDetailsService;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final PrincipalDetailsService principalDetailsService;
//    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {



        String accessToken = resolveToken(request);
        SecurityContext securityContext = SecurityContextHolder.getContext();


        if (accessToken != null && securityContext.getAuthentication() == null) {
            try {

                String username = jwtService.getUsername(accessToken);

                if (username == null) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                    return;
                }


                UserDetails userDetails = principalDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());


                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                securityContext.setAuthentication(authenticationToken);
                SecurityContextHolder.setContext(securityContext);
            } catch (ExpiredJwtException e) {
                log.error("Token has expired: {}", e.getMessage());
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token has expired");
                return;
            } catch (Exception e) {
                // General JWT exception handling
                log.error("Invalid token: {}", e.getMessage());
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }



    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

//    private void sendErrorResponse(HttpServletResponse response, ApiResponseException exception) throws IOException {
//        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
//        response.setStatus(exception.getStatus().value());
//        response.setCharacterEncoding("UTF-8");
//
//        ApiResponseDto<?> errorResponse = ApiResponseDto.failure(exception);
//
//        String responseJson = objectMapper.writeValueAsString(errorResponse);
//        response.getWriter().write(responseJson);
//    }
}
