package com.mram.model.cmmn;

import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import com.mram.model.core.AttFile;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "t_cmn_splash")
public class Splash extends BaseEntity implements GenericEntity<Splash> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;
    private Long fileId, lvlId;
    private boolean flag;
    private String code,bannerType,fileType,srtDt,endDt,description,title,url,typeIds;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fileId", referencedColumnName = "id", insertable = false, updatable = false)
   // @JsonIgnore
    private AttFile image;

    @Override
    public void update(Splash source) {
        this.bannerType=source.bannerType;
        this.fileType=source.fileType;
        this.srtDt=source.srtDt;
        this.endDt=source.endDt;
        this.flag=source.flag;
        this.code=source.code;
        this.description=source.description;
        this.title=source.title;
        this.url=source.url;
        this.fileId=source.fileId;
        this.lvlId=source.lvlId;
        this.typeIds=source.typeIds;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public Splash createNewInstance() {
        Splash newInstance = new Splash();
        newInstance.update(this);
        return newInstance;
    }
}