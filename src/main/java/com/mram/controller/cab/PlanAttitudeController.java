package com.mram.controller.cab;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.cab.CabPlanAttitude;
import com.mram.repository.cab.CabPlanAttitudeRepository;
import org.json.JSONException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cab/plan/attitude")
public class PlanAttitudeController extends GenericController<CabPlanAttitude> {
    public PlanAttitudeController(CabPlanAttitudeRepository repository, MainDao dao) {
        super(repository);
        this.dao = dao;
        this.repository = repository;
    }

    private final MainDao dao;
    private final CabPlanAttitudeRepository repository;

    @PostMapping("/submit")
    public ResponseEntity<?> submit(@RequestBody CabPlanAttitude item) {
        if(item.getId()!=null){
            repository.save(item);
            return ResponseEntity.ok().body(item);
        }
        else if(repository.existItem(item.getUserId(),item.getTypeStr(),item.getPlanId(),item.getTypeScr()).isEmpty()){
            repository.save(item);
            return ResponseEntity.ok().body(item);
        }
        return ResponseEntity.status(409).build();
    }

    @PostMapping("/community/submit")
    public ResponseEntity<?> communitySubmit(@RequestBody CabPlanAttitude item) {
        if(repository.existCommunityItem(item.getUserId(),item.getTypeStr(),item.getPlanId(),item.getTypeScr(),item.getEvalUserId()).isEmpty()){
            repository.save(item);
            return ResponseEntity.ok().body(item);
        }
        return ResponseEntity.status(409).build();
    }

    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody DataSourceResult getList(@RequestBody DataSourceRequest request)
            throws JSONException, ClassNotFoundException {
        return dao.getList("view.cab.CabPlanAttitudeView", request);
    }

}
