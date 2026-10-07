package com.campusconnect.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventFeedbackRequest {

    private Integer question1Rating;
    private Integer question2Rating;
    private Integer question3Rating;
    private Integer question4Rating;
    private Integer question5Rating;
    private Integer question6Rating;
    private Integer question7Rating;
    private Integer question8Rating;
    private Integer question9Rating;
    private Integer question10Rating;

    private String description;
}