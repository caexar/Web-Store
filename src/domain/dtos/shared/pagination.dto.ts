


export class PaginationDto{

    private constructor(
        public readonly page:number,
        public readonly limit: number,
    ){}


    static create(page:number=1, limit: number=10):[string?,PaginationDto?]{

        if(isNaN(page) || isNaN(limit)) return ['page and limit must be numbers'];
        if (page <=0) return ['page must be grater than 0',undefined];
        if (limit <= 0) return [' limit must be grater that 0', undefined];
        
        return [undefined, new PaginationDto(limit,page)];
    }

}