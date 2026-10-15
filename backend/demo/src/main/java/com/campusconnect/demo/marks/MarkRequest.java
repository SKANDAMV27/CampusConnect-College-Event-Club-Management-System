package com.campusconnect.demo.marks;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record MarkRequest(

        @NotNull
        Long studentId,

        @NotBlank
        @Size(max = 20)
        String semester,

        @NotBlank
        @Size(max = 20)
        String academicYear,

        @NotBlank
        @Size(max = 40)
        String examType,

        @NotBlank
        @Size(max = 30)
        String subjectCode,

        @NotBlank
        @Size(max = 120)
        String subjectName,

        @NotNull
        @Min(0)
        Integer internalMarks,

        @NotNull
        @Min(1)
        Integer internalMaxMarks,

        @NotNull
        @Min(0)
        Integer externalMarks,

        @NotNull
        @Min(1)
        Integer externalMaxMarks,

        @Size(max = 500)
        String remarks

) {}