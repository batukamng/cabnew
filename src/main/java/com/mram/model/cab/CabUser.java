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
@Table(name = "tbl_user")
public class CabUser extends BaseEntity implements GenericEntity<CabUser> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)

    private Long id;
    private String name, descr, password, expirationDate, isActive, lastLoginDate, isLocked, lockedDate, generateDate,
            passwordDate, invalidCounter,
            refreshToken, refreshTokenExpireAt, email, dataFilter, status;
    private Long userId, empId, roleId, licenseId, companyId;

    @Override
    public void update(CabUser source) {
        this.name = source.name;
        this.descr = source.descr;
        this.password = source.password;
        this.expirationDate = source.expirationDate;
        this.isActive = source.isActive;
        this.lastLoginDate = source.lastLoginDate;
        this.isLocked = source.isLocked;
        this.lockedDate = source.lockedDate;
        this.generateDate = source.generateDate;
        this.passwordDate = source.passwordDate;
        this.invalidCounter = source.invalidCounter;
        this.refreshToken = source.refreshToken;
        this.refreshTokenExpireAt = source.refreshTokenExpireAt;
        this.email = source.email;
        this.dataFilter = source.dataFilter;
        this.status = source.status;
        this.userId = source.userId;
        this.empId = source.empId;
        this.roleId = source.roleId;
        this.licenseId = source.licenseId;
        this.companyId = source.companyId;

        this.setUseYn(source.getUseYn());
    }

    @Override
    public CabUser createNewInstance() {
        CabUser newInstance = new CabUser();
        newInstance.update(this);
        return newInstance;
    }
}
