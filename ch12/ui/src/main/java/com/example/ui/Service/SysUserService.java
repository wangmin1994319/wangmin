package com.example.ui.Service;

import com.example.common.domain.SysUser;
import com.example.common.dto.Message;
import com.example.common.dto.MessageType;
import com.example.ui.dao.SysUserRepository;
import com.google.common.collect.Maps;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;
import java.util.Random;

@Service
public class SysUserService {

    @Autowired
    private SysUserRepository sysUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * 随机获取自由数
     * @return
     */
    public ResponseEntity<Message> getCoductssIdRandom() {
        String conductssId = "WZD" + this.getRandomStringValue(120000,100000);
        Map map = Maps.newHashMap();
        map.put("conductssId",conductssId);
        Message message = new Message(MessageType.MSG_TYPE_SUCCESS,map);
        return  new ResponseEntity<Message>(message,HttpStatus.OK);
    }

    public String getRandomStringValue(int maxValue, int minValue) {
        Random random = new Random();
        return String.valueOf(random.nextInt(120000) + minValue);
    }


    /**
     * 用户注册
     * @param sysUser 用户
     * @return
     */
    public ResponseEntity<Message> register(SysUser sysUser) {
        sysUser.setCardId(sysUser.getCardId().toUpperCase());
        SysUser sysUserByCardId = sysUserRepository.findByCardId(sysUser.getCardId());
        SysUser sysUserByPNum = sysUserRepository.findByPhoneNum(sysUser.getPhoneNum());
        if (null != sysUserByCardId || null != sysUserByPNum)
            return new ResponseEntity<Message>(new Message(MessageType.MSG_TYPE_ERROR,"注册失败，账号已注册！"),HttpStatus.OK);
        sysUser.setPassword(passwordEncoder.encode(sysUser.getPassword()));
        sysUser.setUserName(sysUser.getRealName());
        sysUser.setCreateTime(new Date());
        sysUser = sysUserRepository.save(sysUser);
        Map map = Maps.newHashMap();
        map.put("realName",sysUser.getRealName());
        map.put("usrName",sysUser.getUserName());
        map.put("phoneNum",sysUser.getPhoneNum());
        map.put("cardId",sysUser.getCardId());
        map.put("sysUerId",sysUser.getId());
        return new ResponseEntity<Message>(new Message(MessageType.MSG_TYPE_SUCCESS,map),HttpStatus.OK);
    }
}
