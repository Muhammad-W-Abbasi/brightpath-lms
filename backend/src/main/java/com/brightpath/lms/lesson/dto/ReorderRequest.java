package com.brightpath.lms.lesson.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;
import java.util.UUID;

public class ReorderRequest {
    @NotEmpty
    private List<UUID> orderedIds;

    public List<UUID> getOrderedIds() {
        return orderedIds;
    }

    public void setOrderedIds(List<UUID> orderedIds) {
        this.orderedIds = orderedIds;
    }
}
