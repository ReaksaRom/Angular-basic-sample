import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Employee } from '../../../model/employee';

@Component({
  selector: 'app-emp-create',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './emp-create.component.html',
  styleUrl: './emp-create.component.css'
})
export class EmpCreateComponent implements OnChanges {
  @Input() employee: Employee | null = null;
  @Output() formSubmit = new EventEmitter<Employee>();

  formData: Employee = {
    code: '',
    name: '',
    position: '',
    dob: '',
    gender: 'Male',
    status: 'FullTime'
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['employee'] && this.employee) {
      this.formData = { ...this.employee };
    } else {
      this.resetForm();
    }
  }

  onSubmit() {
    this.formSubmit.emit(this.formData);
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      code: '',
      name: '',
      position: '',
      dob: '',
      gender: 'Male',
      status: 'FullTime'
    };
  }

}
