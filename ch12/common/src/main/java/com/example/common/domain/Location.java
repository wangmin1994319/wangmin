package com.example.common.domain;

import lombok.Data;

/**
 * Created by WangMin on 2018/11/18
 */
@Data
public class Location {

    private String place;

    private String year;

    public Location(String place,String year) {
        super();
        this.place = place;
        this.year = year;
    }
}
