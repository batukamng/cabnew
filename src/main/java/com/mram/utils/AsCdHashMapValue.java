package com.mram.utils;

import java.util.HashMap;
import java.util.Map;

public class AsCdHashMapValue {
    Long id;
    Map<String, AsCdHashMapValue> children;

    public AsCdHashMapValue(Long id) {
        this.id = id;
        this.children = new HashMap<>();
    }

    public void setChildren(Map<String, AsCdHashMapValue> children) {
        this.children = children;
    }
}
