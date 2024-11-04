import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";
import {BookService} from "../../../../services/services/book.service";
import {PageResponseBorrowedBookResponse} from "../../../../services/models/page-response-borrowed-book-response";
import {BorrowedBookResponse} from "../../../../services/models/borrowed-book-response";
import {FeedbackRequest} from "../../../../services/models/feedback-request";

@Component({
  selector: 'app-returned-books',
  templateUrl: './returned-books.component.html',
  styleUrl: './returned-books.component.scss'
})
export class ReturnedBooksComponent implements OnInit{

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private bookService: BookService,
  ) {
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.findAllReturnedBooks();
    }
  }

  returnedBooks: PageResponseBorrowedBookResponse = {};
  pages: any = [];
  page:number = 0;
  size:number = 10;
  message:string = '';
  level:string = '';


  private findAllReturnedBooks() {
    this.bookService.findAllReturnedBooks({
      page: this.page,
      size: this.size
    }).subscribe({
      next: (resp) => {
        this.returnedBooks = resp;
        this.pages = Array(this.returnedBooks.totalPages)
          .fill(0)
          .map((x, i) => i);
      }
    })
  }


  goToFirstPage() {
    this.page = 0;
    this.findAllReturnedBooks();
  }

  goToPreviousPage() {
    this.page--;
    this.findAllReturnedBooks();
  }

  goToPage(page: number) {
    this.page = page;
    this.findAllReturnedBooks();
  }

  goToNextPage() {
    this.page++;
    this.findAllReturnedBooks();
  }

  goToLastPage() {
    this.page = this.returnedBooks.totalPages as number -1;
    this.findAllReturnedBooks();
  }

  get isLastPage(): boolean {
    return this.page == this.returnedBooks.totalPages as number -1;
  }

  approveBookReturn(book: BorrowedBookResponse) {
    if (!book.returned) {
      this.level = 'error';
      this.message = "The book is not yet returned!";
      return;
    }
    this.bookService.approveReturnedBorrowedBook({
      'book-id': book.id as number
    }).subscribe({
      next: () => {
        this.level = 'success';
        this.message = "Book return approved";
        this.findAllReturnedBooks();
      },
      error: (err) => {
        console.log(err);
        this.level = 'error';
        this.message = err.error.error;
      }
    });
  }
}
