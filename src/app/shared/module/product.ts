export interface Iproduct {
    title:string,
    category:string,
    description:string,
    image:string,
    price:number,
    rating:Irating,
    id:string
}



export interface Irating {
    count:number,
    rate:number
}


export interface Iproductres {
    [key:string] :Iproduct
}


export interface IproductData {
    action:string,
    product:Iproduct
}

