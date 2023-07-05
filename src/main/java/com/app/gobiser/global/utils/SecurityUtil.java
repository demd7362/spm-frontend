package com.app.gobiser.global.utils;

import com.app.gobiser.domain.auth.PrincipalDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtil {
    public String getUsername(){
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        PrincipalDetails principalDetail = (PrincipalDetails) principal;
        return principalDetail.getUsername();
    }
    public String getPassword(){
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserDetails userDetails = (UserDetails) principal;
        return userDetails.getPassword();
    }
}
