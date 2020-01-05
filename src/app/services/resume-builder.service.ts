import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResumeBuilderService {

  public resumeValidationErros = new BehaviorSubject<string[]>([]);
  constructor() { }
}
