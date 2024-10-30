

export class CreateCategoryDto{

    private constructor(
      public readonly name:string,
      public readonly availabe:boolean,  
    ){}


    static create ( object: {[key:string]:any}): [string?, CreateCategoryDto?]{

        const {name,available = false}= object;
        let availableBoolean= available;

        if (!name) return ['name is required!',undefined];

        if (typeof available !=='boolean') {
            availableBoolean=(available=='true')
        }

        return [undefined,new CreateCategoryDto(name,availableBoolean)];
    }

}