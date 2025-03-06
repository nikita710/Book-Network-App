package com.techbeyond.book.book;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookResponse {

    private Integer id;
    private String title;
    private String authorName;
    private String isbn;
    private String synopsis;
    private byte[] cover;
    private double rating;
    private boolean archived;
    private boolean sharable;
    private String ownerName;


}
