package com.app.gobiser.domain.auth.vo;

import com.app.gobiser.domain.user.vo.UserVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TokenRequestVO {
    private String userName;
    private String userPassword;

    public UserVO toUser(PasswordEncoder passwordEncoder) {
        return UserVO.builder()
                .uiId(userName)
                .uiPwd(userPassword)
                .build();
    }

    public UsernamePasswordAuthenticationToken toAuthentication() {
        return new UsernamePasswordAuthenticationToken(userName, userPassword);
    }
}
