package com.mram.model.audit;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.mram.utils.Tools;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Tuple;
import jakarta.persistence.TupleElement;
import jakarta.persistence.criteria.*;

import java.beans.IntrospectionException;
import java.beans.PropertyDescriptor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SuppressWarnings("ALL")
public class DataSourceRequest {

    EntityManager entityManager;

    private int page;
    private int pageSize;
    private int take;
    private int skip;
    private List<SortDescriptor> sort;
    private List<GroupDescriptor> group;
    private List<AggregateDescriptor> aggregate;
    private HashMap<String, Object> data;

    private FilterDescriptor filter;
    private FilterDescriptor custom;

    public DataSourceRequest() {
        filter = new FilterDescriptor();
        custom = new FilterDescriptor();
        data = new HashMap<String, Object>();
    }

    public FilterDescriptor addFilter(FilterDescriptor filter, String fieldId, String operator, Object value,
            Long logic) {
        FilterDescriptor filterDescriptor = new FilterDescriptor();
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

    public HashMap<String, Object> getData() {
        return data;
    }

    @JsonAnySetter
    public void handleUnknown(String key, Object value) {
        data.put(key, value);
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public int getTake() {
        return take;
    }

    public void setTake(int take) {
        this.take = take;
    }

    public int getSkip() {
        return skip;
    }

    public void setSkip(int skip) {
        this.skip = skip;
    }

    public List<SortDescriptor> getSort() {
        return sort;
    }

    public void setSort(List<SortDescriptor> sort) {
        this.sort = sort;
    }

    public FilterDescriptor getFilter() {
        return filter;
    }

    public void setFilter(FilterDescriptor filter) {
        this.filter = filter;
        if (custom.getFilters() != null) {
            for (int i = 0; i < custom.getFilters().size(); i++) {
                if (custom.getFilters().get(i).getFilters() != null
                        && custom.getFilters().get(i).getFilters().size() > 0) {
                    checkFilter(i);
                } else {
                    if (custom.getFilters().get(i).getValue() != null) {
                        addFilter(this.filter, custom.getFilters().get(i).getField(),
                                custom.getFilters().get(i).getOperator(), custom.getFilters().get(i).getValue(), 1L);
                    }
                }
            }
        }
    }

    public void checkFilter(int i) {
        if (custom.getFilters().get(i).getFilters().size() > 0) {
            FilterDescriptor subFilter = new FilterDescriptor();
            for (int j = 0; j < custom.getFilters().get(i).getFilters().size(); j++) {
                if (custom.getFilters().get(i).getFilters().get(j).getValue() != null) {
                    FilterDescriptor filterDescriptor = new FilterDescriptor();
                    filterDescriptor.setField(custom.getFilters().get(i).getFilters().get(j).getField());
                    filterDescriptor.setOperator(custom.getFilters().get(i).getFilters().get(j).getOperator());
                    filterDescriptor.setValue(custom.getFilters().get(i).getFilters().get(j).getValue());
                    subFilter.setLogic(custom.getFilters().get(i).getLogic());
                    subFilter.getFilters().add(filterDescriptor);
                }
            }
            this.filter.setLogic("and");
            this.filter.getFilters().add(subFilter);
        }
    }

    public FilterDescriptor getCustom() {
        return custom;
    }

    public void setCustom(FilterDescriptor custom) {
        this.custom = custom;
    }

    private Predicate restrict(Root<?> root, CriteriaBuilder cb, FilterDescriptor filter, Class clazz) {
        String operator = filter.getOperator();
        String field = filter.getField();
        Object value = filter.getValue();

        boolean ignoreCase = filter.isIgnoreCase();

        Predicate predicate = null;

        if (!Tools.isNullOrEmpty(operator)) {
            try {
                Class<?> type = new PropertyDescriptor(field, clazz).getPropertyType();
                if (type == double.class || type == Double.class) {
                    value = Double.parseDouble(value.toString());
                } else if (type == float.class || type == Float.class) {
                    value = Float.parseFloat(value.toString());
                } else if (type == long.class || type == Long.class) {
                    value = Long.parseLong(value.toString());
                } else if (type == int.class || type == Integer.class) {
                    value = Integer.parseInt(value.toString());
                } else if (type == short.class || type == Short.class) {
                    value = Short.parseShort(value.toString());
                } else if (type == boolean.class || type == Boolean.class) {
                    value = Boolean.parseBoolean(value.toString());
                }
            } catch (IntrospectionException | NumberFormatException | ClassCastException ignored) {
                value = "";
            }

            switch (operator) {
                case "eq":
                    if (value instanceof String && ignoreCase) {
                        predicate = cb.equal(cb.lower(root.get(field)), ((String) value).toLowerCase());
                    } else {
                        predicate = cb.equal(root.get(field), value);
                    }
                    break;
                case "neq":
                    if (value instanceof String && ignoreCase) {
                        predicate = cb.notEqual(cb.lower(root.get(field)), ((String) value).toLowerCase());
                    } else {
                        predicate = cb.notEqual(root.get(field), value);
                    }
                    break;
                case "isNull":
                case "isnull":
                    if ("true".equalsIgnoreCase(value.toString())) {
                        predicate = cb.isNull(root.get(field));
                    } else {
                        predicate = cb.isNotNull(root.get(field));
                    }
                    break;
                case "gt":
                    predicate = cb.gt(root.get(field), (Number) value);
                    break;
                case "gte":
                    predicate = cb.ge(root.get(field), (Number) value);
                    break;
                case "lt":
                    predicate = cb.lt(root.get(field), (Number) value);
                    break;
                case "lte":
                    predicate = cb.le(root.get(field), (Number) value);
                    break;
                case "startswith":
                    if (value != null) {
                        if (value instanceof String && ignoreCase) {
                            predicate = cb.like(cb.lower(root.get(field)), value.toString().toLowerCase() + "%");
                        } else {
                            predicate = cb.like(root.get(field), value.toString() + "%");
                        }
                    }
                    break;
                case "endswith":
                    if (value != null) {
                        if (value instanceof String && ignoreCase) {
                            predicate = cb.like(cb.lower(root.get(field)), "%" + value.toString().toLowerCase());
                        } else {
                            predicate = cb.like(root.get(field), "%" + value.toString());
                        }
                    }
                    break;
                case "contains":
                    if (value != null) {
                        if (value instanceof String && ignoreCase) {
                            predicate = cb.like(cb.lower(root.get(field)), "%" + value.toString().toLowerCase() + "%");
                        } else {
                            predicate = cb.like(root.get(field), "%" + value.toString() + "%");
                        }
                        System.out.println(field + " like " + value.toString());
                    }

                    break;
                case "doesnotcontain":
                    if (value != null) {
                        if (value instanceof String && ignoreCase) {
                            predicate = cb.notLike(cb.lower(root.get(field)),
                                    "%" + value.toString().toLowerCase() + "%");
                        } else {
                            predicate = cb.notLike(root.get(field), "%" + value.toString() + "%");
                        }
                    }
                    break;
            }

        }
        return predicate;
    }

    /*
     * private Predicate getLikeExpression(Root<?> root, CriteriaBuilder cb, String
     * field, String value, MatchMode mode, boolean ignoreCase) {
     * String adjustedValue = adjustValueByMatchMode(value, mode);
     * Expression<String> expression = root.get(field);
     * if (ignoreCase) {
     * expression = cb.lower(expression);
     * adjustedValue = adjustedValue.toLowerCase();
     * }
     * return cb.like(expression, adjustedValue);
     * }
     * 
     * private String adjustValueByMatchMode(String value, MatchMode mode) {
     * switch (mode) {
     * case EXACT:
     * return value;
     * case START:
     * return value + "%";
     * case END:
     * return "%" + value;
     * case ANYWHERE:
     * return "%" + value + "%";
     * }
     * throw new IllegalArgumentException("Unknown match mode: " + mode);
     * }
     */
    private void filter(Root<?> root, CriteriaQuery<?> query, CriteriaBuilder cb, FilterDescriptor filter,
            Class clazz) {
        if (filter != null) {

            List<FilterDescriptor> filters = filter.filters;
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getLogic() == null) {
                filter.setLogic("and");
            }

            for (FilterDescriptor entry : filters) {
                if (!entry.getFilters().isEmpty()) {
                    filter(root, query, cb, entry, clazz);
                } else {
                    predicates.add(restrict(root, cb, entry, clazz));
                }
            }

            Predicate[] predicateArray = predicates.toArray(new Predicate[0]);
            if (filter.getLogic().equals("or")) {
                query.where(cb.or(predicateArray));
            } else {
                query.where(cb.and(predicateArray));
            }
        }
    }

    private void sort(CriteriaQuery<?> query, Root<?> root, List<SortDescriptor> sort) {
        if (sort != null && !sort.isEmpty()) {
            CriteriaBuilder cb = entityManager.getCriteriaBuilder();
            List<Order> orders = new ArrayList<>();
            for (SortDescriptor entry : sort) {
                String field = entry.getField();
                String dir = entry.getDir();

                if ("asc".equalsIgnoreCase(dir)) {
                    orders.add(cb.asc(root.get(field)));
                } else {
                    orders.add(cb.desc(root.get(field)));
                }
            }
            query.orderBy(orders);
        }
    }

    private List<Map<String, Object>> groupBy(List<?> items, List<GroupDescriptor> group, Class<?> clazz)
            throws IntrospectionException, IllegalAccessException, InvocationTargetException {
        List<Map<String, Object>> result = new ArrayList<>();

        if (items != null && !items.isEmpty() && group != null && !group.isEmpty()) {
            GroupDescriptor descriptor = group.get(0);
            List<AggregateDescriptor> aggregates = descriptor.getAggregates();
            final String field = descriptor.getField();
            Method accessor = new PropertyDescriptor(field, clazz).getReadMethod();

            Object groupValue = new Object();
            if (items != null && items.get(0) != null){
                groupValue = accessor.invoke(items.get(0));
            }

            List<Object> groupItems = createGroupItem(group.size() > 1, clazz, result, aggregates, field, groupValue);

            if (groupItems != null && accessor != null) {
                for (Object item : items) {
                    Object currentValue = accessor.invoke(item);

                    if (groupValue != null && !groupValue.equals(currentValue)) {
                        groupValue = currentValue;
                        groupItems = createGroupItem(group.size() > 1, clazz, result, aggregates, field, groupValue);
                    }
                    groupItems.add(item);
                }

                if (group.size() > 1) {
                    for (Map<String, Object> g : result) {
                        g.put("items", groupBy((List<?>) g.get("items"), group.subList(1, group.size()), clazz));
                    }
                }
            }

        }
        return result;
    }

    private List<Object> createGroupItem(Boolean hasSubgroups, Class<?> clazz, List<Map<String, Object>> result,
            List<AggregateDescriptor> aggregates, final String field, Object groupValue) {

        Map<String, Object> groupItem = new HashMap<>();
        List<Object> groupItems = new ArrayList<>();

        result.add(groupItem);

        groupItem.put("value", groupValue);
        groupItem.put("field", field);
        groupItem.put("hasSubgroups", hasSubgroups);

        if (aggregates != null && !aggregates.isEmpty()) {
            CriteriaBuilder cb = entityManager.getCriteriaBuilder();
            CriteriaQuery<?> cq = cb.createQuery(clazz);
            Root<?> root = cq.from(clazz);

            filter(root, cq, cb, getFilter(), clazz);

            Predicate currentRestriction = cb.equal(root.get(field), groupValue);

            cq.where(currentRestriction);

            groupItem.put("aggregates", calculateAggregates(cq, root, aggregates));
        } else {
            groupItem.put("aggregates", new HashMap<String, Object>());
        }
        groupItem.put("items", groupItems);
        return groupItems;
    }

    private Map<String, Object> calculateAggregates(CriteriaQuery<?> cq, Root<?> root,
            List<AggregateDescriptor> aggregates) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        Map<String, Object> resultMap = new HashMap<>();

        List<Selection<?>> selections = new ArrayList<>();
        for (AggregateDescriptor ad : aggregates) {
            switch (ad.getAggregate()) {
                case "sum":
                    selections.add(cb.sum(root.get(ad.getField())).alias(ad.getField() + "_sum"));
                    break;
                case "count":
                    selections.add(cb.count(root.get(ad.getField())).alias(ad.getField() + "_count"));
                    break;
                case "min":
                    selections.add(cb.min(root.get(ad.getField())).alias(ad.getField() + "_min"));
                    break;
                case "max":
                    selections.add(cb.max(root.get(ad.getField())).alias(ad.getField() + "_max"));
                    break;
                case "avg":
                    selections.add(cb.avg(root.get(ad.getField())).alias(ad.getField() + "_avg"));
                    break;
            }
        }

        CriteriaQuery<Tuple> query = cb.createTupleQuery();
        query.multiselect(selections);

        Tuple tuple = entityManager.createQuery(query).getSingleResult();
        for (TupleElement<?> element : tuple.getElements()) {
            String alias = element.getAlias();
            Object value = tuple.get(alias);
            String name = alias.split("_")[0];
            String function = alias.split("_")[1];

            if (resultMap.containsKey(name)) {
                ((Map<String, Object>) resultMap.get(name)).put(function, value);
            } else {
                Map<String, Object> aggregate = new HashMap<>();
                aggregate.put(function, value);
                resultMap.put(name, aggregate);
            }
        }
        return resultMap;
    }

