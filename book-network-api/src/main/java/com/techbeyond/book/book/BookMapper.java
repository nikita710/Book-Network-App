package com.techbeyond.book.book;


import com.techbeyond.book.file.FileUtils;
import com.techbeyond.book.history.BookTransactionHistory;
import org.springframework.stereotype.Service;

@Service
public class BookMapper {

    public Book bookRequestToBook(BookRequest bookRequest) {
        return Book.builder()
                .title(bookRequest.getTitle())
                .authorName(bookRequest.getAuthorName())
                .isbn(bookRequest.getIsbn())
                .synopsis(bookRequest.getSynopsis())
                .sharable(bookRequest.isSharable())
                .build();
    }

    public BookResponse bookToBookResponse(Book book) {
        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .authorName(book.getAuthorName())
                .isbn(book.getIsbn())
                .synopsis(book.getSynopsis())
                .rating(book.getRating())
                .archived(book.isArchived())
                .sharable(book.isSharable())
                .ownerName(book.getOwner().getFullName())
                .cover(FileUtils.readFileFromLocation(book.getBookCover()))
                .build();
    }

    public BorrowedBookResponse bookToBorrowedBookResponse(BookTransactionHistory history) {
        return BorrowedBookResponse.builder()
                .id(history.getBook().getId())
                .title(history.getBook().getTitle())
                .authorName(history.getBook().getAuthorName())
                .isbn(history.getBook().getIsbn())
                .rating(history.getBook().getRating())
                .returned(history.isReturned())
                .returnApproved(history.isReturnApproved())
                .build();

    }
}
