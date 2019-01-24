package com.example.common.utils.consts;


/**
 * Created by WangMin on 2018/10/20.
 */

public enum GlobalConsts {
    PHONE_NUM_LINE(11);
    final Integer value;
    GlobalConsts(int value) {
        this.value = value;
    }
    public Integer value() {
        return value;
    }
}
