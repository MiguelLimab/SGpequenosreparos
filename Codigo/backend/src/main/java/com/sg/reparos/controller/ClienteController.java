package com.sg.reparos.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cliente")
public class ClienteController {

    @GetMapping("/perfil")
    public String perfilCliente() {
        return "Acesso permitido: Perfil do CLIENTE.";
    }
}
