package com.sg.reparos.controller;

import com.sg.reparos.service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notificacao")
@CrossOrigin(origins = "*")
public class SmsController {

    @Autowired
    private SmsService smsService;

    @PostMapping("/send-sms")
    public String sendSms(@RequestParam String telefone) {
        smsService.sendVerificationCode(telefone);
        return "Código enviado para " + telefone;
    }

    @PostMapping("/verify-sms")
    public boolean verifySms(@RequestParam String telefone, @RequestParam String code) {
        return smsService.verifyCode(telefone, code);
    }
}
