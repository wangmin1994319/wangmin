package com.example.ui.controller;

import com.example.common.dto.Message;
import com.example.common.dto.SysUserMessage;
import com.example.ui.Service.hystrix.Person.PersonHystrixService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

/**
 * Created by WangMin on 2018/11/18
 */
@RestController
@RequestMapping("/personInfo")
public class PersonController {

    @Autowired
    private PersonHystrixService personHystrixService;


    @RequestMapping(value = "/save",method = RequestMethod.POST)
    public ResponseEntity<Message> save(@RequestBody SysUserMessage sysUserMessage) {
        return personHystrixService.save(sysUserMessage);
    }

    @RequestMapping(value = "/query/{userName}",method = RequestMethod.GET)
    public ResponseEntity<Message> query(@PathVariable String userName) {
        return personHystrixService.query(userName);
    }


}
