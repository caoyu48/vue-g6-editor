class Node extends Object{
    constructor(params) {
        super()
        this.id = params.id

        for (let key in params) {
            this[key] = params[key]||0
        }
        this.size = params.size.split('*')
        this.parent = params.parent  // 所属组  
        this.index = params.index // 渲染层级 
    }
}
export default Node;