package com.mram.model.core;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.mram.model.audit.UserDateAudit;
import lombok.*;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "t_lang")
public class Language extends UserDateAudit implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;
    private static final long serialVersionUID = 1L;
    private String name;
    private String abbr;
    private String icon;

    @OneToMany(mappedBy="lutLanguage", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonBackReference
    private List<Labels> lutLabels;
}
