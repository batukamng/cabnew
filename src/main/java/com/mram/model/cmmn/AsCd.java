package com.mram.model.cmmn;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import com.mram.model.core.AttFile;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * @author Nimis
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "t_cmn_as_cd")
public class AsCd extends BaseEntity implements GenericEntity<AsCd> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;
    private String asCd;
    private String staCode;
    private String cdNm;
    private String cdNmEng;
    private Long parentId;
    private String center, icon;

    private Double longitude;
    private Double latitude;

    private Long imageId, isCenter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "imageId", referencedColumnName = "id", insertable = false, updatable = false)
    private AttFile image;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parentId", referencedColumnName = "id", insertable = false, updatable = false)
    private AsCd tpAsCd;

    @OneToMany(mappedBy = "tpAsCd", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<AsCd> tpAsCds;

    @Override
    public void update(AsCd source) {
        this.asCd=source.asCd;
        this.staCode=source.staCode;
        this.imageId=source.imageId;
        this.cdNm=source.cdNm;
        this.cdNmEng=source.cdNmEng;
        this.center=source.center;
        this.parentId=source.parentId;
        this.isCenter=source.isCenter;
        this.longitude=source.longitude;
        this.latitude=source.latitude;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public AsCd createNewInstance() {
        AsCd newInstance = new AsCd();
        newInstance.update(this);
        return newInstance;
    }
}
