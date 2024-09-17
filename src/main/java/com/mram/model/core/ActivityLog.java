package com.mram.model.core;

import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "t_activity_log")
public class ActivityLog  extends BaseEntity implements GenericEntity<ActivityLog> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;
    private Long logId;
    private String code,ip,method,userAgent,userJson,jsonStr,status,strDt,endDt,fromStep,toStep,name,description;
    private LocalDateTime loggedTime;
    @Transient
    private String duration;

    @Override
    public void update(ActivityLog source) {
        this.logId=source.logId;
        this.code=source.code;
        this.ip=source.ip;
        this.description=source.description;
        this.method=source.method;
        this.userAgent=source.userAgent;
        this.userJson=source.userJson;
        this.loggedTime=source.loggedTime;
        this.jsonStr=source.jsonStr;
        this.status=source.status;
        this.strDt=source.strDt;
        this.endDt=source.endDt;
        this.fromStep=source.fromStep;
        this.toStep=source.toStep;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public ActivityLog createNewInstance() {
        ActivityLog newInstance = new ActivityLog();
        newInstance.update(this);
        return newInstance;
    }
}
