package com.sg.reparos.service;

import com.notificationapi.NotificationApi;
import com.notificationapi.model.NotificationRequest;
import com.notificationapi.model.User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SmsService {

    private NotificationApi api = new NotificationApi(
            "9stslyf77vlsgkb34wvsiwhjdh",
            "8i9v8ixz5ciislter4cacvuwq88815t4im8whmx7xyskgfcv11c29109bv");

    // Armazena os códigos temporariamente na memória (pode ser Redis ou banco no
    // futuro)
    private Map<String, String> verificationCodes = new ConcurrentHashMap<>();

    public void sendVerificationCode(String phoneNumber) {
        String code = String.format("%06d", new Random().nextInt(999999));

        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setNumber(phoneNumber);

        Map<String, Object> mergeTags = new HashMap<>();
        mergeTags.put("comment", code);

        NotificationRequest request = new NotificationRequest("sms", user)
                .setMergeTags(mergeTags);

        try {
            api.send(request);
            verificationCodes.put(phoneNumber, code);
            System.out.println("Código enviado para " + phoneNumber + ": " + code);
        } catch (Exception e) {
            System.err.println("Erro ao enviar SMS: ");
            e.printStackTrace(); // <-- adicione isso
            throw new RuntimeException("Erro ao enviar SMS: " + e.getMessage());
        }

    }

    public boolean verifyCode(String phoneNumber, String code) {
        String validCode = verificationCodes.get(phoneNumber);
        if (validCode != null && validCode.equals(code)) {
            verificationCodes.remove(phoneNumber); // Remove após validar
            return true;
        }
        return false;
    }
}
