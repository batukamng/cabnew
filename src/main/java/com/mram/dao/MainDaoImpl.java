package com.mram.dao;

import com.mram.model.audit.*;
import jakarta.annotation.PostConstruct;
import lombok.SneakyThrows;
import org.hibernate.Session;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.support.JdbcDaoSupport;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import javax.sql.DataSource;
import java.util.List;

@Transactional
@Component
@Service
public class MainDaoImpl extends JdbcDaoSupport implements MainDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    DataSource dataSource;

    @PostConstruct
    private void initialize() {
        setDataSource(dataSource);
    }

    @Override
    public void insertBatchSQL(String sql) {
        getJdbcTemplate().batchUpdate(new String[] { sql });
    }

    public Object getNativeSQLResult(final String queryStr, final String type) {

        try {
            if ("insert".equals(type)) {
                entityManager.createQuery(queryStr);
                try {
                    return true;
                } catch (Exception e) {

                    logger.info(e);
                    // return null;
                }
            } else if ("list".equals(type)) {
                final Query query = entityManager.createNativeQuery(queryStr);
                try {
                    return query.getResultList();
                } catch (Exception e) {
                    logger.info(e);
                }

            } else if ("update".equals(type)) {
                System.out.println("qqq" + queryStr);
                final Query query = entityManager.createQuery(queryStr);
                try {
                    return query.executeUpdate();
                } catch (Exception e) {
                    logger.info(e);
                }

            } else if ("totalSum".equals(type)) {
                final Query query = entityManager.createQuery(queryStr);
                try {
                    return query.getResultList().get(0);
                } catch (Exception e) {
                    logger.info(e);
                }

            } else if ("delete".equals(type)) {
                final Query query = entityManager.createNativeQuery(queryStr);
                query.executeUpdate();
                try {
                    return true;
                } catch (Exception e) {

                    logger.info(e);
                }
            } else {
                return null;
            }

        } catch (Exception e) {

            logger.info(e);
        }
    }

    @Override
    public List<Object> getListByPage(final String request, final String tablename) {
        // Gson gson = new Gson ();
        System.out.println(request);
        int skip = 0;
        int take = 0;
        int page = 0;
        String field = "";
        String order = "";
        String dir = "";
        JSONArray sort = null;
        String group = "";
        JSONObject filter = null;
        final String org = "";
        String custom = "";
        String nat = "";
        String flquery = "";
        String isspecial = "";
        System.out.println("@@" + request);
        final JSONObject req = new JSONObject(request);
        if (req.has("skip")) {
            skip = req.getInt("skip");
        }
        if (req.has("page")) {
            page = req.getInt("page");
        }

        if (req.has("sort")) {
            sort = req.getJSONArray("sort");
        }
        if (req.has("take")) {
            take = req.getInt("take");
        }
        if (req.has("group")) {
            group = req.getString("group");
        }
        if (req.has("filter")) {

            if (!req.isNull("filter")) {
                filter = req.getJSONObject("filter");
            }

        }

        if (req.has("custom")) {
            custom = req.getString("custom");
        }
        if (req.has("field")) {
            field = req.getString("field");
        }
        if (req.has("dir")) {
            dir = req.getString("dir");
        }
        if (req.has("native")) {
            nat = req.getString("native");
        }
        if (req.has("isspecial")) {
            isspecial = req.getString("isspecial");
        }

        String multiOrde = "";

        if (sort != null) {
            final JSONArray arr = sort;
            for (int i = 0; i < arr.length(); i++) {
                final String str = arr.get(i).toString();
                final JSONObject srt = new JSONObject(str);
                if (srt.isNull("field")) {
                    field = "";
                } else {
                    field = srt.getString("field");
                    multiOrde = multiOrde + " " + field;

                }
                if (srt.isNull("dir")) {
                    dir = "";
                } else {
                    dir = srt.getString("dir");
                    multiOrde = multiOrde + " " + dir + ",";
                }
            }

        }
        if (!multiOrde.isEmpty()) {
            System.out.println("$$$$ " + multiOrde.substring(0, multiOrde.length() - 1));
        }

        String groupfield = "";
        String groupdir = "";
        if (!group.isEmpty()) {
            final JSONArray arr = new JSONArray(group);
            for (int i = 0; i < arr.length(); i++) {
                final String str = arr.get(i).toString();
                final JSONObject srt = new JSONObject(str);
                if (srt.isNull("field")) {
                    groupfield = "";
                } else {
                    groupfield = srt.getString("field");
                }
                if (srt.isNull("dir")) {
                    groupdir = "";
                } else {
                    groupdir = srt.getString("dir");
                }
            }

        }
        String filterfield = "";
        String operator = "";
        String value = "";

        if (filter != null) {

            final String logic = filter.getString("logic");

            final JSONArray arr = filter.getJSONArray("filters");
            for (int i = 0; i < arr.length(); i++) {
                final String str = arr.get(i).toString();
                final JSONObject srt = new JSONObject(str);
                if (srt.isNull("field")) {
                    filterfield = "";
                } else {
                    if (!srt.get("field").toString().equalsIgnoreCase("[]")) {
                        filterfield = srt.getString("field");
                    }
                }
                if (srt.isNull("operator")) {
                    operator = "";
                } else {
                    operator = srt.getString("operator");
                }
                if (srt.isNull("value")) {
                    value = "";
                } else {
                    value = String.valueOf(srt.get("value")).toLowerCase();
                    if (value.equalsIgnoreCase("true")) {
                        value = "1";
                    }
                    if (value.equalsIgnoreCase("false")) {
                        value = "0";
                    }
                }
                if (i > 0) {

                    switch (operator) {
                        case "startswith":
                            flquery = flquery + " " + logic + " lower(" + filterfield + ") LIKE lower('" + value
                                    + "%')";
                            break;
                        case "contains":
                            flquery = flquery + " " + logic + " lower(" + filterfield + ") LIKE lower('%" + value
                                    + "%')";
                            break;
                        case "doesnotcontain":
                            flquery = flquery + " " + logic + " lower(" + filterfield + ") NOT LIKE lower('%" + value
                                    + "%')";
                            break;
                        case "endswith":
                            flquery = flquery + " " + logic + " lower(" + filterfield + ") LIKE lower('%" + value
                                    + "')";
                            break;
                        case "neq":
                            flquery = flquery + " " + logic + " lower(" + filterfield + ") != lower('" + value + "')";
                            break;
                        case "eq":
                            flquery = flquery + " " + logic + " " + filterfield + " = '" + value + "'";
                            break;
                        case "gte":
                            flquery = flquery + " " + logic + " " + filterfield + " >= '" + value + "'";
                            break;
                        case "lte":
                            flquery = flquery + " " + logic + " " + filterfield + " <= '" + value + "'";
                            break;
                        case "nlike":
                            flquery = flquery + " " + logic + " " + filterfield + " LIKE ('" + value + "%')";
                            break;
                        case "leq":
                            flquery = flquery + " " + logic + " " + filterfield + " = '" + value + "'";
                            break;
                        case "lj":
                            flquery = flquery + " " + logic + " " + filterfield + " (+)= '" + value + "'";
                            break;
                        case "rj":
                            flquery = flquery + " " + logic + " " + filterfield + " =(+) '" + value + "'";
                            break;
                        case "length":
                            flquery = flquery + " " + logic + " " + filterfield + " = length('" + value + "')";
                            break;
                        case "lengthReverse":
                            flquery = flquery + " " + logic + " length(" + filterfield + ") = '" + value + "'";
                            break;
                        case "lengthGte":
                            flquery = flquery + " " + logic + " length(" + filterfield + ") >= '" + value + "'";
                            break;
                        case "ids":
                            flquery = flquery + " " + logic + " " + filterfield + " in (" + value + ")";
                            break;
                        case "in":

                            if (value.length() > 1) {
                                final String[] list = value.substring(1, value.length() - 1).split(",");
                                if (list.length > 0) {
                                    String ids = "";
                                    for (final String st : list) {
                                        if (st.length() > 1) {
                                            ids = ids + "','" + st;
                                        }
                                    }
                                    if (ids.length() > 2) {
                                        flquery = flquery + " " + logic + " " + filterfield + " in ("
                                                + ids.substring(2, ids.length()) + "')";
                                    }
                                }
                            } else {
                                flquery = flquery + " " + logic + " " + filterfield + " in ('" + value + "')";
                            }
                            break;
                        case "isNull":
                            flquery = flquery + " " + logic + " " + filterfield + " is null";
                            break;
                        case "notNull":
                            flquery = flquery + " " + logic + " " + filterfield + " is not null";
                            break;
                    }
                } else {
                    switch (operator) {
                        case "startswith":
                            flquery = " Where lower(" + filterfield + ") LIKE lower('" + value + "%')";
                            break;
                        case "contains":
                            flquery = " Where lower(" + filterfield + ") LIKE lower('%" + value + "%')";
                            break;
                        case "doesnotcontain":
                            flquery = " Where lower(" + filterfield + ") NOT LIKE lower('%" + value + "%')'";
                            break;
                        case "endswith":
                            flquery = " Where lower(" + filterfield + ") LIKE lower('%" + value + "')";
                            break;
                        case "neq":
                            flquery = " Where lower(" + filterfield + ") != lower('" + value + "')";
                            break;
                        case "eq":
                            flquery = " Where " + filterfield + " = '" + value + "'";
                            break;
                        case "aeq":
                            flquery = " AND lower(" + filterfield + ") = lower('" + value + "')";
                            break;
                        case "gte":
                            flquery = " Where " + filterfield + " >= '" + value + "'";
                            break;
                        case "lte":
                            flquery = " Where " + filterfield + " <= '" + value + "'";
                            break;
                        case "nlike":
                            flquery = " Where " + filterfield + " LIKE ('" + value + "%')";
                            break;
                        case "leq":
                            flquery = " Where " + filterfield + " = '" + value + "'";
                            break;
                        case "lj":
                            flquery = " Where " + filterfield + " (+)= '" + value + "'";
                            break;
                        case "rj":
                            flquery = " Where " + filterfield + " =(+) '" + value + "'";
                            break;
                        case "lengthReverse":
                            flquery = " Where length(" + filterfield + ") = '" + value + "'";
                            break;
                        case "lengthGte":
                            flquery = " Where length(" + filterfield + ") >= '" + value + "'";
                            break;
                        case "length":
                            flquery = " Where " + filterfield + " = length('" + value + "')";
                            break;
                        case "ids":
                            flquery = " Where " + filterfield + " in (" + value + ")";
                            break;
                        case "in":
                            if (value.length() > 1) {
                                final String[] list = value.substring(1, value.length() - 1).split(",");

                                if (list.length > 0) {
                                    String ids = "";
                                    for (final String st : list) {
                                        if (st.length() > 1) {
                                            ids = ids + "','" + st;
                                        }
                                    }
                                    if (ids.length() > 2) {
                                        System.out.println("**" + ids);
                                        flquery = " Where " + filterfield + " in (" + ids.substring(2, ids.length())
                                                + "')";
                                    }
                                }
                            } else {
                                flquery = " Where " + filterfield + " in ('" + value + "')";
                            }

                            break;
                        case "isNull":
                            flquery = flquery + " " + logic + " " + filterfield + " is null";
                            break;
                        case "notNull":
                            flquery = flquery + " " + logic + " " + filterfield + " is not null";
                            break;
                    }

                }

            }

        }

        if (groupfield.isEmpty()) {
            group = "";
        } else {
            group = "group by " + groupfield + " " + groupdir + "";
        }

        String query = null;
        System.out.println("###" + flquery);
        if (!custom.isEmpty() && flquery.length() > 5) {
            flquery = custom + " and (" + flquery.substring(6, flquery.length()) + ")";
        } else if (!custom.isEmpty()) {
            flquery = custom;
        }

        if (tablename.contains(",") || tablename.contains("left join")) {
            query = " " + tablename + "   " + flquery.replace("Where", "and") + "  " + group + " " + order + "";
        } else {
            if (field.isEmpty()) {
                order = "order by id desc";
            } else {
                order = "order by " + multiOrde.substring(0, multiOrde.length() - 1) + "";
            }

            query = "from " + tablename + "   " + flquery + "  " + group + " " + order + "";
        }
        System.out.println("query" + query);
        if (isspecial.isEmpty()) {
            final Query hql = entityManager.createQuery(query);
            if (skip > 0) {
                hql.setFirstResult(skip);
            }
            if (take > 0) {
                hql.setMaxResults(take);
            }

            return hql.getResultList();
        } else {
            final Query nquery = entityManager.createNativeQuery(isspecial);
            return nquery.getResultList();
        }
    }

    @Override
    public Long getTotalPage(final String request, final String tablename) {
        final String field = "";
        final String order = "";
        final String dir = "";
        final String sort = "";
        final String group = "";
        JSONObject filter = null;
        final String org = "";
        String custom = "";
        String isspecial = "";
        System.out.println("###" + request);
        final JSONObject req = new JSONObject(request);

        if (req.has("filter")) {
            if (!req.isNull("filter")) {
                filter = req.getJSONObject("filter");
            }
        }

        if (req.has("custom")) {
            custom = req.getString("custom");
        }

        String filterfield = "";
        String operator = "";
        String value = "";
        String flquery = "";
        /*
         * if (custom.length() > 0) {
         * flquery = custom;
         * }
         */
        if (req.has("isspecial")) {
            isspecial = req.getString("isspecial");
        }
        if (filter != null) {

            final JSONObject fltr = filter;
            final String logic = fltr.getString("logic");
            final JSONArray arr = fltr.getJSONArray("filters");
            for (int i = 0; i < arr.length(); i++) {
                final String str = arr.get(i).toString();
                final JSONObject srt = new JSONObject(str);
                if (srt.isNull("field")) {
                    filterfield = "";
                } else {
                    if (!srt.get("field").toString().equalsIgnoreCase("[]")) {
                        filterfield = srt.get("field").toString();
                    }
                }
                if (srt.isNull("operator")) {
                    operator = "";
                } else {
                    operator = srt.getString("operator");
                }

                if (srt.isNull("value")) {
                    value = "";
                } else {
                    value = String.valueOf(srt.get("value")).toLowerCase();
                    if (value.equalsIgnoreCase("true")) {
                        value = "1";
                    }
                    if (value.equalsIgnoreCase("false")) {
                        value = "0";
                    }
                }
                if (i > 0) {
                    switch (operator) {
                        case "startswith":
                            flquery = flquery + " " + logic + " lower(" + filterfield + ") LIKE lower('" + value
                                    + "%')";
                            break;
                        case "contains":
                            flquery = flquery + " " + logic + " lower(" + filterfield + ") LIKE lower('%" + value
                                    + "%')";
                            break;
                        case "doesnotcontain":
                            flquery = flquery + " " + logic + " lower(" + filterfield + ") NOT LIKE lower('%" + value
                                    + "%')";
                            break;
                        case "endswith":
                            flquery = flquery + " " + logic + " lower(" + filterfield + ") LIKE lower('%" + value
                                    + "')";
                            break;
                        case "neq":
                            flquery = flquery + " " + logic + " lower(" + filterfield + ") != lower('" + value + "')";
                            break;
                        case "eq":
                            flquery = flquery + " " + logic + " " + filterfield + " = '" + value + "'";
                            break;
                        case "gte":
                            flquery = flquery + " " + logic + " " + filterfield + " >= '" + value + "'";
                            break;
                        case "lte":
                            flquery = flquery + " " + logic + " " + filterfield + " <= '" + value + "'";
                            break;
                        case "nlike":
                            flquery = flquery + " " + logic + " " + filterfield + " LIKE ('" + value + "%')";
                            break;
                        case "leq":
                            flquery = flquery + " " + logic + " " + filterfield + " = '" + value + "'";
                            break;
                        case "lj":
                            flquery = flquery + " " + logic + " " + filterfield + " (+)= '" + value + "'";
                            break;
                        case "rj":
                            flquery = flquery + " " + logic + " " + filterfield + " =(+) '" + value + "'";
                            break;
                        case "length":
                            flquery = flquery + " " + logic + " " + filterfield + " = length('" + value + "')";
                            break;
                        case "lengthReverse":
                            flquery = flquery + " " + logic + " length(" + filterfield + ") = '" + value + "'";
                            break;
                        case "lengthGte":
                            flquery = flquery + " " + logic + " length(" + filterfield + ") >= '" + value + "'";
                            break;
                        case "ids":
                            flquery = flquery + " " + logic + " " + filterfield + " in (" + value + ")";
                            break;
                        case "in":

                            if (value.length() > 1) {
                                final String[] list = value.substring(1, value.length() - 1).split(",");
                                if (list.length > 0) {
                                    String ids = "";
                                    for (final String st : list) {
                                        if (st.length() > 1) {
                                            ids = ids + "','" + st;
                                        }
                                    }
                                    if (ids.length() > 2) {
                                        flquery = flquery + " " + logic + " " + filterfield + " in ("
                                                + ids.substring(2, ids.length()) + "')";
                                    }
                                }
                            } else {
                                flquery = flquery + " " + logic + " " + filterfield + " in ('" + value + "')";
                            }
                            break;
                        case "isNull":
                            flquery = flquery + " " + logic + " " + filterfield + " is null";
                            break;
                        case "notNull":
                            flquery = flquery + " " + logic + " " + filterfield + " is not null";
                            break;
                    }
                } else {
                    switch (operator) {
                        case "startswith":
                            flquery = " Where lower(" + filterfield + ") LIKE lower('" + value + "%')";
                            break;
                        case "contains":
                            flquery = " Where lower(" + filterfield + ") LIKE lower('%" + value + "%')";
                            break;
                        case "doesnotcontain":
                            flquery = " Where lower(" + filterfield + ") NOT LIKE lower('%" + value + "%')";
                            break;
                        case "endswith":
                            flquery = " Where lower(" + filterfield + ") LIKE lower('%" + value + "')";
                            break;
                        case "neq":
                            flquery = " Where lower(" + filterfield + ") != lower('" + value + "')";
                            break;
                        case "eq":
                            flquery = " Where " + filterfield + " = '" + value + "'";
                            break;
                        case "aeq":
                            flquery = " AND lower(" + filterfield + ") = lower('" + value + "')";
                            break;
                        case "gte":
                            flquery = " Where " + filterfield + " >= '" + value + "'";
                            break;
                        case "lte":
                            flquery = " Where " + filterfield + " <= '" + value + "'";
                            break;
                        case "nlike":
                            flquery = " Where " + filterfield + " LIKE ('" + value + "%')";
                            break;
                        case "leq":
                            flquery = " Where " + filterfield + " = '" + value + "'";
                            break;
                        case "lj":
                            flquery = " Where " + filterfield + " (+)= '" + value + "'";
                            break;
                        case "rj":
                            flquery = " Where " + filterfield + " =(+) '" + value + "'";
                            break;
                        case "lengthReverse":
                            flquery = " Where length(" + filterfield + ") = '" + value + "'";
                            break;
                        case "lengthGte":
                            flquery = " Where length(" + filterfield + ") >= '" + value + "'";
                            break;
                        case "length":
                            flquery = " Where " + filterfield + " = length('" + value + "')";
                            break;
                        case "ids":
                            flquery = " Where " + filterfield + " in (" + value + ")";
                            break;
                        case "in":
                            if (value.length() > 1) {
                                final String[] list = value.substring(1, value.length() - 1).split(",");

                                if (list.length > 0) {
                                    String ids = "";
                                    for (final String st : list) {
                                        if (st.length() > 1) {
                                            ids = ids + "','" + st;
                                        }
                                    }
                                    if (ids.length() > 2) {
                                        flquery = " Where " + filterfield + " in (" + ids.substring(2, ids.length())
                                                + "')";
                                    }
                                }
                            } else {
                                flquery = flquery + " " + logic + " " + filterfield + " in ('" + value + "')";
                            }

                            break;
                        case "isNull":
                            flquery = flquery + " " + logic + " " + filterfield + " is null";
                            break;
                        case "notNull":
                            flquery = flquery + " " + logic + " " + filterfield + " is not null";
                            break;
                    }
                }

            }

        }

        String query = "";

        if (!custom.isEmpty() && flquery.length() > 5 && !tablename.contains(",")) {
            flquery = custom + " and (" + flquery.substring(6, flquery.length()) + ")";
        } else if (!custom.isEmpty()) {
            flquery = custom;
        }

        if (tablename.contains(",") || tablename.contains("left join")) {
            query = tablename + "   " + flquery.replace("Where", "and") + " ";
        } else {
            query = "select count(*) from " + tablename + "  " + flquery + " ";
        }

        if (isspecial.isEmpty() && !tablename.contains("left join")) {
            final Query hql = entityManager.createQuery(query);
            return (long) hql.getResultList().get(0);
        } else if (tablename.contains("left join")) {
            final Query hql = entityManager.createQuery(query);
            return (long) hql.getResultList().size();
        } else {
            final Query nquery = entityManager.createNativeQuery(isspecial);
            return (Long) nquery.getSingleResult();
        }

    }

    @Override
    public Object getHQLResult(final String hqlString, final String returnType) {
        final Query query = entityManager.createQuery(hqlString);

        if ("list".equals(returnType)) {
            return query.getResultList();
        } else if ("current".equals(returnType)) {
            if (!query.getResultList().isEmpty()) {
                if (query.getResultList().size() == 1) {
                    return query.getResultList().get(0);
                } else {
                    return null;
                }
            }
        } else if ("count".equals(returnType) && !query.getResultList().isEmpty()) {
            return query.getResultList().get(0);
        } else if ("group".equals(returnType)) {
            if (!query.getResultList().isEmpty()) {
                return query.getResultList().size();
            } else {
                return 0;
            }
        }
        return null;
    }

    /*
     * @SneakyThrows
     * 
     * @Override
     * 
     * public DataSourceResult getList(final String className, final
     * DataSourceRequest request)
     * throws ClassNotFoundException {
     * final Class c = Class.forName("com.mram.model." + className);
     * return request.toDataSourceResult(entityManager.unwrap(Session.class), c,
     * request);
     * }
     */

}
