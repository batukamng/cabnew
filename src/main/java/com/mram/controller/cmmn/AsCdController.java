/*
package com.mram.controller.cmmn;

import com.mram.base.controller.GenericController;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.cmmn.AsCd;
import com.mram.model.core.LutModule;
import com.mram.repository.cmmn.AsCdRepository;
import com.mram.repository.core.ModuleRepository;
import com.mram.service.core.Services;
import com.mram.utils.Tools;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/nms/as/code")
public class AsCdController extends GenericController<AsCd> {
    public AsCdController(AsCdRepository repository) {
        super(repository);
    }

    @Autowired
    private MainDao dao;

    @Autowired
    private AsCdRepository repository;

    @Autowired
    private Services services;

    @PostMapping("/submit")
    public AsCd submit(@RequestBody AsCd item) {
        return repository.save(item);
    }


    // -------------------List by page -------------------------------------------
    @PostMapping("/list")
    public @ResponseBody
    DataSourceResult getList(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
    */
/*
        DataSourceRequest.FilterDescriptor filter = new DataSourceRequest.FilterDescriptor();

        if(request.getCustom().getFilters() != null){
            for(int i = 0; i < request.getCustom().getFilters().size(); i++)
                services.addFilter(filter, request.getCustom().getFilters().get(i).getField(), request.getCustom().getFilters().get(i).getOperator(), request.getCustom().getFilters().get(i).getValue(), 1L);
        }

        if(request.getFilter().getFilters() != null){
            for(int i = 0; i < request.getFilter().getFilters().size(); i++)
                services.addFilter(filter, request.getFilter().getFilters().get(i).getField(), request.getFilter().getFilters().get(i).getOperator(), request.getFilter().getFilters().get(i).getValue(), 1L);
        }
    *//*


//        request.setFilter(Tools.getFilter(request, services));
        return dao.getList("cmmn.AsCd",request);
    }

    @PostMapping("/list-sorted")
    public @ResponseBody
    DataSourceResult getListSorted(@RequestBody DataSourceRequest request) throws JSONException, ClassNotFoundException {
        return dao.getList("view.AsCdSortedView",request);
    }
}
*/
