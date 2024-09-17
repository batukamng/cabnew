package com.mram.controller.cmmn;

import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/nms/resource")
public class ResourceController{

    private final MainDao dao;

    public ResourceController(MainDao dao) {
        this.dao = dao;
    }

    @GetMapping("/{type}/list")
    public ResponseEntity<?> getListByType(@PathVariable String type) {
        String modelName= defineClass(type);
        if(modelName.contains(".")){
            String[] arr=modelName.split("\\.");
            modelName=arr[arr.length-1];
        }
        return ResponseEntity.ok().body(dao.getHQLResult("from "+modelName,"list"));
    }

    @PostMapping("/{type}/list")
    public @ResponseBody DataSourceResult getViewList(@PathVariable String type, @RequestBody DataSourceRequest request) throws ClassNotFoundException {
        String modelName= defineClass(type);
        return dao.getList(modelName,request);
    }

    private String defineClass(@PathVariable String type) {
        String modelName="AprTransView";
        switch (type){
            case "app":
                modelName="AppInfoView";
                break;
            case "levelConfig":
                modelName="core.LevelConfig";
                break;
            case "commonCode":
                modelName="cmmn.CommonCd";
                break;
            case "organization":
                modelName="core.Organization";
                break;
            case "governor":
                modelName="adt.Governor";
                break;
            case "central":
                modelName="view.adt.CentralGovernorView";
                break;
            case "userLevel":
                modelName="core.UserLevel";
                break;
            case "role":
                modelName="core.Role";
                break;
            case "province":
                modelName="cmmn.AsCd";
                break;
        }
        return modelName;
    }
}
