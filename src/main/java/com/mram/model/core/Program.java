package com.mram.model.core;

import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "t_program")
public class Program extends BaseEntity implements GenericEntity<Program> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;

    private String name;
    private String url;
    private String method;
    private int menuUseAt=0;
    private Long menuId;
    private Long privilegeId;


    @Override
    public void update(Program source) {
        this.name = source.name;
        this.menuId = source.menuId;
        this.privilegeId = source.privilegeId;
        this.menuUseAt = source.menuUseAt;
        this.url = source.url;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public Program createNewInstance() {
        Program newInstance = new Program();
        newInstance.update(this);
        return newInstance;
    }

}
