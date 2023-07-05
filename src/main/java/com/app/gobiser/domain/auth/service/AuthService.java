package com.app.gobiser.domain.auth.service;

import com.app.gobiser.domain.auth.vo.TokenRequestVO;
import com.app.gobiser.domain.auth.vo.TokenVO;
import com.app.gobiser.domain.user.vo.UserVO;
import com.app.gobiser.domain.auth.PrincipalDetails;
import com.app.gobiser.global.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService implements UserDetailsService {
//    private final UserInfoMapper userInfoMapper;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final AuthenticationManagerBuilder managerBuilder;
    private final TokenProvider tokenProvider;

    @Override
    public UserDetails loadUserByUsername(String username) {
        return new PrincipalDetails(UserVO.builder()
                .uiId(username)
                .uiPwd(bCryptPasswordEncoder.encode("testPassword")) // TODO DB 세팅 후 수정 필요
                .build());
    }

    public TokenVO signInRequest(TokenRequestVO tokenRequest) {
        UsernamePasswordAuthenticationToken authenticationToken = tokenRequest.toAuthentication();
        Authentication authentication = managerBuilder.getObject().authenticate(authenticationToken);
        return tokenProvider.generateTokenVO(authentication);
    }
}
