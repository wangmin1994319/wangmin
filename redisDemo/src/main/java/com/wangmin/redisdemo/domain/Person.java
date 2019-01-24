package com.wangmin.redisdemo.domain;

import lombok.Data;

import java.io.Serializable;

@Data
public class Person implements Serializable {

    private static final long serialVersionUID=1L;

    private String id;

    private  String name;

    private String age;

    public Person() {
        super();
    }

    public Person(String id,String name,String age) {
        super();
        this.id = id;
        this.name = name;
        this.age = age;
    }

}
