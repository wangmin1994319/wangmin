package com.example.common.domain;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.Id;
import java.util.Collection;
import java.util.Date;
import java.util.LinkedHashSet;

/**
 * Created by WangMin on 2018/11/18
 */
@Document
@Data
public class PersonInfo {
    @Id
    private String id;

    private String age;

    private String emgPerson;

    private String emgContact;

    private String nation;

    private String sex;

    private String cardId;

    private String realName;

    private String userName;

    private String phoneNum;

    private String sysUserId;

    @Field("locs")
    private Collection<Location> locations = new LinkedHashSet<Location>();

    public PersonInfo() {
        super();
    }


}
