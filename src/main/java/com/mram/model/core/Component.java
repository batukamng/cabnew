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
@Table(name = "t_component")
public class Component extends BaseEntity implements GenericEntity<Component> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;
    private String name,html,js,url;
    private Long menuId,moduleId;

    @ManyToOne
    @JoinColumn(name = "menuId",referencedColumnName="id",insertable=false,updatable=false)
    private Menu menu;

    @ManyToOne
    @JoinColumn(name = "moduleId",referencedColumnName="id",insertable=false,updatable=false)
    private Module module;

/*    @ManyToOne
    @JoinColumn(name = "fileId",referencedColumnName="id",insertable=false,updatable=false)
    private LutAttFile icon;*/

    @Override
    public void update(Component source) {
        this.name=source.name;
        this.html=source.html;
        this.js=source.js;
        this.moduleId=source.moduleId;
        this.menuId=source.menuId;
        this.url=source.url;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public Component createNewInstance() {
        Component newInstance = new Component();
        newInstance.update(this);
        return newInstance;
    }
}
