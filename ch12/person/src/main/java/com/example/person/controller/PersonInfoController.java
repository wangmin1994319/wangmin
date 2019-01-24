package com.example.person.controller;

import com.example.common.dto.Message;
import com.example.common.dto.SysUserMessage;
import com.example.person.service.PersonInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Created by WangMin on 2018/11/18
 */
@RestController
@RequestMapping("/personInfo")
public class PersonInfoController {

    @Autowired
    private PersonInfoService PersonInfoService;

    @RequestMapping(value = "/save",method = RequestMethod.POST)
    public ResponseEntity<Message> save(@RequestBody SysUserMessage sysUserMessage) {
        return PersonInfoService.save(sysUserMessage);
    }

    @RequestMapping(value = "/query/{userName}",method = RequestMethod.GET)
    public Message query(@PathVariable String userName) {
        return PersonInfoService.query(userName);
    }


}
