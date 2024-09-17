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
        "            va.* \n" +
        "        FROM\n" +
        "            (SELECT\n" +
        "                obj.*,\n" +
        "                CASE      \n" +
        "                    WHEN obj.obj_type = '01' THEN   'Гүйцэтгэлийн зорилт, арга хэмжээ' \n" +
        "                    WHEN obj.obj_type = '02' THEN   'Мэдлэг, ур чадвараа дээшлүүлэх зорилт, арга хэмжээ' \n" +
        "                    ELSE 'Нэмэлт'   \n" +
        "                END AS obj_type_nm,\n" +
        "                ROW_NUMBER() OVER ( PARTITION \n" +
        "            BY\n" +
        "                plan_id, obj_type \n" +
        "            ORDER BY\n" +
        "                obj_type DESC ) AS row_num,\n" +
        "                ( SELECT\n" +
        "                    count( u.user_id ) \n" +
        "                FROM\n" +
        "                    tbl_plan_users u \n" +
        "                WHERE\n" +
        "                    u.obj_id = obj.id ) AS user_cnt,\n" +
        "                (  SELECT\n" +
        "                    group_concat( tr.username SEPARATOR ',' )   \n" +
        "                FROM\n" +
        "                    t_users tr,\n" +
        "                    tbl_plan_users tur   \n" +
        "                WHERE\n" +
        "                    tur.obj_id = obj.id \n" +
        "                    and tur.user_id=tr.id  \n" +
        "                GROUP BY\n" +
        "                    tur.obj_id   ) AS user_names,\n" +
        "                (  SELECT\n" +
        "                    group_concat( tr.id SEPARATOR ',' )   \n" +
        "                FROM\n" +
        "                    t_users tr,\n" +
        "                    tbl_plan_users tur   \n" +
        "                WHERE\n" +
        "                    tur.obj_id = obj.id \n" +
        "                    and tur.user_id=tr.id  \n" +
        "                GROUP BY\n" +
        "                    tur.obj_id   ) AS user_ids \n" +
        "            FROM\n" +
        "                tbl_plan_objective obj,\n" +
        "                tbl_plan t  \n" +
        "            WHERE\n" +
        "                obj.plan_id = t.id\n" +
        "            ) va ")
public class CabPlanObjView extends BaseEntity {
    @Id
    private Long id;
    private Long planId;
    private int rowNum, userCnt;
    private String title;
    private String objType;
    private String objTypeNm, userNames, userIds;

}