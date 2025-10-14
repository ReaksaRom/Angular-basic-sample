export interface Todos {
    id: number;
    todo: string;
    completed: boolean;
    userId: number;
}
export interface TodosResponse {
    todos: Todos[];
    total: number;
    skip: number;
    limit: number;
}