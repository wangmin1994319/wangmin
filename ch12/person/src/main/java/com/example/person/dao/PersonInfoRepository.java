package com.example.person.dao;

import com.example.common.domain.PersonInfo;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * Created by WangMin on 2018/11/18
 */
public interface PersonInfoRepository extends MongoRepository<PersonInfo,String> {


    PersonInfo findByUserName(String userName);

    PersonInfo findByPhoneNum(String phoneNum);
}
