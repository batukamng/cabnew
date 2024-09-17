package com.mram.controller.cab;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.cab.*;
import com.mram.repository.cab.*;
import org.json.JSONException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cab/plan/config")
public class PlanConfigController extends GenericController<CabPlanConfig> {
    public PlanConfigController(CabPlanConfigRepository repository, MainDao dao) {
        super(repository);
        this.dao = dao;
        this.repository = repository;
    }

    private final MainDao dao;
    private final CabPlanConfigRepository repository;


    @PostMapping("/submit")
    public ResponseEntity<?> submit(@RequestBody CabPlanConfig item) {
        if(repository.existsByPlanYr(item.getPlanYr()).isPresent()){
            return ResponseEntity.status(409).build();
        }
        repository.save(item);
        return ResponseEntity.ok().body(item);
    }
    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("cab.CabPlanConfig", request);
    }

}
