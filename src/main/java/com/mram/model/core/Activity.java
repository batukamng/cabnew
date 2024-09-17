package com.mram.model.core;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cascade;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "t_activity")
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", unique = true, nullable = false)
    private Long id;
    private Long userId;
    private String ip;
    private String expires;
    private String method;
    private String url;
    private String page;
    private String queryString;
    private String refererPage;
    private String userAgent;
    private LocalDateTime loggedTime;
    private boolean uniqueVisit;

/*    @OneToOne
    @JsonBackReference
    private LutUser user;*/

    private Long totalVisitors;
    @ElementCollection
    @CollectionTable(name = "activity_log_tags")
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
    private Set<String> tags;

    public enum Tag {
        ALL
    }

    public void addTag(Tag tag) {
        if (tags == null) tags = new HashSet<>();
        tags.add(tag.name());
    }

}
