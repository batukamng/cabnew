package com.mram.service;

import com.mram.dao.MainDao;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import org.springframework.cache.annotation.Cacheable;

import java.util.ArrayList;
import java.util.List;

@Service
public class CachingService {


    private final MainDao dao;

    public CachingService(MainDao dao) {
        this.dao = dao;
    }

    @Cacheable(value = "resources", key="#type" )
    public ResponseEntity<?> getCommonList(String type) {
        //JSONArray array=new JSONArray();
        List<?> array=new ArrayList<>();
        switch (type) {
            case "main-sector":
                array= (List<?>) dao.getHQLResult("from SectorView t where t.useYn=1 and t.parentId is null","list");
                break;
            case "sub-sector":
                array= (List<?>) dao.getHQLResult("from SectorView t where t.useYn=1 and t.parentId is not null","list");
                break;
            case "inv-category":
                array= (List<?>) dao.getHQLResult("from InvCatSecView t where t.useYn=1","list");
                break;
            default:
                break;
        }
        return ResponseEntity.ok().body(array);
    }

    @Caching(evict = { @CacheEvict(value="resources", key="#type") })
    public ResponseEntity<?> cacheEvict(String type) {
        return ResponseEntity.ok().build();
    }
}
