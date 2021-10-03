let obj = {
    a:true
    b:true
}
//代理物件來執行事情 因為不是操作原本物件因此可以做額外的事情 也可視為代理
let objProxy = new Proxy(obj,{
    get(target, key){
        console.log(target, key)
        return target[key]
    },
    set(target, key , value){
        console.log(key, value)
        target[key] = value
    }
})

//以下在console執行

//objProxy.a = false
//a false 顯示

//objProxy.c = false
//c false 顯示

//obj
//{a: false b:true c:false} 顯示

//objProxy.c
//{a: false ,b: true,c: false}'c' 顯示
//false 顯示