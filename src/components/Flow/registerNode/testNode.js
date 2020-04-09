import G6 from '@antv/g6';
import { STROKE, baseDraw, baseSetState } from './common';
import { uniqueId } from '../../../utils'

const testNode = () => {
  G6.registerNode(
    'testNode',
    {
      draw(cfg, group) {
        let size = cfg.size;
        if (!size) {
          size = [170, 34]
        }
        // 此处必须是NUMBER 不然bbox不正常
        const width = parseInt(size[0]);
        const height = parseInt(size[1]);
        // 此处必须有偏移 不然drag-node错位
        const offsetX = -width / 2
        const offsetY = -height / 2
        const mainId = 'diamondT' + uniqueId()

        // 外边框
        const container = group.addShape("rect", {
          attrs: {
            id: mainId,
            x: offsetX,
            y: offsetY,
            width: width,
            height: height,
            stroke: STROKE,
            fill: '#fff', // 此处必须有fill 不然不能触发事件
          },
          draggable: true,
          name: 'big-rect-shape'
        });


        baseDraw(cfg, group, mainId);

        return container;
      },
      setState: baseSetState,
    },
  );
}


export default testNode;