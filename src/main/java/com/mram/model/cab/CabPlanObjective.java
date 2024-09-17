package com.mram.model.cab;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "tbl_plan_objective")
public class CabPlanObjective extends BaseEntity implements GenericEntity<CabPlanObjective> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;
    private Long planId;
    private Long userId;
    private String title;
    private String objType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "planId", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    private CabPlan cabPlan;

    /*@Transient
    List<String> userArr=new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "tbl_plan_users", joinColumns = @JoinColumn(name = "obj_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Collection<LutUser> users;*/

    @OneToMany(mappedBy = "objective", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<CabPlanDetail> details;



    @Override
    public void update(CabPlanObjective source) {
        this.planId = source.planId;
        this.title = source.title;
        this.userId = source.userId;
      //  this.users = source.users;
        this.objType = source.objType;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabPlanObjective createNewInstance() {
        CabPlanObjective newInstance = new CabPlanObjective();
        newInstance.update(this);
        return newInstance;
    }
}
