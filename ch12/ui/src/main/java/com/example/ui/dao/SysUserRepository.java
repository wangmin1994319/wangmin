package com.example.ui.dao;

import com.example.common.domain.SysUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SysUserRepository extends JpaRepository<SysUser, Long> {

    SysUser findByCardId(String cardId);

    SysUser findByPhoneNum(String phoneNum);

    SysUser findByUserName(String userName);

}
