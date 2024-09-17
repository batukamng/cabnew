package com.mram.model.view.cab;

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
@Subselect("""
SELECT
        YEAR(r.created_at) * 12 + MONTH(r.created_at) as id,
      CONCAT(MONTH(r.created_at),'-р сар') AS 'month',\s
      count(r.id) as cnt,
      (select count(r2.id) FROM\s
          tbl_plan_report r2,
          tbl_plan_detail d,
          tbl_plan_criteria c,
          v_plan_user u WHERE
          r2.plan_id = u.id\s
          AND d.id = r2.det_id\s
          AND c.id = r2.criteria_id\s
      AND r2.user_id = u.user_id and MONTH(r2.created_at) = MONTH(r.created_at) and YEAR(r2.created_at) = YEAR(r.created_at))    total_cnt
      FROM
          tbl_plan_report r,
          tbl_plan_detail d,
          tbl_plan_criteria c,
          v_plan_user u\s
      WHERE
          r.plan_id = u.id\s
          AND d.id = r.det_id\s
          AND c.id = r.criteria_id\s
      AND r.user_id = u.user_id
      AND (SELECT o.status\s
          FROM `t_activity_log` `o`\s
          WHERE `o`.`log_id` = `r`.`id` AND `o`.`code` = 'report'\s
          ORDER BY `o`.`id` DESC LIMIT 1 ) = 'approved'
      GROUP BY YEAR(r.created_at), MONTH(r.created_at)
""")
public class DashboardCabPlanReportView {
    @Id
    private Long id;
    private String month;
    private Integer cnt, totalCnt;

}