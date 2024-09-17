package com.mram.model.view.cab;

import com.mram.base.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Immutable
@Subselect("SELECT va.* FROM (SELECT\n" +
        "\tCONCAT(ju.row_num,\t'.',ROW_NUMBER() OVER ( PARTITION BY d.obj_id,j.user_id ORDER BY d.id asc )) AS row_num,\n"
        +
        "\td.title,\n" +
        "\td.obj_id,\n" +
        "\td.event_type,\n" +
        "\tj.user_id AS obj_user_id,\n" +
        "\tc.* \n" +
        "FROM\n" +
        "\ttbl_plan_detail d,\n" +
        "\tv_plan_objective_user j,\n" +
        "\ttbl_plan_criteria c ,\n" +
        "\tv_plan_objective_user ju \n" +
        "WHERE\n" +
        "\td.id = c.det_id \n" +
        "\tAND j.id = d.obj_id \n" +
        "\tAND j.user_id = c.user_id and ju.id = d.obj_id and ju.user_id=c.user_id) va")
public class CabPlanCriteriaView extends BaseEntity {
    @Id
    private Long id;
    private Long objId;
    private String title;
    private String rowNum;
    private Long detId;
    private Long userId;
    private String criteria, eventType;
    private String srtDt;
    private String endDt;
    private String reached,baseStr,targetStr;
    private Double baseline, firstHalf, secondHalf, fulfillment;

}