    private Long total(CriteriaBuilder cb, CriteriaQuery query, Class clazz) {
        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        Root<?> root = cq.from(clazz);
        cq.select(cb.count(root));

        filter(root, cq, cb, getFilter(), clazz);

        Long total = entityManager.createQuery(cq).getSingleResult();

        return total != null ? total : 0;

    }

    public DataSourceResult toDataSourceResult(EntityManager entityManager, Class<?> clazz, DataSourceRequest request)
            throws IntrospectionException, InvocationTargetException, IllegalAccessException {
        this.entityManager = entityManager;
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<?> cq = cb.createQuery(clazz);
        Root<?> root = cq.from(clazz);

        filter(root, cq, cb, getFilter(), clazz);

        Long total = total(cb, cq, clazz);

        sort(cq, root, sortDescriptors());

        List<?> resultList = entityManager.createQuery(cq)
                .setMaxResults(getTake())
                .setFirstResult(getSkip())
                .getResultList();

        DataSourceResult result = new DataSourceResult();

        result.setTotal(total);

        List<GroupDescriptor> groups = getGroup();

        if (groups != null && !groups.isEmpty()) {
            result.setData(groupBy(resultList, groups, clazz));
        } else {
            if (total == 0) {
                result.setData(new ArrayList<>());
            } else {
                result.setData(resultList);
            }
        }

        List<AggregateDescriptor> aggregates = getAggregate();
        if (aggregates != null && !aggregates.isEmpty()) {
            result.setAggregates(aggregate(cq, cb, root, aggregates, clazz));
        }

        return result;
    }

