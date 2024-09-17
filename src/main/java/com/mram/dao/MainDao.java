package com.mram.dao;

import com.mram.model.audit.DataSourceRequest;
import com.mram.model.audit.DataSourceResult;


public interface MainDao {
    DataSourceResult getList(String className, DataSourceRequest request) throws ClassNotFoundException;
    Object getHQLResult(String hqlString, String type);
    Object getListByPage(String request, String tablename);
    Long getTotalPage(String request, String tablename);
    void insertBatchSQL(final String sql);
    Object getNativeSQLResult(String queryStr, String type);

}
