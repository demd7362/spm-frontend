package com.app.gobiser.domain.auth;

import com.app.gobiser.domain.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomAuthenticationProvider implements AuthenticationProvider {
    private final AuthService authService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public Authentication authenticate(Authentication authentication) {
        String username = authentication.getName();
        String password = authentication.getCredentials().toString();
        PrincipalDetails principal = (PrincipalDetails) authService.loadUserByUsername(username);
        if(principal != null){
            String dbPassword = principal.getPassword();
            if(!bCryptPasswordEncoder.matches(password,dbPassword)){
                throw new BadCredentialsException("Password does not match");
            }
//        if(!authConfig.bCryptPasswordEncoder().matches(dbPassword,password)) {
//            throw new BadCredentialsException("Not Found User");
//        }
            return new UsernamePasswordAuthenticationToken(principal, null, authentication.getAuthorities());
        }
        return null;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}
