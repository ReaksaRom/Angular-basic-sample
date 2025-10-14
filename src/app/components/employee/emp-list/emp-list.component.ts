import { Component, OnInit } from '@angular/core';
import { Employee } from '../../../model/employee';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../service/employee.service';
import { EmpCreateComponent } from "../emp-create/emp-create.component";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-emp-list',
  imports: [CommonModule, EmpCreateComponent],
  templateUrl: './emp-list.component.html',
  styleUrl: './emp-list.component.css'
})
export class EmpListComponent implements OnInit {
  employees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  message: string = '';

  constructor(private empService: EmployeeService, private toastr: ToastrService) { }

  ngOnInit() {
    this.empService.getEmployees().subscribe(data => this.employees = data);
    this.showMessage('');
  }

  edit(emp: Employee) {
    this.selectedEmployee = { ...emp };
  }

  delete(id: number) {
    this.empService.deleteEmployee(id);
    this.showMessage('Employee deleted successfully!');
  }

  handleSubmit(employee: Employee) {
    if (employee.id) {
      this.empService.updateEmployee(employee);
      this.showMessage('Employee updated successfully!');
    } else {
      this.empService.addEmployee(employee);
      this.showMessage('Employee added successfully!');
    }
    this.selectedEmployee = null;
  }
  showMessage(msg: string) {
    this.message = msg;
    setTimeout(() => this.message = '', 3000); // auto hide after 3 seconds
  }

}
