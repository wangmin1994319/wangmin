package com.wangmin.redisdemo.web;

import com.wangmin.redisdemo.dao.PersonDao;
import com.wangmin.redisdemo.domain.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DataController {

    @Autowired
    PersonDao personDao;


    @RequestMapping("/set")
    public void set() {
        Person person = new Person("wm","wangmin","24");
        personDao.save(person);
        personDao.setStringRedisTemplateDemo();
    }

    @RequestMapping("/getStr")
    public String getStr() {
        return personDao.getString();
    }

    @RequestMapping("/getPerson")
    public Person getPerson() {
        return personDao.getPerson();
    }
}
