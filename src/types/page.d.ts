
    export interface Page<T> {
        records:T[];
        total:number;
        current:number;
        pageSize:number;
    }
