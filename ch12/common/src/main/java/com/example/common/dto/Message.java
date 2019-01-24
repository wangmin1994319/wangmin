package com.example.common.dto;

import lombok.Data;


/**
 * Created by WangMin on 2018/10/20.
 */
@Data
public class Message<T> {

    private String status;

    private String error;

    private T data;

    public Message(String status) {
        this.status = status;
        this.error = "";
        this.data = null;
    }

    public Message(String status,String error) {
        this.status = status;
        this.error = error;
        this.data = null;
    }

    public Message(String status,String error,T data) {
        this.status = status;
        this.error = error;
        this.data = data;
    }

    public Message(String status,T data) {
        this.status = status;
        this.data = data;
    }

    public Message() {
        super();
    }
}
