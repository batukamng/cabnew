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
        "\t\tt.*,\n" +
        "\t\tr.`name` AS org_nm,\n" +
        "\t\t'' AS user_nm,\n" +
        "\t\t(\n" +
        "\t\tSELECT\n" +
        "\t\tCASE\n" +
        "\t\t\t\to.STATUS \n" +
        "\t\t\t\tWHEN 'sent' THEN\n" +
        "\t\t\t\t'Илгээсэн' \n" +
        "\t\t\t\tWHEN 'draft' THEN\n" +
        "\t\t\t\t'Хадгалсан' \n" +
        "\t\t\t\tWHEN 'checked' THEN\n" +
        "\t\t\t\t'Хувиарласан' \n" +
        "\t\t\t\tWHEN 'rejected' THEN\n" +
        "\t\t\t\t'Цуцалсан' \n" +
        "\t\t\t\tWHEN 'extend' THEN\n" +
        "\t\t\t\t'Нэмэлт гэрээ' \n" +
        "\t\t\t\tWHEN 'returned' THEN\n" +
        "\t\t\t\t'Засварт буцсан' \n" +
        "\t\t\t\tWHEN 'approved' THEN\n" +
        "\t\t\t\t'Баталсан' ELSE 'Хадгалсан' \n" +
        "\t\t\tEND \n" +
        "\t\t\tFROM\n" +
        "\t\t\t\tt_activity_log o \n" +
        "\t\t\tWHERE\n" +
        "\t\t\t\to.LOG_ID = t.id \n" +
        "\t\t\t\tAND o.CODE = 'plan' \n" +
        "\t\t\tORDER BY\n" +
        "\t\t\t\to.id DESC \n" +
        "\t\t\t\tLIMIT 1 \n" +
        "\t\t\t) AS status_nm,\n" +
        "\t\t\t( SELECT count( j.id ) FROM tbl_plan_objective j WHERE j.plan_id = t.id AND j.obj_type = '01' ) AS obj1cnt,\n" +
        "\t\t\t( SELECT count( j.id ) FROM tbl_plan_objective j WHERE j.plan_id = t.id AND j.obj_type = '02' ) AS obj2cnt, \n" +
        "\t\t\t( SELECT count( d.id ) FROM tbl_plan_objective j,tbl_plan_detail d WHERE d.parent_Id is not null and d.obj_id=j.id and j.plan_id = t.id AND j.obj_type = '01' ) AS det1cnt,\n" +
        "\t\t\t( SELECT count( d.id ) FROM tbl_plan_objective j,tbl_plan_detail d WHERE d.parent_Id is not null and d.obj_id=j.id and j.plan_id = t.id AND j.obj_type = '02' ) AS det2cnt, \n" +
        "\t\t\t( SELECT count(DISTINCT u.user_id ) FROM tbl_plan_objective j,tbl_plan_detail_users u,tbl_plan_detail d WHERE d.obj_id=j.id and u.detail_id=d.id and j.plan_id = t.id ) AS user_cnt \n" +
        "\t\tFROM\n" +
        "\t\t\ttbl_plan t,\n" +
        "\t\t\tt_organization r \n" +
        "\t\tWHERE\n" +
        "\t\tr.id = t.org_id \n" +
        "\t) va")
public class CabPlanView extends BaseEntity {
    @Id
    private Long id;
    private Long orgId;
    private int planYr;
    private int obj1Cnt,obj2Cnt;
    private int det1Cnt,det2Cnt,userCnt;
    private String fullDesc;
    private String orgNm,userNm,statusNm;

}