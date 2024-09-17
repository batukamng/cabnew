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
        "\td.title as det_nm,\n" +
        "\tl.firstname,\n" +
        "\tl.lastname,\n" +
        "\tconcat( substr( l.lastname, 1, 1 ), '.', l.firstname ) AS user_nm,\n" +
        "\t'' AS talker_nm,\n" +
        "\t(\n" +
        "\tSELECT\n" +
        "\t\t( CASE o.STATUS WHEN 'sent' THEN 'Илгээсэн' WHEN 'approved' THEN 'Баталсан' WHEN 'rejected' THEN 'Буцсан' ELSE 'Хадгалсан' END ) \n" +
        "\tFROM\n" +
        "\t\tt_activity_log o \n" +
        "\tWHERE\n" +
        "\t\to.log_id = t.id \n" +
        "\t\tAND o.CODE = 'meeting' \n" +
        "\tORDER BY\n" +
        "\t\to.id DESC \n" +
        "\t\tLIMIT 1 \n" +
        "\t) AS status_nm \n" +
        "FROM\n" +
        "\ttbl_plan_user_meeting t,\n" +
        "\ttbl_plan_detail d,\n" +
        "\tt_users u,\n" +
        "\tt_users_detail l \n" +
        "WHERE\n" +
        "\tu.id = t.user_id \n" +
        "\tAND u.id = l.user_id and d.id=t.det_id")
public class CabPlanMeetingView extends BaseEntity {
    @Id
    private Long id;
    private Long planId;
    private Long userId;
    private Long objId;
    private Long detId;
    private Long talkerId;
    private int planYr;
    private double progress;
    private String detNm,typeStr,fullStr,taskStr,userNm,firstname,lastname,statusNm,talkerNm,talkDt;

}