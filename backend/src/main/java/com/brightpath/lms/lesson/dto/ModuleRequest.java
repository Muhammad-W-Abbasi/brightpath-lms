package com.brightpath.lms.lesson.dto;

import com.brightpath.lms.lesson.ContentStatus;
import jakarta.validation.constraints.Size;

public class ModuleRequest implements ContentStatusRequest {
    @Size(max = 200)
    private String title;

    private String description;

    private Integer sortOrder;

    private ContentStatus status;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    @Override
    public ContentStatus getStatus() {
        return status;
    }

    public void setStatus(ContentStatus status) {
        this.status = status;
    }
}
