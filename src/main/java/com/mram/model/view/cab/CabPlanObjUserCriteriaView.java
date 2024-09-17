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
        "\tvc.*,\n" +
        "\tIFNULL( s.eval, 0 ) AS eval,\n" +
        "\tIFNULL( s.apr, 0 ) AS apr \n" +
        "FROM\n" +
        "\t(\n" +
        "\tSELECT\n" +
        "\t\td.title,\n" +
        "\t\tc.*,\n" +
        "\t\tj.plan_id \n" +
        "\tFROM\n" +
        "\t\ttbl_plan_criteria c,\n" +
        "\t\ttbl_plan_detail d,\n" +
        "\t\ttbl_plan_objective j \n" +
        "\tWHERE\n" +
        "\t\tc.det_id = d.id \n" +
        "\t\tAND d.obj_id = j.id \n" +
        "\t) vc\n" +
        "\tLEFT JOIN tbl_plan_score s ON vc.plan_id = s.plan_id \n" +
        "\tAND vc.user_id = s.user_id \n" +
        "\tAND s.criteria_id = vc.id")
public class CabPlanObjUserCriteriaView extends BaseEntity {
    @Id
    private Long id;
    private Long planId;
    private Long detId;
    private Long userId;
    private String criteria;
    private String srtDt;
    private String endDt;
    private String reached;
    private String title;
    private Double baseline, firstHalf, secondHalf, rate, fulfillment,eval,apr;
}