    private Map<String, Object> aggregate(CriteriaQuery<?> cq, CriteriaBuilder cb, Root<?> root,
            List<AggregateDescriptor> aggregates, Class clazz) {
        filter(root, cq, cb, getFilter(), clazz);

        return calculateAggregates(cq, root, aggregates);
    }

    private List<SortDescriptor> sortDescriptors() {
        List<SortDescriptor> sort = new ArrayList<SortDescriptor>();

        List<GroupDescriptor> groups = getGroup();
        List<SortDescriptor> sorts = getSort();

        if (groups != null) {
            sort.addAll(groups);
        }

        if (sorts != null) {
            sort.addAll(sorts);
        }
        return sort;
    }

    public List<GroupDescriptor> getGroup() {
        return group;
    }

    public void setGroup(List<GroupDescriptor> group) {
        this.group = group;
    }

    public List<AggregateDescriptor> getAggregate() {
        return aggregate;
    }

    public void setAggregate(List<AggregateDescriptor> aggregate) {
        this.aggregate = aggregate;
    }

    public static class SortDescriptor {
        private String field;
        private String dir;

        public String getField() {
            return field;
        }

        public void setField(String field) {
            this.field = field;
        }

        public String getDir() {
            return dir;
        }

        public void setDir(String dir) {
            this.dir = dir;
        }
    }

