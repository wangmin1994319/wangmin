package com.wangmin.controller;

import com.wangmin.common.SysUser;
import com.wangmin.dao.SysUserRepository;
import com.wangmin.dto.Message;
import com.wangmin.dto.MessageType;
import com.wangmin.service.SysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.security.Principal;

@RestController
@RequestMapping("/sysUsers")
public class SysUserController {




    @Autowired
    private SysUserRepository sysUserRepository;


    @Autowired
    private SysUserService sysUserService;


    /**
     * 获取用户信息
     * @param principal
     * @return
     */
    @PreAuthorize("isAuthenticated()")
    @RequestMapping("/user")
    public ResponseEntity<Message> user(Principal principal) {
        SysUser user = sysUserRepository.findById(Long.parseLong(principal.getName())).orElse(null);
        Message message = new Message(MessageType.MSG_TYPE_SUCCESS,user);
        return new ResponseEntity<Message>(message, HttpStatus.OK);
    }


    /**
     * 获取随机数
     * @return
     */
    @RequestMapping(value = "/conductssId/random",method = RequestMethod.GET)
    public ResponseEntity<Message> getConductssId() {
        return this.sysUserService.getCoductssIdRandom();
    }

    /**
     * 用户注册
     * @param sysUser
     * @return
     */
    @RequestMapping(value = "/register",method = RequestMethod.POST)
    public ResponseEntity<Message> register(@RequestBody SysUser sysUser) {
        return sysUserService.register(sysUser);
    }

    /**
     * 验证手机号码
     * @param phoneNum
     * @return
     */
    @RequestMapping(value = "/verifyPhoneNum")
    public ResponseEntity<Message> verifyPhoneNum(String phoneNum) {
        SysUser sysUser = this.sysUserRepository.findByPhoneNum(phoneNum);
        Message message = (null == sysUser) == true ? new Message(MessageType.MSG_TYPE_ERROR,"手机号已经被注册！") : new Message(MessageType.MSG_TYPE_SUCCESS);
        return new ResponseEntity<Message>(message, HttpStatus.OK);
    }








}
