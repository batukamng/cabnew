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
@Subselect("select va.* from (select e.* from tbl_plan_objective e, tbl_plan t where t.id=e.plan_id) va")
public class CabPlanObjectiveUserView extends BaseEntity {
    @Id
    private Long id;
    private Long planId;
    private Long userId;
    private String title;
    private String objType;
}