    public static class GroupDescriptor extends SortDescriptor {
        private List<AggregateDescriptor> aggregates;

        public GroupDescriptor() {
            aggregates = new ArrayList<AggregateDescriptor>();
        }

        public List<AggregateDescriptor> getAggregates() {
            return aggregates;
        }
    }

    public static class AggregateDescriptor {
        private String field;
        private String aggregate;

        public String getField() {
            return field;
        }

        public void setField(String field) {
            this.field = field;
        }

        public String getAggregate() {
            return aggregate;
        }

        public void setAggregate(String aggregate) {
            this.aggregate = aggregate;
        }
    }

    public static class FilterDescriptor {
        private String logic;
        private List<FilterDescriptor> filters;
        private String field;
        private Object value;
        private String operator;
        private boolean ignoreCase = true;

        public FilterDescriptor() {
            filters = new ArrayList<FilterDescriptor>();
        }

        public String getField() {
            return field;
        }

        public void setField(String field) {
            this.field = field;
        }

        public Object getValue() {
            return value;
        }

        public void setValue(Object value) {
            this.value = value;
        }

        public String getOperator() {
            return operator;
        }

        public void setOperator(String operator) {
            this.operator = operator;
        }

        public String getLogic() {
            return logic;
        }

        public void setLogic(String logic) {
            this.logic = logic;
        }

        public boolean isIgnoreCase() {
            return ignoreCase;
        }

        public void setIgnoreCase(boolean ignoreCase) {
            this.ignoreCase = ignoreCase;
        }

        public List<FilterDescriptor> getFilters() {
            return filters;
        }
    }
}
