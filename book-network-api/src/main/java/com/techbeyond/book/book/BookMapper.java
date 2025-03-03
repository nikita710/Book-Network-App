package com.techbeyond.book.book;


import org.springframework.stereotype.Service;

@Service
public class BookMapper {

    public Book bookRequestToBook(BookRequest bookRequest) {
        return Book.builder()
                .title(bookRequest.title())
                .authorName(bookRequest.authorName())
                .isbn(bookRequest.isbn())
                .synopsis(bookRequest.synopsis())
                .build();
    }
}
