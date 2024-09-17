package com.mram.model.view;

import com.mram.base.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import java.time.LocalDateTime;


@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Immutable
@Subselect("SELECT va.* FROM (SELECT\n" +
        "\tl.*,\n" +
        "\tu.`name` AS user_nm,\n" +
        "CASE\n" +
        "\t\t\n" +
        "\t\tWHEN l.NAME IS NULL THEN\n" +
        "\t\tl.description ELSE l.NAME \n" +
        "\tEND AS desc_text,\n" +
        "CASE\n" +
        "\t\t\n" +
        "\t\tWHEN l.`code` = 'event' THEN 'Цэс'\n" +
        "\t\tWHEN l.`code` = 'plan' THEN 'Төлөвлөгөө'\n" +
        "\t\tWHEN l.`code` = 'plan_user' THEN 'Албан хаагч'\n" +
        "\t\tWHEN l.`code` = 'report' THEN 'Тайлан'\n" +
        "\t\tWHEN l.`code` = 'rate' THEN 'Үнэлгээ'\n" +
        "\t\tWHEN l.`code` = 'inverview' THEN 'Ярилцлага'\n" +
        "\t\tWHEN l.`code` = 'login' THEN 'Систем'\n" +
        "\t\tWHEN l.`code` = 'logout' THEN 'Систем'\n" +
        "\t\tELSE l.NAME \n" +
        "\tEND AS event_nm \n" +
        "FROM\n" +
        "\tt_activity_log l,\n" +
        "\tv_user u \n" +
        "WHERE\n" +
        "\tu.id = l.created_by) va")
public class ActivityLogView extends BaseEntity{
    @Id
    private Long id;
    private Long logId;
    private String code,ip,method,userAgent,userJson,jsonStr,status,strDt,endDt,fromStep,toStep,name,description;
    private LocalDateTime loggedTime;
    private String userNm,descText,eventNm;

}