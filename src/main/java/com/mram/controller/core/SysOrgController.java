package com.mram.controller.core;
import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.core.*;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.repository.core.*;
import org.json.JSONException;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/organization")
public class SysOrgController  extends GenericController<Organization> {

    public SysOrgController(OrgRepository repository, OrgRepository orgRepository, MainDao dao) {
        super(repository);
        this.orgRepository = orgRepository;
        this.dao = dao;
    }
    final OrgRepository orgRepository;
    private final MainDao dao;


    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("view.OrganizationView",request);
    }


    @PostMapping("/save")
    public @ResponseBody
    Organization save(@RequestBody Organization request) throws JSONException, ClassNotFoundException {
        Organization org = orgRepository.save(request);
        return org;
    }

}
