package com.campusconnect.demo.config;

import com.campusconnect.demo.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();

        System.out.println("======================================");
        System.out.println("JWT FILTER");
        System.out.println("Request: " + request.getMethod() + " " + path);

        String header = request.getHeader("Authorization");

        System.out.println("Authorization Header Present: "
                + (header != null));

        if (header != null && header.startsWith("Bearer ")) {

            String token = header.substring(7);

            try {

                System.out.println("JWT token received");

                boolean valid = jwtService.isValid(token);

                System.out.println("JWT Valid: " + valid);

                if (valid) {

                    String email = jwtService.extractEmail(token);
                    String role = jwtService.extractRole(token);
                    System.out.println("JWT Email: " + email);
                    System.out.println("JWT Role: " + role);
                    if (role != null) {
                        role = role.trim().toUpperCase();
                        String authority;
                        if (role.startsWith("ROLE_")) {
                            authority = role;
                        } else {
                            authority = "ROLE_" + role;
                        }
                        System.out.println(
                                "Spring Security Authority: "
                                        + authority
                        );
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        email,
                                        null,
                                        List.of(
                                                new SimpleGrantedAuthority(
                                                        authority
                                                )
                                        )
                                );
                        SecurityContextHolder
                                .getContext()
                                .setAuthentication(authentication);
                        System.out.println(
                                "Authentication SET successfully"
                        );
                        System.out.println(
                                "Authenticated: "
                                        + SecurityContextHolder
                                        .getContext()
                                        .getAuthentication()
                                        .isAuthenticated()
                        );
                    }
                } else {
                    System.out.println("JWT IS INVALID");
                }
            } catch (Exception e) {
                System.out.println("JWT ERROR:");
                e.printStackTrace();
                SecurityContextHolder.clearContext();
            }
        } else {

            System.out.println(
                    "NO BEARER TOKEN FOUND"
            );
        }
        System.out.println("======================================");
        filterChain.doFilter(request, response);
    }
}