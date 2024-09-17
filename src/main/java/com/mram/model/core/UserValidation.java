package com.mram.model.core;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mram.model.audit.UserDateAudit;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "t_user_validation")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class UserValidation extends UserDateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;
    private static final long serialVersionUID = 1L;
    private String email;
    private String phone;
    private String code;
    private Long userId;
}