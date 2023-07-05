package com.app.gobiser.global.config;

import com.app.gobiser.global.jwt.JwtAccessDeniedHandler;
import com.app.gobiser.global.jwt.JwtAuthenticationEntryPoint;
import com.app.gobiser.global.jwt.JwtSecurityConfig;
import com.app.gobiser.global.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final TokenProvider tokenProvider;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .httpBasic().disable() //  HTTP 기본 인증을 비활성화합니다. (HTTP Basic Authentication)
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                // 세션 관리를 설정하고, 세션 생성 정책을 "STATELESS"로 설정합니다. 이는 서버에 상태를 유지하지 않는 세션 관리 방식을 사용한다는 의미입니다.
                // 즉, 인증 후에도 클라이언트의 상태를 서버에 저장하지 않으며, 모든 요청은 독립적으로 처리됩니다.
                .and()
                .exceptionHandling()
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                // JWT(Json Web Token) 인증 진입점을 설정합니다.
                // 인증되지 않은 요청이 들어올 경우 해당 진입점을 통해 인증을 처리합니다.
                .accessDeniedHandler(jwtAccessDeniedHandler)
                //  JWT 접근 거부 핸들러를 설정합니다.
                //  인가되지 않은 사용자가 보호된 리소스에 접근할 경우 해당 핸들러를 통해 접근 거부 처리를 합니다.
                .and()
                .authorizeRequests()
                .antMatchers("/api/v1/auth/**").permitAll()
                .anyRequest().authenticated()
                .and()
                .apply(new JwtSecurityConfig(tokenProvider));

        return http.build();
    }
}
