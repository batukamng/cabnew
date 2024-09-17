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
        "\t\tr.*,\n" +
        "\t\tu.org_nm,\n" +
        "\t\tu.org_id,\n" +
        "\t\tu.user_nm,\n" +
        "\t\td.title AS det_nm,\n" +
        "\t\tc.criteria AS cri_nm,\n" +
        "\t\tDATE_FORMAT(r.created_at, \"%m-%d-%Y\") as rep_dt,\n" +
        "\t\tYEAR(r.created_at) AS 'year', MONTH(r.created_at) AS 'month',WEEK(r.created_at) as 'week',\n" +
        "\t\t(\n" +
        "\t\tSELECT\n" +
        "\t\t\t(\n" +
        "\t\t\tCASE\n" +
        "\t\t\t\t\t`o`.`status` \n" +
        "\t\t\t\t\tWHEN 'sent' THEN\n" +
        "\t\t\t\t\t'Илгээсэн' \n" +
        "\t\t\t\t\tWHEN 'draft' THEN\n" +
        "\t\t\t\t\t'Хадгалсан' \n" +
        "\t\t\t\t\tWHEN 'checked' THEN\n" +
        "\t\t\t\t\t'Хянасан' \n" +
        "\t\t\t\t\tWHEN 'rejected' THEN\n" +
        "\t\t\t\t\t'Цуцалсан' \n" +
        "\t\t\t\t\tWHEN 'extend' THEN\n" +
        "\t\t\t\t\t'Нэмэлт гэрээ' \n" +
        "\t\t\t\t\tWHEN 'returned' THEN\n" +
        "\t\t\t\t\t'Засварт буцсан' \n" +
        "\t\t\t\t\tWHEN 'approved' THEN\n" +
        "\t\t\t\t\t'Баталсан' ELSE 'Хадгалсан' \n" +
        "\t\t\t\tEND \n" +
        "\t\t\t\t) \n" +
        "\t\t\tFROM\n" +
        "\t\t\t\t`t_activity_log` `o` \n" +
        "\t\t\tWHERE\n" +
        "\t\t\t\t`o`.`log_id` = `r`.`id` \n" +
        "\t\t\t\tAND `o`.`code` = 'report' \n" +
        "\t\t\tORDER BY\n" +
        "\t\t\t\t`o`.`id` DESC \n" +
        "\t\t\t\tLIMIT 1 \n" +
        "\t\t\t) AS `status_nm` \n" +
        "\t\tFROM\n" +
        "\t\t\ttbl_plan_report r,\n" +
        "\t\t\ttbl_plan_detail d,\n" +
        "\t\t\ttbl_plan_criteria c,\n" +
        "\t\t\tv_plan_user u \n" +
        "\t\tWHERE\n" +
        "\t\t\tr.plan_id = u.id \n" +
        "\t\t\tAND d.id = r.det_id \n" +
        "\t\t\tAND c.id = r.criteria_id \n" +
        "\t\tAND r.user_id = u.user_id \n" +
        "\t) va")
public class CabPlanReportView extends BaseEntity {
    @Id
    private Long id;
    private Long planId;
    private Long userId;
    private Long orgId;
    private String orgNm,userNm,statusNm,detNm,criNm,repDt;

    private int year,month,week;
    private Double percentage;
    private Long detId;
    private Long criteriaId;
    private String typeStr;
    private String fullStr;

}