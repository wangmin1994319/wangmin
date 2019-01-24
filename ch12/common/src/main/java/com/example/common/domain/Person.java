package com.example.common.domain;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

/**
 * Created by WangMin on 2018/10/20.
 */
@Entity
@Data
public class Person {

    @Id
    @GeneratedValue
    private Long id;

    private  String name;

    private String address;

    private  String age;

}
