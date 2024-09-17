package com.mram.controller.cab;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.cab.CabPlanUserRate;
import com.mram.repository.cab.CabPlanUserRateRepository;
import org.json.JSONException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cab/plan/user/rate")
public class PlanUserRateController extends GenericController<CabPlanUserRate> {
    public PlanUserRateController(CabPlanUserRateRepository repository, MainDao dao) {
        super(repository);
        this.dao = dao;
        this.repository = repository;
    }

    private final MainDao dao;
    private final CabPlanUserRateRepository repository;

    @PostMapping("/submit")
    public ResponseEntity<?> location(@RequestBody CabPlanUserRate item) {
        if (repository.existsSeason(item.getPlanId(), item.getSeason()).isEmpty()) {
            repository.save(item);
        }
        return ResponseEntity.status(409).build();
    }

    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("cab.CabPlanCriteria", request);
    }

}
