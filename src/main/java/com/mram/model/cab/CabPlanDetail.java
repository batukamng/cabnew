package com.mram.model.cab;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import com.mram.model.core.LutUser;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "tbl_plan_detail")
public class CabPlanDetail extends BaseEntity implements GenericEntity<CabPlanDetail> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;
    private Long objId;
    private Long parentId;
    private Long planId;
    private String title;
    private String objType;
    private String userType;
    private String eventType;
    private String targetStr;
    private String baseStr;
    private String srtDt;
    private String endDt;
    private String criteria;

    private Double baseline, firstHalf, secondHalf, rate, fulfillment;

    @Transient
    List<String> userArr=new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "tbl_plan_detail_users", joinColumns = @JoinColumn(name = "detail_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Collection<LutUser> users;

    @OneToMany(mappedBy = "detail", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<CabPlanCriteria> criterias;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "objId", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    private CabPlanObjective objective;

    @Override
    public void update(CabPlanDetail source) {
        this.objId = source.objId;
        this.planId = source.planId;
        this.baseline = source.baseline;
        this.firstHalf = source.firstHalf;
        this.secondHalf = source.secondHalf;
        this.rate = source.rate;
        this.fulfillment = source.fulfillment;
        this.parentId = source.parentId;
        this.objType = source.objType;
        this.eventType = source.eventType;
        this.userType = source.userType;
        this.title = source.title;
        this.targetStr = source.targetStr;
        this.criteria = source.criteria;
        this.baseStr = source.baseStr;
        this.srtDt = source.srtDt;
        this.endDt = source.endDt;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabPlanDetail createNewInstance() {
        CabPlanDetail newInstance = new CabPlanDetail();
        newInstance.update(this);
        return newInstance;
    }
}
