import G6 from "@antv/g6/build/g6";
import { uniqueId } from '@/utils'
import openSvg from '@/assets/icons/open.svg'
import closeSvg from '@/assets/icons/close.svg'
const teamNode = {
  init() {
    G6.registerNode("teamNode", {
      draw(cfg, group) {
        const padding = 10
        const top=20
        // 此处必须是NUMBER 不然bbox不正常
        const width = cfg.width + padding * 2
        const height = cfg.height + padding * 2
        // 此处必须有偏移 不然drag-node错位
        const offsetX = -width / 2
        const offsetY = -height / 2-top
        const mainId = 'rect' + uniqueId()
        const shape = group.addShape("rect", {
          attrs: {
            id: mainId,
            x: offsetX,
            y: offsetY,
            width: width,
            height: height+top,
            stroke: "#ced4d9",
            fill: '#f2f4f5',//此处必须有fill 不然不能触发事件
            radius: 4
          }
        });
      
        group.addShape("text", {
          attrs: {
            id: 'label' + uniqueId(),
            x: offsetX+padding,
            y: offsetY+padding,
            textBaseline:'top',
            text: cfg.label || '新建分组',
            parent: mainId,
            fill: "#565758"
          }
        });
        group.addShape("image", {
          attrs: {
            x: offsetX + width - 26,
            y: offsetY + 8,
            width: 16,
            height: 16,
            img: closeSvg
          }
        });
        // 添加文本、更多图形
        return shape;
      },
      //设置状态
      setState(name, value, item) {
        const group = item.getContainer();
        const shape = group.get("children")[0]; // 顺序根据 draw 时确定
        const selectStyles = () => {
          shape.attr("stroke", "#6ab7ff");
          shape.attr("cursor", "move");
        };
        const unSelectStyles = () => {
          shape.attr("stroke", "#ced4d9");
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
    });

  }
}

export default teamNode
