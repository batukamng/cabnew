package com.mram.service.core;

import com.mram.config.security.UserPrincipal;
import com.mram.dao.MainDao;
import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;
import com.mram.model.core.*;
import com.mram.repository.cmmn.AsCdRepository;
import com.mram.repository.core.MenuRepository;
import com.mram.repository.core.UserLevelRepository;
import com.mram.service.ActivityLogService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class Services {

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private UserLevelRepository userLevelRepository;

    @Autowired
    AsCdRepository asCdRepository;

    @Autowired
    ActivityLogService logService;


    // @Cacheable(value = "userMenu", key = "#name")
    public List<Menu> getUserMenu(String name, List<Long> ids) {
        System.out.println("loading...");
        return menuRepository.getUserMenu(name, ids);
    }

    public DataSourceRequest.FilterDescriptor getFilterByPrincipal(DataSourceRequest request,
            Authentication authentication, String source) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        UserLevel lutUserLevel = userLevelRepository.getOneById(userPrincipal.getLvlId());

        DataSourceRequest.FilterDescriptor filter = new DataSourceRequest.FilterDescriptor();


        try {
            if(request.getFilter().getFilters() != null) {
                for (int i = 0; i < request.getFilter().getFilters().size(); i++) {
                    addFilter(filter, request.getFilter().getFilters().get(i).getField(),
                            request.getFilter().getFilters().get(i).getOperator(),
                            request.getFilter().getFilters().get(i).getValue(), 1L);
                }
            }

            request.setFilter(filter);
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return filter;
    }

    public DataSourceResult getResultByPrincipal(MainDao dao, DataSourceRequest request, Authentication authentication,
                                                 String source) {
        return getResultByPrincipal(dao, request, authentication, source, null);
    }

    public DataSourceResult getResultByPrincipal(MainDao dao, DataSourceRequest request, Authentication authentication,
            String source, DataSourceRequest.FilterDescriptor customFilter) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        UserLevel lutUserLevel = userLevelRepository.getOneById(userPrincipal.getLvlId());

        DataSourceRequest.FilterDescriptor filter = new DataSourceRequest.FilterDescriptor();


        try {
            if(customFilter != null) {
                addFilter(filter, customFilter.getField(), customFilter.getOperator(), customFilter.getValue(), 1L);
            }

            if(request.getFilter().getFilters() != null) {
                for (int i = 0; i < request.getFilter().getFilters().size(); i++) {
                    DataSourceRequest.FilterDescriptor filterDescriptor = request.getFilter().getFilters().get(i);
                    if (filterDescriptor.getValue() != null)
                        addFilter(filter, filterDescriptor.getField(),
                                filterDescriptor.getOperator(),
                                filterDescriptor.getValue(),
                                request.getFilter().getLogic().equals("or") ? 0L : 1L);
                    /*System.out.println("logic: " + request.getFilter().getLogic());
                    if (filterDescriptor.getLogic() != null) {
                        System.out.println("nested logic " + filterDescriptor.getLogic());
                        for (int j = 0; j < filterDescriptor.getFilters().size(); j++) {
                            DataSourceRequest.FilterDescriptor nestedFilterDescriptor = filterDescriptor.getFilters().get(j);
                            System.out.println(nestedFilterDescriptor.getField());
                            System.out.println(nestedFilterDescriptor.getValue());
                            if (nestedFilterDescriptor.getValue() != null)
                                addFilter(filterDescriptor, nestedFilterDescriptor.getField(),
                                        nestedFilterDescriptor.getOperator(),
                                        nestedFilterDescriptor.getValue(),
                                        filterDescriptor.getLogic().equals("or") ? 0L : 1L);
                        }
                    }*/
                }
            }

            request.setFilter(filter);

            switch (source) {
                case "cmmn.SourceTypeCdWithFilter": {
                    source = "cmmn.SourceTypeCd";
                    break;
                }

                case "view.policy.PolicyDocViewProject": {
                    source = "view.policy.PolicyDocView";
                    break;
                }

                default: {
                    break;
                }
            }

            return dao.getList(source, request);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }


    public DataSourceRequest.FilterDescriptor addFilter(DataSourceRequest.FilterDescriptor filter, String fieldId,
            String operator, Object value, Long logic) {
        DataSourceRequest.FilterDescriptor filterDescriptor = new DataSourceRequest.FilterDescriptor();
        filterDescriptor.setField(fieldId);
        filterDescriptor.setOperator(operator);
        filterDescriptor.setValue(value);

        if (logic.compareTo(1L) == 0L)
            filter.setLogic("and");
        else
            filter.setLogic("or");

        filter.getFilters().add(filterDescriptor);
        return filter;
    }


    public void createActivityLog(JSONObject log){
         logService.createLog(log.toString());
    }

}