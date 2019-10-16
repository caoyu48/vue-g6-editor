import eventBus from "@/utils/eventBus";
export default {
    getEvents() {
        return {
            'node:contextmenu': 'onContextmenu',
            'mousedown': 'onMousedown',
            'canvas:click':'onCanvasClick'
        };
    },
    onContextmenu(e) {
        eventBus.$emit('contextmenuClick',e)
    },
    onMousedown(e) {
        eventBus.$emit('mousedown',e)
    },
    onCanvasClick(e){
        eventBus.$emit('canvasClick',e)
    }

};
