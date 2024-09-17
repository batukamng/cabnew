package com.mram.model.cab;

import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "tbl_position")
public class CabDepartment extends BaseEntity implements GenericEntity<CabDepartment> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)

    private Long id;
    private String name,code,goal,characteristic,labourCondition,hrType,isActive;
    private Long companyId,depId,employmentTypeId,gradeId,jobDescId,jobId,positionOccId;
    private int vacancyDays;



    @Override
    public void update(CabDepartment source) {
        this.name=source.name;
        this.code=source.code;
        this.goal=source.goal;
        this.characteristic=source.characteristic;
        this.labourCondition=source.labourCondition;
        this.hrType=source.hrType;
        this.isActive=source.isActive;
        this.companyId=source.companyId;
        this.depId=source.depId;
        this.employmentTypeId=source.employmentTypeId;
        this.jobDescId=source.jobDescId;
        this.gradeId=source.gradeId;
        this.jobId=source.jobId;
        this.positionOccId=source.positionOccId;
        this.vacancyDays=source.vacancyDays;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabDepartment createNewInstance() {
        CabDepartment newInstance = new CabDepartment();
        newInstance.update(this);
        return newInstance;
    }
}
