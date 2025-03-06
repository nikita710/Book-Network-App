package com.techbeyond.book.book;

import com.techbeyond.book.common.BaseEntity;
import com.techbeyond.book.feedback.Feedback;
import com.techbeyond.book.history.BookTransactionHistory;
import com.techbeyond.book.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Book extends BaseEntity {

    private String title;
    private String authorName;
    private String isbn;
    private String synopsis;
    private String bookCover;
    private boolean archived;
    private boolean sharable;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToMany(mappedBy = "book")
    private List<Feedback> feedbackList;

    @OneToMany(mappedBy = "book")
    private List<BookTransactionHistory> bookTransactionHistoryList;

    public double getRating() {
        if (feedbackList == null || feedbackList.isEmpty()) {
            return 0.0;
        }
        double rate = feedbackList.stream().mapToDouble(Feedback::getRating).average().orElse(0.0);
        return Math.round(rate * 10.0) / 10.0;
    }

}
