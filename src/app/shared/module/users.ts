export interface Iuser {
    name:string,
    email:string,
    role:string,
    description:string,
    imageUrl:string,
    skills:string[],
    permanentAddress:IAddress,
    currentAddress:IAddress,
    checkbox:boolean,
    age:number,
    id:string
}

export interface IAddress {
    country:string,
    state:string,
    city:string,
    zipcode:number
}


export interface IuserRes {
    [key:string] :Iuser
}

export interface Ires {
    name:string
}

export interface IuserData {
    action:string,
    user:Iuser
}


