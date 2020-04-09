import { uniqueId } from '../../../utils'

export const STROKE = '#ced4d9';

/**
 * 绘制图形的基础防范
 * @param {*} cfg 
 * @param {*} group 
 * @param {*} mainId 
 */
export const baseDraw = (cfg, group, mainId) => {
  let size = cfg.size;
  if (!size) {
    size = [170, 34]
  }
  // 此处必须是NUMBER 不然bbox不正常
  const width = parseInt(size[0]);
  const height = parseInt(size[1]);
  const color = cfg.color;
  // 此处必须有偏移 不然drag-node错位
  const offsetX = -width / 2
  const offsetY = -height / 2

  // 文本
  if (cfg.label) {
    group.addShape("text", {
      attrs: {
        id: 'label' + uniqueId(),
        x: offsetX + width / 2,
        y: offsetY + height / 2,
        textAlign: "center",
        textBaseline: "middle",
        text: cfg.label,
        parent: mainId,
        fill: "#565758"
      },
      draggable: true,
      name: 'image4'
    });
  }

  // 流程进入标记
  if (cfg.inPoints) {
    for (let i = 0; i < cfg.inPoints.length; i++) {
      let x,
        y = 0;
      //0为顶 1为底
      if (cfg.inPoints[i][0] === 0) {
        y = 0;
      } else {
        y = height;
      }
      x = width * cfg.inPoints[i][1];
      const id = 'circle' + uniqueId()
      group.addShape("circle", {
        attrs: {
          id: 'circle' + uniqueId(),
          parent: id,
          x: x + offsetX,
          y: y + offsetY,
          r: 10,
          isInPointOut: true,
          fill: "#1890ff",
          opacity: 0
        },
        draggable: true,
        name: 'circle1'
      });
      group.addShape("circle", {
        attrs: {
          id: id,
          x: x + offsetX,
          y: y + offsetY,
          r: 3,
          isInPoint: true,
          fill: "#fff",
          stroke: "#1890ff",
          opacity: 0
        },
        draggable: true,
        name: 'circle2'
      });
    }
  }

  // 流程出口标记
  if (cfg.outPoints) {
    for (let i = 0; i < cfg.outPoints.length; i++) {
      let x,
        y = 0;
      //0为顶 1为底
      if (cfg.outPoints[i][0] === 0) {
        y = 0;
      } else {
        y = height;
      }
      x = width * cfg.outPoints[i][1];
      const id = 'circle' + uniqueId()
      group.addShape("circle", {
        attrs: {
          id: 'circle' + uniqueId(),
          parent: id,
          x: x + offsetX,
          y: y + offsetY,
          r: 10,
          isOutPointOut: true,
          fill: "#1890ff",
          opacity: 0//默認0 需要時改成0.3
        },
        //  draggable: true, // FIXME: 这里设置后会导致连接线在鼠标移动时不能正确渲染
        name: 'circle3'
      });
      group.addShape("circle", {
        attrs: {
          id: id,
          x: x + offsetX,
          y: y + offsetY,
          r: 3,
          isOutPoint: true,
          fill: "#fff",
          stroke: "#1890ff",
          opacity: 0
        },
        // draggable: true, // FIXME: 这里设置后会导致连接线在鼠标移动时不能正确渲染
        name: 'circle4'
      });
    }
  }
}

/**
 * 图形状态响应的基础方法
 * @param {*} name 
 * @param {*} value 
 * @param {*} item 
 */
export const baseSetState = (name, value, item) => {
  const group = item.getContainer();
  const shape = group.get("children")[0]; // 顺序根据 draw 时确定

  const children = group.findAll(g => {
    return g.attrs.parent === shape.attrs.id
  });
  const circles = group.findAll(circle => {
    return circle.attrs.isInPoint || circle.attrs.isOutPoint;
  });
  const selectStyles = () => {
    shape.attr("fill", "#f3f9ff");
    shape.attr("stroke", "#6ab7ff");
    shape.attr("cursor", "move");
    children.forEach(child => {
      child.attr("cursor", "move");
    });
    circles.forEach(circle => {
      circle.attr('opacity', 1)
    })
  };
  const unSelectStyles = () => {
    shape.attr("fill", "#fff");
    shape.attr("stroke", "#ced4d9");
    circles.forEach(circle => {
      circle.attr('opacity', 0)
    })
  };
  switch (name) {
    case "selected":
    case "hover":
      if (value) {
        selectStyles()
      } else {
        unSelectStyles()
      }
      break;
  }
}