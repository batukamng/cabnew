package com.mram.controller.cab;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.cab.CabAttitude;
import com.mram.repository.cab.CabAttitudeRepository;
import org.json.JSONException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cab/attitude")
public class AttitudeController extends GenericController<CabAttitude> {
    public AttitudeController(CabAttitudeRepository repository, MainDao dao) {
        super(repository);
        this.dao = dao;
        this.repository = repository;
    }

    private final MainDao dao;
    private final CabAttitudeRepository repository;

    @PostMapping("/submit")
    public ResponseEntity<?> submit(@RequestBody CabAttitude item) {
        if(item.getId()!=null){
            repository.save(item);
            return ResponseEntity.ok().body(item);
        }
        else if(repository.existItem(item.getUserId(),item.getPlanYr()).isEmpty()){
            repository.save(item);
            return ResponseEntity.ok().body(item);
        }
        return ResponseEntity.status(409).build();
    }

    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody DataSourceResult getList(@RequestBody DataSourceRequest request)
            throws JSONException, ClassNotFoundException {
        return dao.getList("view.cab.CabAttitudeView", request);
    }

}
