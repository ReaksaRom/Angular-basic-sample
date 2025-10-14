export interface Employee {
    id?: number;
    image?: string;
    code: string;
    name: string;
    position: string;
    dob: string;
    gender: 'Male' | 'Female';
    status: 'FullTime' | 'PartTime';

}
