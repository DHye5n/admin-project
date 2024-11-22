package dh.project.backend.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import dh.project.backend.dto.ApiResponseDto;
import dh.project.backend.enums.ResponseStatus;
import io.jsonwebtoken.JwtException;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtExceptionFilter extends OncePerRequestFilter {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            filterChain.doFilter(request, response);
        } catch (JwtException e) {

            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setCharacterEncoding("UTF-8");

            ApiResponseDto<Void> errorResponse = ApiResponseDto.failure(ResponseStatus.JWT_ERROR);

            String responseJson = objectMapper.writeValueAsString(errorResponse);
            response.getWriter().write(responseJson);
        }

    }

}
