package com.mram.model.audit;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serializable;
import java.util.Date;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties(
        value = {"regAt", "modAt"},
        allowGetters = true
)
public abstract class DateAudit implements Serializable {

  //  @Column(columnDefinition = "DATETIME COMMENT 'Create date'")
    @CreatedDate
    @Column(updatable = false)
    @JsonFormat(pattern="dd/MM/yyyy HH:mm",timezone = "GMT+08:00")
    private Date regDtm;

  // @Column(columnDefinition = "DATETIME COMMENT 'Modified date'")
    @LastModifiedDate
    @JsonFormat(pattern="dd/MM/yyyy HH:mm",timezone = "GMT+08:00")
    private Date modDtm;

    public Date getRegDtm() {
        return regDtm;
    }

    public void setRegDtm(Date regDtm) {
        this.regDtm = regDtm;
    }

    public Date getModDtm() {
        return modDtm;
    }

    public void setModDtm(Date modDtm) {
        this.modDtm = modDtm;
    }
}
