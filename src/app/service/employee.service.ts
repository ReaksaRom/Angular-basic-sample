import { Injectable } from '@angular/core';
import { Employee } from '../model/employee';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees: Employee[] = [
    {
      id: 1,
      code: 'EMP001',
      name: 'John Doe',
      position: 'Manager',
      dob: '1990-01-01',
      gender: 'Male',
      status: 'FullTime',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?cs=srgb&dl=pexels-italo-melo-881954-2379004.jpg&fm=jpg'
    },
    {
      id: 2,
      code: 'EMP002',
      name: 'Jane Smith',
      position: 'Accountant',
      dob: '1995-05-12',
      gender: 'Female',
      status: 'PartTime',
      image: 'https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg'
    }
  ];

  private empSubject = new BehaviorSubject<Employee[]>(this.employees);
  employees$ = this.empSubject.asObservable();

  constructor() { }

  getEmployees(): Observable<Employee[]> {
    return this.employees$;
  }

  addEmployee(employee: Employee): Observable<Employee> {
    employee.id = this.employees.length + 1;
    this.employees.push(employee);
    this.empSubject.next(this.employees);
    return of(employee); // ✅ returns observable
  }

  updateEmployee(updated: Employee): Observable<Employee> {
    const index = this.employees.findIndex(e => e.id === updated.id);
    if (index !== -1) {
      this.employees[index] = updated;
      this.empSubject.next(this.employees);
    }
    return of(updated); // ✅ returns observable
  }

  deleteEmployee(id: number): Observable<boolean> {
    this.employees = this.employees.filter(e => e.id !== id);
    this.empSubject.next(this.employees);
    return of(true); // ✅ return observable so `.subscribe()` works
  }
}
