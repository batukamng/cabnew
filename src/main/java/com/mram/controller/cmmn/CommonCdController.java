package com.mram.controller.cmmn;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.cmmn.CommonCd;
import com.mram.repository.cmmn.CommonCdRepository;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/nms/common")
public class CommonCdController extends GenericController<CommonCd> {
    public CommonCdController(CommonCdRepository repository) {
        super(repository);
    }

    @Autowired
    private MainDao dao;

    @Autowired
    private CommonCdRepository repository;

    @PostMapping("/submit")
    public CommonCd submit(@RequestBody CommonCd item) {
        return repository.save(item);
    }

    @GetMapping("/grp/{grpCd}")
    public List<CommonCd> getListByGroup(@PathVariable String grpCd) {
        return repository.getByGrpCd(grpCd);
    }

    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("cmmn.CommonCd",request);
    }

/*    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody String jsonStr) throws JsonProcessingException, ClassNotFoundException {
        JSONObject obj=new JSONObject(jsonStr);
        DataSourceRequest request = new ObjectMapper().readValue(jsonStr, DataSourceRequest.class);
        if(!obj.has("filter") || obj.isNull("filter")){
            DataSourceRequest.FilterDescriptor filter=new DataSourceRequest.FilterDescriptor();
            DataSourceRequest.FilterDescriptor filterDescriptor=new DataSourceRequest.FilterDescriptor();
            filterDescriptor.setField("parentId");
            filterDescriptor.setOperator("isNull");
            filterDescriptor.setValue("true");
            filter.setLogic("and");
            filter.getFilters().add(filterDescriptor);
            request.setFilter(filter);
        }

        return dao.getList("cmmn.CommonCd", request);
    }*/
}
