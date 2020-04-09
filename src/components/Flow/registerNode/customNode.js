import G6 from '@antv/g6';
import { baseDraw, baseSetState } from './common';
import { uniqueId } from '../../../utils'

const customNode = () => {
  G6.registerNode("customNode", {
    draw(cfg, group) {
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
      const mainId = 'rect' + uniqueId()

      // 外边框
      const shape = group.addShape("rect", {
        attrs: {
          id: mainId,
          x: offsetX,
          y: offsetY,
          width: width,
          height: height,
          stroke: "#ced4d9",
          fill: '#fff',//此处必须有fill 不然不能触发事件
          radius: 4
        },
        draggable: true,
        name: 'key-shape'
      });

      // 左侧标签
      group.addShape("rect", {
        attrs: {
          x: offsetX,
          y: offsetY,
          width: 4,
          height: height,
          fill: color,
          parent: mainId,
          radius: [4, 0, 0, 4]
        },
        draggable: true,
        name: 'left'
      });

      // 左侧图片
      group.addShape("image", {
        attrs: {
          x: offsetX + 16,
          y: offsetY + 8,
          width: 20,
          height: 16,
          img: cfg.image,
          parent: mainId
        },
        draggable: true,
        name: 'image1'
      });

      // 右侧状态图片
      group.addShape("image", {
        attrs: {
          x: offsetX + width - 32,
          y: offsetY + 8,
          width: 16,
          height: 16,
          parent: mainId,
          img: cfg.stateImage
        },
        draggable: true,
        name: 'image2'
      });

      // 背景图片
      if (cfg.backImage) {
        group.addShape("image", {
          attrs: {
            x: offsetX,
            y: offsetY,
            width: width,
            height: height,
            img: cfg.backImage,
            clipCfg: {
              x: offsetX,
              y: offsetY,
              width: width,
              height: height,
              fill: '#fff',
              radius: 4
            }
          },
          draggable: true,
          name: 'image3'
        });
      }

      baseDraw(cfg, group, mainId);
      return shape;
    },
    // 当外部调用 graph.setItemState(item, state, value) 时, 该函数做出响应
    setState: baseSetState,
  })
}

export default customNode;