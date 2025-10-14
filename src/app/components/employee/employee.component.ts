import { Component } from '@angular/core';
import { EmpListComponent } from "./emp-list/emp-list.component";

@Component({
  selector: 'app-employee',
  imports: [EmpListComponent],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {

}
