import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {BookRequest} from "../../../../services/models/book-request";
import {BookService} from "../../../../services/services/book.service";
import {ActivatedRoute, Router} from "@angular/router";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-manage-book',
  templateUrl: './manage-book.component.html',
  styleUrl: './manage-book.component.scss'
})
export class ManageBookComponent implements OnInit{

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private  activatedRoute: ActivatedRoute,
    private bookService: BookService,
  ) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const bookId = this.activatedRoute.snapshot.params['bookId'];
      if(bookId) {
        this.bookService.findBookById({
          'book-id': bookId,
        }).subscribe({
          next: (book) => {
            this.bookRequest = {
              id: book.id,
              title: book.title as string,
              authorName: book.authorName as string,
              isbn: book.isbn as string,
              synopsis: book.synopsis as string,
              isShareable: book.shareable,
            }
            if (book.cover) {
              this.selectedPicture = 'data:image/jpg;base64,' + book.cover;
            } else {
              this.selectedPicture = 'https://images.pexels.com/photos/1989704/pexels-photo-1989704.jpeg?auto=compress&cs=tinysrgb&w=600';
            }
          }
        })
      }
    }
    }

  bookRequest: BookRequest = {
    authorName: '',
    isbn: '',
    synopsis: '',
    title: ''
  };
  errorMsg: Array<string> = [];
  selectedPicture: string | undefined;
  selectedBookCover: any;

  onFileSelected(event: any) {
    this.selectedBookCover = event.target.files[0];
    console.log(this.selectedBookCover);
    if (this.selectedBookCover) {
      const reader: FileReader = new FileReader();
      reader.onload = () => {
        this.selectedPicture = reader.result as string;
      }
      reader.readAsDataURL(this.selectedBookCover);
    }
  }

  saveBook() {
    this.bookService.saveBook({
      body: this.bookRequest
    }).subscribe({
      next: (bookId) => {
        this.bookService.uploadBookCoverPicture({
          'book-id': bookId,
          body: {
            file: this.selectedBookCover
          }
        }).subscribe({
          next: () => {
            this.router.navigate(['/books/my-books']);
          }
        })
      },
      error: (err) => {
        this.errorMsg = err.error.validationErrors;
      }
    });
  }
}
