package com.mram.model.core;

import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

/**
 * @author Nimis
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "t_icon")
public class Icon extends BaseEntity implements GenericEntity<Icon> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;
    private String name;
    private String typeStr;
    private Long fileId;

    @ManyToOne
    @JoinColumn(name = "fileId",referencedColumnName="id",insertable=false,updatable=false)
    private AttFile icon;

    @Override
    public void update(Icon source) {
        this.name=source.name;
        this.typeStr=source.typeStr;
        this.fileId=source.fileId;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public Icon createNewInstance() {
        Icon newInstance = new Icon();
        newInstance.update(this);
        return newInstance;
    }
}
