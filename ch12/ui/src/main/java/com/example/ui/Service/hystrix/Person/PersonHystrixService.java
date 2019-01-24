package com.example.ui.Service.hystrix.Person;

import com.example.common.dto.Message;
import com.example.common.dto.MessageType;
import com.example.common.dto.SysUserMessage;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

/**
 * Created by WangMin on 2018/11/18
 */
@Service
public class PersonHystrixService {

    @Autowired
    private PersonService personService;


    @HystrixCommand(fallbackMethod = "fallbackSave")
    public ResponseEntity<Message> save(SysUserMessage sysUserMessage) {
        return  personService.save(sysUserMessage);
    }

    public ResponseEntity<Message> fallbackSave(SysUserMessage sysUserMessage) {
        Message message = new Message(MessageType.MSG_TYPE_ERROR,"服务调用超时");
        return new ResponseEntity<Message>(message, HttpStatus.REQUEST_TIMEOUT);
    }

    @HystrixCommand(fallbackMethod = "fallbackQuery")
    public ResponseEntity<Message> query(String userName) {
        return personService.query(userName);
    }

    public ResponseEntity<Message> fallbackQuery(String userName) {
        Message message = new Message(MessageType.MSG_TYPE_ERROR,"服务调用超时");
        return new ResponseEntity<Message>(message,HttpStatus.REQUEST_TIMEOUT);
    }
}
