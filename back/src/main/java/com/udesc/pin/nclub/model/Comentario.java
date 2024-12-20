package com.udesc.pin.nclub.model;

import jakarta.persistence.*;

@Entity
public class Comentario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer codigo;

    private String mensagem;
    private int codigoProd;

    public int getCodigoProd() {
        return codigoProd;
    }

    public void setCodigoProd(int codigoProd) {
        this.codigoProd = codigoProd;
    }

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    public Integer getCodigo() {
        return codigo;
    }

    public void setCodigo(Integer codigo) {
        this.codigo = codigo;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
}
