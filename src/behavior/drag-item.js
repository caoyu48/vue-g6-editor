import { merge, isString } from 'lodash';
import eventBus from "@/utils/eventBus";
const delegateStyle = {
  fill: '#F3F9FF',
  fillOpacity: 0.5,
  stroke: '#1890FF',
  strokeOpacity: 0.9,
  lineDash: [5, 5]
}
const body = document.body;

export default {
  isDrag: false,
  nodeEvent: null,
  getDefaultCfg() {
    return {
      updateEdge: true,
      delegate: true,
      delegateStyle: {}
    };
  },
  getEvents() {
    return {
      'node:mousedown': 'onMousedown',
      'mousemove': 'onMousemove',
      'mouseup': 'onMouseup',
      // 'node:dragstart': 'onDragStart',
      // 'node:drag': 'onDrag',
      // 'node:dragend': 'onDragEnd',
      'canvas:mouseleave': 'onOutOfRange'
    };
  },
  getNode(e) {
    if (!this.shouldBegin.call(this, e)) {
      return;
    }
    this.isDrag = true
    this.nodeEvent = e
    const { item } = e;
    const graph = this.graph;

    this.targets = [];

    // 获取所有选中的元素
    const nodes = graph.findAllByState('node', 'selected');

    const currentNodeId = item.get('id');

    // 当前拖动的节点是否是选中的节点
    const dragNodes = nodes.filter(node => {
      const nodeId = node.get('id');
      return currentNodeId === nodeId;
    });

    // 只拖动当前节点
    if (dragNodes.length === 0) {
      this.target = item;
    } else {
      // 拖动多个节点
      if (nodes.length > 1) {
        nodes.forEach(node => {
          this.targets.push(node);
        });
      } else {
        this.targets.push(item);
      }
    }

    this.origin = {
      x: e.x,
      y: e.y
    };

    this.point = {};
    this.originPoint = {};
  },
  onMousemove(e) {
   
    if (!this.origin) {
     this.getNode(e)
    }
    if(!this.isDrag){
      return
    }
    if (!this.get('shouldUpdate').call(this, e)) {
      return;
    }
    // 当targets中元素时，则说明拖动的是多个选中的元素
    if (this.targets&&this.targets.length > 0) {
      this._updateDelegate(e, this.nodeEvent);
    } else {
      // 只拖动单个元素
      this._update(this.target, e, this.nodeEvent, true);
    }
  },
  onMouseup(e) {
    if (this.shape) {
      this.shape.remove();
      this.shape = null;
    }

    if (this.target) {
      const delegateShape = this.target.get('delegateShape');
      if (delegateShape) {
        delegateShape.remove();
        this.target.set('delegateShape', null);
      }
    }

    if (this.targets&&this.targets.length > 0) {
      // 获取所有已经选中的节点
      this.targets.forEach(node => this._update(node, e));
    } else if (this.target) {
      // this._update(this.target, e);
      const origin = this.origin;
      const model = this.target.get('model');
      const nodeId = this.target.get('id');
      if (!this.point[nodeId]) {
        this.point[nodeId] = {
          x: model.x,
          y: model.y
        };
      }

      const x = e.x - origin.x + this.point[nodeId].x;
      const y = e.y - origin.y + this.point[nodeId].y;
      const data = {}
      data.item = this.target
      data.oldModel = this.origin
      data.newModel = { x, y }
      eventBus.$emit('updateItem', data)
    }
    this.point = {};
    this.origin = null;
    this.originPoint = {};
    if(this.targets)this.targets.length = 0;
    this.target = null;
    // 终止时需要判断此时是否在监听画布外的 mouseup 事件，若有则解绑
    const fn = this.fn;
    if (fn) {
      body.removeEventListener('mouseup', fn, false);
      this.fn = null;
    }
    this.isDrag = false
    this.nodeEvent = null
    this.graph.setMode('default')
  },
  // 若在拖拽时，鼠标移出画布区域，此时放开鼠标无法终止 drag 行为。在画布外监听 mouseup 事件，放开则终止
  onOutOfRange(e) {
    const self = this;
    if (this.origin) {
      const canvasElement = self.graph.get('canvas').get('el');
      const fn = ev => {
        if (ev.target !== canvasElement) {
          self.onDragEnd(e);
        }
      };
      this.fn = fn;
      body.addEventListener('mouseup', fn, false);
    }
  },
  _update(item, e, nodeEvent, force) {
    const origin = this.origin;
    const model = item.get('model');
    const nodeId = item.get('id');
    if (!this.point[nodeId]) {
      this.point[nodeId] = {
        x: model.x,
        y: model.y
      };
    }

    const x = e.x - origin.x + this.point[nodeId].x;
    const y = e.y - origin.y + this.point[nodeId].y;
    // 拖动单个未选中元素
    if (force) {
      this._updateDelegate(e, nodeEvent, x, y);
      return;
    }

    const pos = { x, y };

    if (this.get('updateEdge')) {
      this.graph.updateItem(item, pos);
    } else {
      item.updatePosition(pos);
      this.graph.paint();
    }
  },

  /**
   * 更新拖动元素时的delegate
   * @param {Event} e 事件句柄
   * @param {number} x 拖动单个元素时候的x坐标
   * @param {number} y 拖动单个元素时候的y坐标
   */
  _updateDelegate(e, nodeEvent, x, y) {
    const bbox = nodeEvent.item.get('keyShape').getBBox();
    if (!this.shape) {
      // 拖动多个
      const parent = this.graph.get('group');
      const attrs = merge({}, delegateStyle, this.delegateStyle);
      if (this.targets.length > 0) {
        const { x, y, width, height, minX, minY } = this.calculationGroupPosition();
        this.originPoint = { x, y, width, height, minX, minY };
        // model上的x, y是相对于图形中心的，delegateShape是g实例，x,y是绝对坐标
        this.shape = parent.addShape('rect', {
          attrs: {
            width,
            height,
            x,
            y,
            ...attrs
          }
        });
      } else if (this.target) {
        this.shape = parent.addShape('rect', {
          attrs: {
            width: bbox.width,
            height: bbox.height,
            x: x - bbox.width / 2,
            y: y - bbox.height / 2,
            ...attrs
          }
        });
        this.target.set('delegateShape', this.shape);
      }
      this.shape.set('capture', false);
    }

    if (this.targets.length > 0) {
      const clientX = e.x - this.origin.x + this.originPoint.minX;
      const clientY = e.y - this.origin.y + this.originPoint.minY;
      this.shape.attr({
        x: clientX,
        y: clientY
      });
    } else if (this.target) {
      this.shape.attr({
        x: x - bbox.width / 2,
        y: y - bbox.height / 2
      });
    }
    this.graph.paint();
  },
  /**
   * 计算delegate位置，包括左上角左边及宽度和高度
   * @memberof ItemGroup
   * @return {object} 计算出来的delegate坐标信息及宽高
   */
  calculationGroupPosition() {
    const graph = this.graph;

    const nodes = graph.findAllByState('node', 'selected');
    const minx = [];
    const maxx = [];
    const miny = [];
    const maxy = [];

    // 获取已节点的所有最大最小x y值
    for (const id of nodes) {
      const element = isString(id) ? graph.findById(id) : id;
      const bbox = element.getBBox();
      const { minX, minY, maxX, maxY } = bbox;
      minx.push(minX);
      miny.push(minY);
      maxx.push(maxX);
      maxy.push(maxY);
    }

    // 从上一步获取的数组中，筛选出最小和最大值
    const minX = Math.floor(Math.min(...minx));
    const maxX = Math.floor(Math.max(...maxx));
    const minY = Math.floor(Math.min(...miny));
    const maxY = Math.floor(Math.max(...maxy));

    const x = minX - 20;
    const y = minY + 10;
    const width = maxX - minX;
    const height = maxY - minY;

    return {
      x,
      y,
      width,
      height,
      minX,
      minY
    };
  }
};
