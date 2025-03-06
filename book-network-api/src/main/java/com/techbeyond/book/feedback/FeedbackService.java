package com.techbeyond.book.feedback;

import com.techbeyond.book.book.Book;
import com.techbeyond.book.book.BookRepository;
import com.techbeyond.book.common.PageResponse;
import com.techbeyond.book.exception.OperationNotPermittedException;
import com.techbeyond.book.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@AllArgsConstructor
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;
    private final BookRepository bookRepository;
    private final FeedbackMapper feedbackMapper;

    public Integer save(FeedbackRequest feedbackRequest, Authentication connectedUser) {
        Book book = bookRepository.findById(feedbackRequest.bookId())
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + feedbackRequest.bookId()));

        if (book.isArchived() || !book.isSharable()) {
            throw new OperationNotPermittedException("You cannot give feedback for this book because it is archived or not shareable!");
        }

        User user = (User) connectedUser.getPrincipal();
        if (Objects.equals(book.getOwner().getId(), user.getId())) {
            throw new OperationNotPermittedException("You cannot give feedback for your own book!");
        }

        Feedback feedback = feedbackMapper.toFeedback(feedbackRequest);

        return feedbackRepository.save(feedback).getId();
    }

    public PageResponse<FeedbackResponse> findAllFeedbacksBooks(Integer bookId, int page, int size, Authentication connectedUser) {

        Pageable pageable = PageRequest.of(page, size);

        User user = (User) connectedUser.getPrincipal();

        Page<Feedback> feedbacks = feedbackRepository.findAllFeedbacksByBookId(bookId, pageable);
        List<FeedbackResponse> feedbackResponses = feedbacks.stream().map(f -> feedbackMapper.toFeedbackResponse(f, user.getId())).toList();

        return new PageResponse<>(
                feedbackResponses,
                feedbacks.getNumber(),
                feedbacks.getSize(),
                feedbacks.getTotalElements(),
                feedbacks.getTotalPages(),
                feedbacks.isFirst(),
                feedbacks.isLast()
        );
    }
}
