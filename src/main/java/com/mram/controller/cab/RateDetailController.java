
package com.mram.controller.cab;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.cab.CabRateDetail;
import com.mram.repository.cab.CabRateDetailRepository;
import org.json.JSONException;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cab/rate/detail")
public class RateDetailController extends GenericController<CabRateDetail> {
    public RateDetailController(CabRateDetailRepository repository, MainDao dao) {
        super(repository);
        this.dao = dao;
    }

    private final MainDao dao;


    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("cab.CabRateDetail", request);
    }

}
