package com.example.person.service;

import com.example.common.domain.Location;
import com.example.common.domain.PersonInfo;
import com.example.common.dto.Message;
import com.example.common.dto.MessageType;
import com.example.common.dto.SysUserMessage;
import com.example.person.dao.PersonInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;

/**
 * Created by WangMin on 2018/11/18
 */
@Service
public class PersonInfoService {

    @Autowired
    private PersonInfoRepository personInfoRepository;

    public ResponseEntity<Message> save(SysUserMessage sysUserMessage) {
        PersonInfo personInfo = new PersonInfo();
        Collection<Location> locations = new LinkedHashSet<Location>();
        Location location = new Location(sysUserMessage.getAddr(),sysUserMessage.getAge());
        locations.add(location);
        personInfo.setLocations(locations);
        personInfo.setAge(sysUserMessage.getAge());
        personInfo.setCardId(sysUserMessage.getCardId());
        personInfo.setEmgContact(sysUserMessage.getEmgContact());
        personInfo.setEmgPerson(sysUserMessage.getEmgPerson());
        personInfo.setNation(sysUserMessage.getNation());
        personInfo.setUserName(sysUserMessage.getUserName());
        personInfo.setSex(sysUserMessage.getSex());
        personInfo.setSysUserId(sysUserMessage.getSysUserId());
        personInfoRepository.save(personInfo);
        Message message = new Message(MessageType.MSG_TYPE_SUCCESS);
        return new ResponseEntity<Message>(message,HttpStatus.OK);
    }

    public Message query(String userName) {
        PersonInfo personInfo = personInfoRepository.findByUserName(userName);
        Message message = new Message(MessageType.MSG_TYPE_SUCCESS,personInfo);
        return message;
    }
}
