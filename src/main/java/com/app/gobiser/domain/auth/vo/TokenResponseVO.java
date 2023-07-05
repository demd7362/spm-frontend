package com.app.gobiser.domain.auth.vo;

import com.app.gobiser.domain.user.vo.UserVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TokenResponseVO { // 미사용
    private String userId;
    private String userName;

    public static TokenResponseVO of(UserVO user) {
        return TokenResponseVO.builder()
                .userId(user.getUiId())
                .userName(user.getUiName())
                .build();
    }
}
