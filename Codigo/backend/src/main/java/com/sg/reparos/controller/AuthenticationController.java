package com.sg.reparos.controller;

import com.sg.reparos.model.AuthRequest;
import com.sg.reparos.security.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // Permitir frontend acessar cookies
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public void login(@RequestBody AuthRequest authRequest, HttpServletResponse response) {
        try {
            UsernamePasswordAuthenticationToken authInputToken = new UsernamePasswordAuthenticationToken(
                    authRequest.getUsername(),
                    authRequest.getSenha());

            authenticationManager.authenticate(authInputToken);

            String token = jwtUtil.generateToken(authRequest.getUsername());

            Cookie cookie = new Cookie("token", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(false); // Em produção true
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60); // 1 hora
            cookie.setAttribute("SameSite", "Lax"); // <-- adiciona isso

            response.addCookie(cookie);
            response.setStatus(HttpServletResponse.SC_OK);

        } catch (AuthenticationException e) {
            throw new RuntimeException("Usuário ou senha inválidos");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(false) // Em produção, deixe true para HTTPS
                .path("/")
                .maxAge(0) // Faz o cookie expirar imediatamente
                .sameSite("Lax") // Proteção básica contra CSRF
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.noContent().build();
    }
}
