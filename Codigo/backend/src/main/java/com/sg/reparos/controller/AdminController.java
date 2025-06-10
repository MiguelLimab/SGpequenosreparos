package com.sg.reparos.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/dados")
    public String dadosAdmin() {
        return "Acesso permitido: Informações restritas para ADMIN.";
    }
}
