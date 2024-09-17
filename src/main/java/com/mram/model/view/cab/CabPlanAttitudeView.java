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
        "\tt.*,\n" +
        "\tp.org_id,\n" +
        "\tp.plan_yr,\n" +
        "\tl.firstname,\n" +
        "\tl.lastname,\n" +
        "\tconcat( substr( l.lastname, 1, 1 ), '.', l.firstname ) AS user_nm,\n" +
        "\t(\n" +
        "\tSELECT\n" +
        "\t\tconcat( substr( l.lastname, 1, 1 ), '.', l.firstname ) AS eval_user_nm \n" +
        "\tFROM\n" +
        "\t\tt_users u,\n" +
        "\t\tt_users_detail l \n" +
        "\tWHERE\n" +
        "\t\tu.id = t.eval_user_id \n" +
        "\t\tAND u.id = l.user_id \n" +
        "\t) AS eval_user_nm \n" +
        "FROM\n" +
        "\ttbl_plan_attitude t,\n" +
        "\ttbl_plan p,\n" +
        "\tt_users u,\n" +
        "\tt_users_detail l \n" +
        "WHERE\n" +
        "\tp.id = t.plan_id \n" +
        "\tAND u.id = t.user_id \n" +
        "\tAND u.id = l.user_id")
public class CabPlanAttitudeView extends BaseEntity {
    @Id
    private Long id;
    private Long userId;
    private Long evalUserId;
    private Long planId;
    private Long orgId;
    private int planYr;
    private String research;
    private String typeStr,typeScr,userNm,evalUserNm;
    private Double solving, responsibility, attitude, hourUse,teamwork,leadVal,comVal;

}