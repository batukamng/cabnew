package com.mram.service.core;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Accessors;

import java.io.Serializable;

@Accessors(chain = true)
@NoArgsConstructor
@Getter
@Setter
@ToString
public class PaginatedResult implements Serializable {

    private static final long serialVersionUID = 6191745064790884707L;
    private int currentPage; // Current page number
    private long total; // Number of total Pages
    private Object data; // Paginated resources
    private Object aggregate;

}
