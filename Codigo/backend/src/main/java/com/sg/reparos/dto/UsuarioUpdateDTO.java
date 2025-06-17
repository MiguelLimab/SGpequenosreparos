package com.sg.reparos.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import io.swagger.v3.oas.annotations.media.Schema;

public class UsuarioUpdateDTO {

    @NotBlank(message = "Nome é obrigatório")
    @Schema(description = "Nome do usuário", example = "Felipe Parreiras")
    private String nome;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Formato de email inválido")
    @Schema(description = "Email do usuário", example = "felipe@email.com")
    private String email;

    @NotBlank(message = "Telefone é obrigatório")
    @Schema(description = "Telefone do usuário", example = "31999998888")
    private String telefone;

    @NotBlank(message = "Username é obrigatório")
    @Size(min = 3, max = 20, message = "Username deve ter entre 3 e 20 caracteres")
    @Schema(description = "Nome de usuário (único)", example = "felipeparreiras")
    private String username;

    @Schema(description = "Nova senha do usuário (opcional)", example = "novaSenha123")
    private String senha;

    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getTelefone() {
        return telefone;
    }
    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getSenha() {
        return senha;
    }
    public void setSenha(String senha) {
        this.senha = senha;
    }

    
}
