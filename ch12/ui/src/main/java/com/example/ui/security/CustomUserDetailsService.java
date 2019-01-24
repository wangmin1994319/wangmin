package com.example.ui.security;

import com.example.common.domain.SysUser;
import com.example.common.utils.consts.GlobalConsts;
import com.example.ui.dao.SysUserRepository;
import com.google.common.collect.Sets;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Set;

public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private SysUserRepository sysUserRepository;

    @Override
    public UserDetails loadUserByUsername(String userName) {
        SysUser sysUser = null;
        Set<GrantedAuthority> autSet = Sets.newHashSet();
       if (!StringUtils.isNumeric(userName.charAt(0) + "")) {
           sysUser = sysUserRepository.findByUserName(userName);
       } else {
           if (userName.length()>GlobalConsts.PHONE_NUM_LINE.value()) {
               sysUser = sysUserRepository.findByCardId(userName);
           }else {
               sysUser = sysUserRepository.findByPhoneNum(userName);
           }
       }
       if (sysUser == null) {
           throw  new UsernameNotFoundException("系统中用户名不存在。");
       }
       return new User(sysUser.getId().toString(),sysUser.getPassword(),autSet);
    }
}
