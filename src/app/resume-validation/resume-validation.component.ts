import { Component, OnInit } from '@angular/core';
import { ResumeBuilderService } from '../services/resume-builder.service';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-resume-validation',
  templateUrl: './resume-validation.component.html',
  styleUrls: ['./resume-validation.component.css']
})
export class ResumeValidationComponent implements OnInit {

  public errors: string[] = [];
  constructor(
    private resumeBuilderService: ResumeBuilderService,
    public dialog: MatDialog
    ) { }

  ngOnInit() {
    this.resumeBuilderService.resumeValidationErros.subscribe((data: string[]) => {
      this.errors = data;
    });
  }

  public onClose() {
  this.dialog.closeAll();
  }

}
