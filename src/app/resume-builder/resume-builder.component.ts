import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { Education } from '../models/educations';
import { FormArray } from '@angular/forms';
import { Resume } from '../models/resume';
import { MatDialog } from '@angular/material/dialog';
import { ResumeValidationComponent } from '../resume-validation/resume-validation.component';
import { ResumeBuilderService } from '../services/resume-builder.service';
import * as jsPDF from 'jspdf';
import kjua from 'kjua-svg';
import * as $ from 'jquery';
// import { autoTable } from 'jspdf-autotable';
import 'jspdf-autotable';
//  import jsPDF from 'jspdf';
import * as autoTable from 'jspdf-autotable';
import { config } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-resume-builder',
  templateUrl: './resume-builder.component.html',
  styleUrls: ['./resume-builder.component.css']
})
export class ResumeBuilderComponent implements OnInit {
  public educationRows: Education[] = [];
  public resumeForm: FormGroup;
  public courses = [ 'BE', 'ME', 'BCOM', 'MCOM'];
  public errors: string[] = [] ;
  public selectedFile: File;
  public base64ImageData = '';
  public displayQrCode: boolean;
  public qrCodeValue: string;
  public elementType: 'url' | 'canvas' | 'img' = 'url';
  @ViewChild('qrCodeCanvas', {static: false}) myCanvas: ElementRef;
  public context: CanvasRenderingContext2D;
  // public courses = Education;
  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public resumeBuilderService: ResumeBuilderService,
  ) {
    this.buidResumeForm();
   }

  ngOnInit() {
  }
private buidResumeForm() {
    this.resumeForm = this.formBuilder.group({
      Name: ['', [Validators.required]],
      ContactNumber: ['', [Validators.required]],
      Address: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.email]],
      SocialProfile: [''],
      OtherDetails: [''],
      Skills: this.formBuilder.array([]),
      Experience: this.formBuilder.array([]),
      Education: this.formBuilder.array([]),
    });
    this.onAddSkills();
    this.onAddExperience();
    this.onAddEducation();
  }

  onAddSkills() {
    this.skills.push(this.formBuilder.group({
      Skill: [''],
      Rating: ['']
    }));
  }

get skills() {
    return this.resumeForm.get('Skills') as FormArray;
  }

get experience() {
    return this.resumeForm.get('Experience') as FormArray;
  }

get educationItems() {
    return this.resumeForm.get('Education') as FormArray;
  }

onAddExperience() {
    this.experience.push(this.formBuilder.group({
      Employer: [''],
      JobTitle: [''],
      JobDescription: [''],
      ExperienceInMonth: [''],
     }));
  }

onAddEducation() {
    this.educationItems.push(this.buildEducationItems());
  }

  private isSkillsValid(data: Resume): boolean {
    if (data && data.Skills && data.Skills.length) {
      for (const skill of data.Skills) {
          if (skill.Rating && skill.Skill) {
            return true;
          }
      }
    }
    this.errors.push('please enter valid skills and rating');
    this.resumeBuilderService.resumeValidationErros.next(this.errors);
    this.displayAlert();
    return false;
  }

  private isEducationFieldsValid(data: Resume): boolean {
    if (data && data.Education && data.Education.length) {
      for (const edu of data.Education) {
          if (edu.Course && edu.School && edu.PassingYear && edu.Percentage) {
            return true;
          }
      }
    }
    this.errors.push('please enter valid education details');
    this.resumeBuilderService.resumeValidationErros.next(this.errors);
    this.displayAlert();
    return false;
  }

  public onPdf(data: Resume, choice: string) {
    this.errors = [];
    if (this.validateResumeDetails(data) && this.isSkillsValid(data) && this.isEducationFieldsValid(data)) {
      console.log(data);
      this.qrCodeValue = data.Name + data.ContactNumber;
      this.displayQrCode = true;
      const generatedDoc = this.buildResumeAsPDF(data);
      if (choice === 'open') {
       generatedDoc.output('dataurlnewwindow');
      } else {
       generatedDoc.save(data.Name);
      }
    }
  }

  public onReset() {
    this.resumeForm.reset();
  }

  public onFileChanged(event) {
    this.base64ImageData = '';
    this.selectedFile = event.target.files[0];
  }

  private buildEducationItems(): FormGroup {
    return this.formBuilder.group({
      Course: [''],
      School: [''],
      PassingYear: [''],
      Percentage: [''],
    });
  }

