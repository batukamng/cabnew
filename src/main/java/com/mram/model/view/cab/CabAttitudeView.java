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
@Subselect("SELECT t.*, r.`name` as org_nm,u.`name` as user_nm from tbl_attitude t, t_organization r, v_user u where t.org_id=r.id and t.user_id=u.id")
public class CabAttitudeView extends BaseEntity {
    @Id
    private Long id;
    private Long orgId;
    private Long userId;
    private Long evalUserId;
    private String research;
    private String typeStr;
    private String planYr;
    private String typeScr;
    private Double solving, responsibility, attitude, hourUse,teamwork,leadVal,comVal;
    private String userNm,orgNm;

}