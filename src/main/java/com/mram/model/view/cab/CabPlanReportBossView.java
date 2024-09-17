package com.mram.model.view.cab;

import com.mram.base.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Immutable
@Subselect("SELECT\n" +
        "\trow_number() OVER ( PARTITION BY p.id ) AS row_num,\n" +
        "\tp.*,\n" +
        "\tvd.user_id,\n" +
        "\tvd.ttl_cnt,\n" +
        "\tvd.apr_cnt,\n" +
        "\t( vd.ttl_cnt - vd.apr_cnt ) AS rep_cnt,\n" +
        "\tu.`name` AS user_nm,\n" +
        "\tu.image_url \n" +
        "FROM\n" +
        "\ttbl_plan p,\n" +
        "\tv_user u,\n" +
        "\t(\n" +
        "\tSELECT\n" +
        "\t\tr.plan_id,\n" +
        "\t\tr.user_id,\n" +
        "\t\tcount( r.id ) AS ttl_cnt,\n" +
        "\t\tsum( CASE WHEN s.STATUS_NM = 'Баталсан' THEN 1 ELSE 0 END ) AS apr_cnt \n" +
        "\tFROM\n" +
        "\t\ttbl_plan_report r,\n" +
        "\t\tv_report_status s \n" +
        "\tWHERE\n" +
        "\t\tr.id = s.log_id \n" +
        "\tGROUP BY\n" +
        "\t\tr.user_id,\n" +
        "\t\tr.plan_id \n" +
        "\t) vd \n" +
        "WHERE\n" +
        "\tp.id = vd.plan_id \n" +
        "\tAND u.id = vd.user_id")
public class CabPlanReportBossView extends BaseEntity {
    @Id
    private Long rowNum;
    private Long id;
    private Long userId;
    private Long orgId;
    private int repCnt,aprCnt,ttlCnt;
    private String userNm,fullDesc,planYr,imageUrl;
}
