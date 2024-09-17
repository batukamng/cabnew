package com.mram.model.core;

import com.fasterxml.jackson.annotation.*;
import com.mram.model.audit.UserDateAudit;
import jakarta.persistence.*;
import lombok.*;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "t_att_file")
public class AttFile extends UserDateAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;
    private String name;
    private String filePath;
    private String fileSaveNm;
    private String mimeType;
    private String uri;
    private String location;
    private double fileSize;
    private String fileType;
    @Column(name = "f_type")
    private String type;
    @Column(name = "f_size")
    private double size;

  //  private int proType;

/*    @ManyToOne
    @JoinColumn(name = "regId", referencedColumnName = "id", insertable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private LutUser lutUser;*/

}
