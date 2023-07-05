package com.app.gobiser.domain.user.vo;

import com.app.gobiser.domain.common.vo.CommonVO;
import lombok.*;

@Getter
@ToString
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserVO extends CommonVO {
    private long uiNum; // bigintunsigned
    private String uiId;
    private String uiName; // varchar(16)
    private String uiRole; // varchar(8)
    private String uiBirth; // char(8)
    private String uiPwd; // varchar(100)
    private String uiPwdModdat; // char(8)
    private int uiPwdFailCnt; // int
    private String uiZip; // char(5)
    private String uiAddr; // varchar(100)
    private String uiAddrDtl; // varchar(200)
    private String uiPhone; // varchar(20)
    private String uiLastLoginDat; // char(8)
    private String uiRegiType; // char(2) 01 일반 로그인 02 네이버 로그인 03 카카오 로그인
}
