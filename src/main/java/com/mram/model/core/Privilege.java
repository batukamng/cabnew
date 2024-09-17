package com.mram.model.core;

import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import lombok.*;

import jakarta.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "t_privilege")
public class Privilege extends BaseEntity implements GenericEntity<Privilege> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;
    private static final long serialVersionUID = 1L;
    @Column(length = 60)
    private String name;
    private String shortName;
    private String description;

    @Override
    public void update(Privilege source) {
        this.name=source.name;
        this.shortName=source.shortName;
        this.description=source.description;
        this.setUseYn(source.getUseYn());
    }

    @Override
    public Privilege createNewInstance() {
        Privilege newInstance = new Privilege();
        newInstance.update(this);
        return newInstance;
    }
}
