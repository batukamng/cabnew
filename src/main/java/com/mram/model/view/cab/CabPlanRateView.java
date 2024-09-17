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
@Subselect("SELECT\n" +
        "\tva.* \n" +
        "FROM\n" +
        "\t(\n" +
        "\tSELECT\n" +
        "\t\tCONCAT(\n" +
        "\t\t\tju.row_num,\n" +
        "\t\t\t'.',\n" +
        "\t\tROW_NUMBER() OVER ( PARTITION BY d.obj_id, j.user_id ORDER BY d.id ASC )) AS row_num,\n" +
        "\t\td.title,\n" +
        "\t\td.obj_id,\n" +
        "\t\td.event_type,\n" +
        "\t\tj.user_id AS obj_user_id,\n" +
        "\t\tc.*,\n" +
        "\t\tj. obj_type_nm,\n" +
        "\t\tj.title as obj_title,\n" +
        "\t\tj.obj_type,\n" +
        "\t\tj.plan_id\n" +
        "\tFROM\n" +
        "\t\ttbl_plan_detail d,\n" +
        "\t\tv_plan_objective_user j,\n" +
        "\t\ttbl_plan_criteria c,\n" +
        "\t\tv_plan_objective_user ju \n" +
        "\tWHERE\n" +
        "\t\td.id = c.det_id \n" +
        "\t\tAND j.id = d.obj_id \n" +
        "\t\tAND j.user_id = c.user_id \n" +
        "\t\tAND ju.id = d.obj_id \n" +
        "\tAND ju.user_id = c.user_id \n" +
        "\t) va")
public class CabPlanRateView extends BaseEntity {
    @Id
    private Long id;
    private Long objId;
    private String title;
    private String rowNum;
    private Long detId;
    private Long userId;
    private Long planId;
    private String criteria,eventType,objTypeNm,objType;
    private String srtDt;
    private String endDt;
    private Double baseline,firstHalf,secondHalf;

}