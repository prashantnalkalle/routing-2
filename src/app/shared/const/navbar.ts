import { Inav } from "../module/nav";

export const navbar :Inav[] =[
    {
        label:'Home',
        route:'home',
        roles:['admin','superAdmin','buyer']
    },
    {
        label:'Users',
        route:'users',
        roles:['admin','superAdmin']
    },
    {
        label:'Products',
        route:'products',
        roles:['admin','superAdmin','buyer']
    },
    {
        label:'Fairs',
        route:'fairs',
        roles:['superAdmin']
    }
]