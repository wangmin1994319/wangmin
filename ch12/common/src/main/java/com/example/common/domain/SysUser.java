package com.example.common.domain;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.util.Date;

/**
 * Created by WangMin on 2018/10/20.
 */
@Entity
@Data
@Table(name="sysuser")
public class SysUser  {
    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    @Pattern(regexp = "(\\d{15}$)|(^\\d{18}$)|(^\\d{17}(\\d|X|x)$)")
    private String cardId;

    private String phoneNum;

    @Pattern(regexp = "[^\\u4e00-\\u9fa5]")
    private  String userName;


    @NotNull
    private String password;

    @NotNull
    @Pattern(regexp = "[\\u4E00-\\u9FA5][\\u4E00-\\u9FA5·]{0,}$")
    private String realName;

    @Column(unique = true)
    private String cardChipId;

    @Column(updatable = true)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createTime;

    public SysUser(){}

    public SysUser(String realName,String cardId,String password){
        this.realName = realName;
        this.cardId = cardId;
        this.password = password;
    }
}
