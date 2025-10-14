import { Component, OnInit } from '@angular/core';
import { CommentService } from '../../service/comment.service';
import { CommentResponse } from '../../model/comment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment',
  imports: [CommonModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit {
  comment?: CommentResponse;
  skip = 0;
  limit = 340;

  constructor(private commentService: CommentService) {

  }
  ngOnInit(): void {
    console.log(this.comment);

  }

  getData() {
    this.commentService.getComment(this.limit, this.skip).subscribe(data => this.comment = data);
  }
}
