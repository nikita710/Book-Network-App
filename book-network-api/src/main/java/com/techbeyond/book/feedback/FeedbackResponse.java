package com.techbeyond.book.feedback;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackResponse {

    private Double rating;
    private String comment;

    private boolean ownFeedback;
}
