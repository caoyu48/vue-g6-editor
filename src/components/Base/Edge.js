class Edge {
    constructor(id, source, target, controlPoints, sourceAnchor, targetAnchor, shape,style,label) {
        this.id = id
        this.source = source
        this.target = target
        this.controlPoints = controlPoints
        this.sourceAnchor = sourceAnchor
        this.targetAnchor = targetAnchor  
        this.shape = shape 
        this.style=style
        this.label=label
    }
}
export default Edge;