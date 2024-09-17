package com.mram.model.cmmn;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mram.base.entity.BaseEntity;
import com.mram.base.entity.GenericEntity;
import com.mram.model.core.AttFile;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.sql.Timestamp;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "t_feedback")
public class Feedback extends BaseEntity implements GenericEntity<Feedback> {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name="id", unique = true, nullable = false)
  private Long id;

  private Long typeId, status;
  private String senderData, senderPhone, senderName;
  private String replyData;
  private Timestamp replyDate;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "typeId", referencedColumnName = "id", insertable = false, updatable = false)
  private CommonCd feedType;

  @Transient
  private List<Long> filesArr;

  @ManyToMany
  @JoinTable(
          name = "T_FEEDBACK_FILE",
          joinColumns = @JoinColumn(
                  name = "feed_id", referencedColumnName = "id"),
          inverseJoinColumns = @JoinColumn(
                  name = "file_id", referencedColumnName = "id"))
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JsonIgnoreProperties({"lutUser","roles"})
  private List<AttFile> fileList;

  @Override
  public void update(Feedback source) {
    this.typeId=source.typeId;
    this.status=source.status;
    this.senderData=source.senderData;
    this.senderPhone=source.senderPhone;
    this.senderName=source.senderName;
    this.replyData=source.replyData;
    this.replyDate=source.replyDate;
    this.fileList=source.fileList;
    this.setUseYn(source.getUseYn());
  }

  @Override
  public Feedback createNewInstance() {
    Feedback newInstance = new Feedback();
    newInstance.update(this);
    return newInstance;
  }

}
