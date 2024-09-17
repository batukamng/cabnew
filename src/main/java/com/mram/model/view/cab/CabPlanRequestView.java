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
@Subselect("SELECT va.*, u.name FROM tbl_plan_request va, v_user u where u.id=va.user_id")
public class CabPlanRequestView extends BaseEntity {
    @Id
    private Long id;
    private Long detId;
    private Long planId;
    private Long userId;
    private String title;
    private String name;
    private String responseType;
    private String answer;

}