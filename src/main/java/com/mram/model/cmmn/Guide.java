package com.mram.model.cmmn;

import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import com.mram.model.core.AttFile;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "t_cmn_guide")
public class Guide extends BaseEntity implements GenericEntity<Guide> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;
    private String name;
    private String description;
    private String typeKey,subDt,code;
    private Long fileId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fileId",referencedColumnName="id",nullable = false,insertable=false,updatable=false)
    private AttFile file;

    @Override
    public void update(Guide source) {
        this.name=source.name;
        this.subDt=source.subDt;
        this.code=source.code;
        this.description=source.description;
        this.typeKey=source.typeKey;
        this.fileId=source.fileId;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public Guide createNewInstance() {
        Guide newInstance = new Guide();
        newInstance.update(this);
        return newInstance;
    }
}
