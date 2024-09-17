package com.mram.model.core;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.mram.model.audit.UserDateAudit;
import lombok.*;

import jakarta.persistence.*;
import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "t_labels")
public class Labels extends UserDateAudit implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;
    private static final long serialVersionUID = 1L;
    private String labelId;
    private String labelMg;
    private String labelEn;
    private String lang;
    private long langId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    @JoinColumn(name = "langId",referencedColumnName="id",nullable = false,insertable=false,updatable=false)
    private Language lutLanguage;

}
