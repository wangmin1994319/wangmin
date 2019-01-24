package com.example.ui.config;

import com.example.common.dto.Message;
import com.example.common.dto.MessageType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.PrintWriter;
import java.io.StringWriter;

@ControllerAdvice
public class ExceptionHandlerAdvice {

    @ResponseBody
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<Message> handleMethodException(MethodArgumentNotValidException ex) {
        StringWriter errors = new StringWriter();
        ex.printStackTrace(new PrintWriter(errors));
        Message message = new Message(MessageType.MSG_TYPE_ERROR,"数据格式校验错误！");
        return new ResponseEntity<Message>(message,HttpStatus.NOT_FOUND);
    }

}