public onRemoveEducation(data: any) {
  if (this.educationItems.length > 1) {
    this.educationItems.removeAt(data);
  }
}

public onRemoveSkills(data: any) {
  if (this.skills.length > 1) {
    this.skills.removeAt(data);
  }
}

public onRemoveExperience(data: any) {
  if (this.experience.length > 1) {
    this.experience.removeAt(data);
  }
}

public onPercentageValidation() {
  const percentage = this.resumeForm.get('Percentage').value;
  if (percentage < 35 || percentage > 100) {
    this.resumeForm.get('Percentage').reset();
  }
}

private validateResumeDetails(data: Resume): boolean {
  if (this.resumeForm.invalid) {
    Object.keys(this.resumeForm.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.resumeForm.get(key).errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          // this.errors.push(' ' + key + ' ' + keyError + ' ' + controlErrors[keyError]); controlErrors[keyError] returns true
          this.errors.push(' ' + key + ' ' + keyError + ' ' );
        });
      }
    });
    this.resumeBuilderService.resumeValidationErros.next(this.errors);
    this.displayAlert();
    return false;
  }
  return true;
}


private displayAlert() {
  this.dialog.open(ResumeValidationComponent, {
    width: '500px',
  });
}

private getBase64Image(image) {
  if (image) {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      this.base64ImageData = reader.result as string;
    };
    reader.onerror = (error) => {
      this.errors.push('error in image loading');
    };
  }
}

