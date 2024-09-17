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
@Table(name = "tbl_employee")
public class CabEmployee extends BaseEntity implements GenericEntity<CabEmployee> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)

    private Long id;
    private String code, familyName, lastName, firstName, gender, birthdate, birthPlace, maritalStatus, bloodGroup,
            regNo, passNo, forPassNo, EmdNo,
            nddNo, addr1, addr2, homePhone, mobilePhone, workPhone, workPhoneExt, fax, email, postAddress, contactName,
            contactPhone, withPicture, status,
            email2, contactName2, contactPhone2, isBlackListed, blackListReason, blackListedDate, isForeigner, linkedIn,
            facebook, twitter, isSpyOath,
            isGovernmentOath, isMilitaryOath, militaryOathDate, statusDate, punishmentLiftDate;
    private Long empId, birthCountryId, birthDivisionId, birthDistrictId, countryId, divisionId, districtId,
            nationalityId, socialOriginId, companyId,
            lastNameLength, contactId, relativeId, relativeId2, civilId;

    @Override
    public void update(CabEmployee source) {
        this.code = source.code;
        this.familyName = source.familyName;
        this.lastName = source.lastName;
        this.firstName = source.firstName;
        this.gender = source.gender;
        this.birthdate = source.birthdate;
        this.birthPlace = source.birthPlace;
        this.maritalStatus = source.maritalStatus;
        this.bloodGroup = source.bloodGroup;
        this.regNo = source.regNo;
        this.passNo = source.passNo;
        this.forPassNo = source.forPassNo;
        this.EmdNo = source.EmdNo;
        this.nddNo = source.nddNo;
        this.addr1 = source.addr1;
        this.addr2 = source.addr2;
        this.homePhone = source.homePhone;
        this.mobilePhone = source.mobilePhone;
        this.workPhone = source.workPhone;
        this.workPhoneExt = source.workPhoneExt;
        this.fax = source.fax;
        this.email = source.email;
        this.postAddress = source.postAddress;
        this.contactName = source.contactName;
        this.contactPhone = source.contactPhone;
        this.withPicture = source.withPicture;
        this.status = source.status;
        this.email2 = source.email2;
        this.contactName2 = source.contactName2;
        this.contactPhone2 = source.contactPhone2;
        this.isBlackListed = source.isBlackListed;
        this.blackListReason = source.blackListReason;
        this.blackListedDate = source.blackListedDate;
        this.isForeigner = source.isForeigner;
        this.linkedIn = source.linkedIn;
        this.facebook = source.facebook;
        this.twitter = source.twitter;
        this.isSpyOath = source.isSpyOath;
        this.isGovernmentOath = source.isGovernmentOath;
        this.isMilitaryOath = source.isMilitaryOath;
        this.militaryOathDate = source.militaryOathDate;
        this.statusDate = source.statusDate;
        this.punishmentLiftDate = source.punishmentLiftDate;
        this.empId = source.empId;
        this.birthCountryId = source.birthCountryId;
        this.birthDivisionId = source.birthDivisionId;
        this.birthDistrictId = source.birthDistrictId;
        this.countryId = source.countryId;
        this.divisionId = source.divisionId;
        this.districtId = source.districtId;
        this.nationalityId = source.nationalityId;
        this.socialOriginId = source.socialOriginId;
        this.companyId = source.companyId;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabEmployee createNewInstance() {
        CabEmployee newInstance = new CabEmployee();
        newInstance.update(this);
        return newInstance;
    }
}
