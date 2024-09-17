package com.mram.controller.cab;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.cab.*;
import com.mram.repository.cab.CabCriteriaRepository;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cab/criteria")
public class CriteriaController extends GenericController<CabCriteria> {
    public CriteriaController(CabCriteriaRepository repository, MainDao dao) {
        super(repository);
        this.dao = dao;
        this.repository = repository;
    }

    private final MainDao dao;
    private final CabCriteriaRepository repository;


    @PostMapping("/submit")
    public ResponseEntity<?> submit(@RequestBody String jsonStr) {
        JSONObject obj=new JSONObject(jsonStr);
        JSONArray arr=obj.getJSONArray("models");
        for(int i=0;i<arr.length();i++){
            CabCriteria item=new CabCriteria();
            item.setTitle(arr.getJSONObject(i).getString("title"));
            repository.save(item);
        }

        return ResponseEntity.ok().build();
    }

    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("cab.CabCriteria", request);
    }

}
