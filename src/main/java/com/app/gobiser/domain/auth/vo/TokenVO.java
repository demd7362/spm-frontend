package com.app.gobiser.domain.auth.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TokenVO {
    private String grantType;
    private String accessToken;
    private String refreshToken;
    private Long tokenExpiresIn;
}
