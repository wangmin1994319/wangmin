package com.wangmin.redisdemo.dao;

import com.wangmin.redisdemo.domain.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;

@Repository
public class PersonDao {
    @Autowired
    StringRedisTemplate stringRedisTemplate;

    @Resource(name = "stringRedisTemplate")
    ValueOperations<String,String> valOpsStr;

    @Autowired
    RedisTemplate<Object,Object> redisTemplate;

    @Resource(name = "redisTemplate")
    ValueOperations<Object,Object> valOps;

    public void setStringRedisTemplateDemo() {
        valOpsStr.set("xx","yy");
    }

    public void save(com.wangmin.redisdemo.domain.Person person) {
        valOps.set(person.getId(),person);
    }
    public String getString() {
        return valOpsStr.get("xx");
    }

    public Person getPerson() {
        return (Person) valOps.get("wm");
    }
}
