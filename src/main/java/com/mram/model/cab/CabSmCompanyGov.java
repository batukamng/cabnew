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
@Table(name = "tbl_sm_company_gov")
public class CabSmCompanyGov extends BaseEntity implements GenericEntity<CabSmCompanyGov> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)

    private Long id;
    private String registerNo, registeredDate, stateFundAcc, socialInsuranceAcc, taxAcc;
    private Long companyId, economicTypeId, govFormId, subGovFormId, equityTypeId, budgetFinancingId, budgetGovernerId,
            govRelCouncilId,
            userId, firstSignId, secondSignId, countryId, divisionId, districtId, sectionId, courtTypeId,
            subCourtTypeId, staffLimit, isUseReport,
            isCountry, isActive, staffLimitDate, staffLimitName;

    @Override
    public void update(CabSmCompanyGov source) {
        this.registerNo = source.registerNo;
        this.registeredDate = source.registeredDate;
        this.stateFundAcc = source.stateFundAcc;
        this.socialInsuranceAcc = source.socialInsuranceAcc;
        this.taxAcc = source.taxAcc;
        this.companyId = source.companyId;
        this.economicTypeId = source.economicTypeId;
        this.govFormId = source.govFormId;
        this.subGovFormId = source.subGovFormId;
        this.equityTypeId = source.equityTypeId;
        this.budgetFinancingId = source.budgetFinancingId;
        this.budgetGovernerId = source.budgetGovernerId;
        this.govRelCouncilId = source.govRelCouncilId;
        this.userId = source.userId;
        this.firstSignId = source.firstSignId;
        this.secondSignId = source.secondSignId;
        this.countryId = source.countryId;
        this.divisionId = source.divisionId;
        this.districtId = source.districtId;
        this.sectionId = source.sectionId;
        this.courtTypeId = source.courtTypeId;
        this.subCourtTypeId = source.subCourtTypeId;
        this.staffLimit = source.staffLimit;
        this.isUseReport = source.isUseReport;
        this.isCountry = source.isCountry;
        this.isActive = source.isActive;
        this.staffLimitDate = source.staffLimitDate;
        this.staffLimitName = source.staffLimitName;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabSmCompanyGov createNewInstance() {
        CabSmCompanyGov newInstance = new CabSmCompanyGov();
        newInstance.update(this);
        return newInstance;
    }
}