private buildResumeAsPDF(data: Resume): jsPDF {
  // doc.text(); it takes 3 parameter
  // 1-text what you want to write
  // 2- x -indicates starting position of text (middle of the line - 80 , starting of the line - 0) --> Horizantal position
  // 3- y - indicates starting line of the text (begging of the page 10) --> vertical position
  // in otherwords x and y's are like css padding
    const doc = new jsPDF();
    let pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(22);
    doc.text('RESUME', 80, 20);
    doc.setFontSize(16);
    doc.text(10, 40, data.Name);
    doc.setFontSize(14);
    doc.text(data.Name, 10, 45);
    doc.text('Email : ' + data.Email, 10, 50);
    doc.text('Contact No: ' + data.ContactNumber, 10, 55);
    if (this.selectedFile) {
      const imageData = this.getBase64Image(this.selectedFile);
      doc.addImage(this.base64ImageData, 'JPEG', 150, 40, 40, 40);
    }
    doc.setFontSize(16);
    doc.setFont('arial', 'bold');
    doc.text('Skills with Rating' , 10, 70);
    doc.setFontSize(14);
    doc.setFont('italic', 'normal');
    let skillsLineNumbers = 80;
    for (const skill of data.Skills) {
      doc.text('\u2022' + '  ' + skill.Skill + '      ' + skill.Rating + '/5', 10, skillsLineNumbers);
      if (skillsLineNumbers >= pageHeight) {
        doc.addPage();
        skillsLineNumbers = 20;
      }
      skillsLineNumbers = skillsLineNumbers + 10;
    }
    let experienceLineNumbers = skillsLineNumbers + 10;
    doc.setFontSize(16);
    doc.setFont('arial', 'bold');
    doc.text('Experience' , 10, experienceLineNumbers);
    doc.setFontSize(14);
    doc.setFont('italic', 'normal');
    for (const experience of data.Experience) {
      experienceLineNumbers = experienceLineNumbers + 10;
      if (experienceLineNumbers >= pageHeight) {
        doc.addPage();
        experienceLineNumbers = 20;
      }
      doc.rect(10, experienceLineNumbers, 185, 35);
      experienceLineNumbers = experienceLineNumbers + 10;
      // tslint:disable-next-line:max-line-length
      doc.text(experience.JobTitle + '                                                                 ' + 'Experience in months: ' + experience.ExperienceInMonth , 15, experienceLineNumbers);
      experienceLineNumbers = experienceLineNumbers + 10;
      doc.text(experience.Employer, 15, experienceLineNumbers);
      experienceLineNumbers = experienceLineNumbers + 10;
      doc.text(experience.JobDescription, 15, experienceLineNumbers);
    }
    let educationLineNumbers = experienceLineNumbers + 20;
    doc.setFontSize(16);
    doc.setFont('arial', 'bold');
    if (educationLineNumbers >= pageHeight) {
      doc.addPage();
      educationLineNumbers = 20;
    }
    doc.text('Education' , 10, educationLineNumbers);
    doc.setFontSize(14);
    doc.setFont('italic', 'normal');
    const columns = ['Course', 'School/College', 'Passing Year', 'Result'];
    educationLineNumbers = educationLineNumbers + 10;
    if (educationLineNumbers >= pageHeight) {
      doc.addPage();
      educationLineNumbers = 20;
    }
    doc.text('     Course    ' + '      School/College     ' + '     Passing Year    ' +  '     Result   ', 20, educationLineNumbers);
    for (const education of data.Education) {
    educationLineNumbers = educationLineNumbers + 10;
    const edu = new Education();
    edu.Course = education.Course;
    edu.PassingYear = education.PassingYear;
    edu.Percentage = education.PassingYear;
    edu.School = education.School;
    this.educationRows.push(edu);
    if (educationLineNumbers >= pageHeight) {
      doc.addPage();
      educationLineNumbers = 20;
    }
    doc.text( education.Course + '           ' + education.School + '          ' + education.PassingYear + '          '
    + education.Percentage, 30, educationLineNumbers);
    }
  //   const rows = [
  //     [1, "Shaw", "Tanzania"],
  //     [2, "Nelson", "Kazakhstan"],
  //     [3, "Garcia", "Madagascar"],
  // ];
  //   doc.autoTable({
  //   });
   // doc.addPage();
    const styles = {
      autoSize: true,
      printHeaders: false,
      columnWidths: 80
    };
    // doc.table(10, 20, ['d1', 'd2'], ['1', '2'], styles );
    let otherDetailsLineNumbers = educationLineNumbers + 20;
    doc.setFontSize(16);
    doc.setFont('arial', 'bold');
    if (otherDetailsLineNumbers >= pageHeight) {
      pageHeight = doc.internal.pageSize.height;
      doc.addPage();
      otherDetailsLineNumbers = 20;
    }
    doc.text('Other Details' , 10, otherDetailsLineNumbers);
    doc.setFont('italic', 'normal');
    doc.setFontSize(14);
    otherDetailsLineNumbers = otherDetailsLineNumbers + 10;
    const splitData = doc.splitTextToSize(data.OtherDetails, 180);
    if (otherDetailsLineNumbers >= pageHeight) {
      doc.addPage();
      otherDetailsLineNumbers = 20;
    }
    doc.text(splitData, 10, otherDetailsLineNumbers);
    otherDetailsLineNumbers = otherDetailsLineNumbers + 10;
    if (otherDetailsLineNumbers >= pageHeight) {
      doc.addPage();
      otherDetailsLineNumbers = 20;
    }
    doc.text('Signature', 140, otherDetailsLineNumbers + 30);
    doc.text('(' + data.Name + ')', 145, otherDetailsLineNumbers + 35);
    const barCodeData = this.getBarcodeData(data.Name + data.ContactNumber);
    doc.addImage(barCodeData, 'JPG', 20, otherDetailsLineNumbers + 10, 40, 40);
    // doc.output('dataurlnewwindow'); // works ok but opening in new tab
    return doc;
}

drop(event: CdkDragDrop<string[]>) {
  moveItemInArray(this.skills, event.previousIndex, event.currentIndex);
}

private getBarcodeData(text: string, sizeOfQr = 900) {
  return kjua({
    render: 'canvas',
    crisp: true,
    minVersion: 1,
    ecLevel: 'Q',
    size: sizeOfQr,
    ratio: undefined,
    fill: '#333',
    back: '#fff',
    text,
    rounded: 10,
    quiet: 2,
    mode: 'label',
    mSize: 5,
    mPosX: 50,
    mPosY: 100,
    label: 'scan this code',
    fontname: 'sans-serif',
    fontcolor: '#3F51B5',
    image: undefined
  });
}

}

