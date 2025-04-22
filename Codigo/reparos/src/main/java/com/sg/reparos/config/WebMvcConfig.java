package com.sg.reparos.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/login").setViewName("login");
        registry.addViewController("/register").setViewName("register");
        registry.addViewController("/home").setViewName("home");
        registry.addViewController("/logout").setViewName("login");
        registry.addViewController("/service").setViewName("service");
        registry.addViewController("/profile").setViewName("profile");
        registry.addViewController("/admin").setViewName("admin");
        registry.addViewController("/admin/service").setViewName("admin/service");
    }
}