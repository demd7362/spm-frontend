package com.app.gobiser.global.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan("com.app.gobiser.domain.*.vo")
public class DBConfig {
}
