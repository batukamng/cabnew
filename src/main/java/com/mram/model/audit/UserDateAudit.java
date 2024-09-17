package com.mram.model.audit;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;


@MappedSuperclass
@JsonIgnoreProperties(
        value = {"regId", "modId"},
        allowGetters = true
)
public abstract class UserDateAudit extends DateAudit {

    @CreatedBy
    @Column(updatable = false)
  //  @Column(columnDefinition = "LONG COMMENT 'Register user ID'")
    private Long regId;

    @LastModifiedBy
//    @Column(columnDefinition = "LONG COMMENT 'Modified user ID'")
    private Long modId;

    //@Column(columnDefinition = "boolean default true")
    private int useYn;

    public Long getRegId() {
        return regId;
    }

    public void setRegId(Long regId) {
        this.regId = regId;
    }

    public Long getModId() {
        return modId;
    }

    public void setModId(Long modId) {
        this.modId = modId;
    }

    public int isUseYn() {
        return useYn;
    }

    public void setUseYn(int useYn) {
        this.useYn = useYn;
    }
}
