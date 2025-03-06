package com.techbeyond.book.feedback;

import com.techbeyond.book.book.Book;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class FeedbackMapper {
    public Feedback toFeedback(FeedbackRequest request) {
        return Feedback.builder()
                .rating(request.rating())
                .comment(request.comment())
                .book(
                        Book.builder()
                                .id(request.bookId())
                                .build()
                )
                .build();
    }

    public FeedbackResponse toFeedbackResponse(Feedback feedback, Integer userId) {
        return FeedbackResponse.builder()
                .rating(feedback.getRating())
                .comment(feedback.getComment())
                .ownFeedback(Objects.equals(feedback.getCreatedBy(), String.valueOf(userId)))
                .build();
    }
}
