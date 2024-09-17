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
@Table(name = "t_module")
public class Module extends BaseEntity implements GenericEntity<Module> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;
    private String name;
    private Long fileId;
    private int orderId;

    @ManyToOne
    @JoinColumn(name = "fileId",referencedColumnName="id",insertable=false,updatable=false)
    private AttFile icon;

    @Override
    public void update(Module source) {
        this.name=source.name;
        this.fileId=source.fileId;
        this.orderId=source.orderId;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public Module createNewInstance() {
        Module newInstance = new Module();
        newInstance.update(this);
        return newInstance;
    }
}
