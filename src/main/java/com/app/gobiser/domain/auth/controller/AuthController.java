package com.app.gobiser.domain.auth.controller;

import com.app.gobiser.domain.auth.service.AuthService;
import com.app.gobiser.domain.auth.vo.TokenRequestVO;
import com.app.gobiser.domain.auth.vo.TokenVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;


    @PostMapping("/signin")
    public ResponseEntity<TokenVO> signIn(@RequestBody TokenRequestVO tokenRequest){
        return ResponseEntity.ok(authService.signInRequest(tokenRequest));
    }

}
