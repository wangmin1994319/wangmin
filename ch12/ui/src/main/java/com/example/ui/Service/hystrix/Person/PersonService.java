package com.example.ui.Service.hystrix.Person;

import com.example.common.dto.Message;
import com.example.common.dto.SysUserMessage;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Created by WangMin on 2018/11/18
 */
@FeignClient("person")
public interface PersonService {

    @RequestMapping(method = RequestMethod.POST,value = "/personInfo/save",consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Message> save(@RequestBody SysUserMessage sysUserMessage);

    @RequestMapping(method = RequestMethod.GET,value = "/personInfo/query/{userName}",consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    ResponseEntity<Message> query(@PathVariable("userName") String userName);

}
