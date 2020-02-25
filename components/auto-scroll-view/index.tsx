import React from 'react';
import { AutoScrollViewProps } from './interface';
const useMeasureChildren = (count) => {
  const measureResults = [];
  for (let i = 0; i < count; ++i) {
    const [rect, setRect] = React.useState({});
    const [node, setNode] = React.useState(null);
    const measureRef = React.useCallback((node) => {
      if (node !== null) {
        setRect(node.getBoundingClientRect());
        setNode(node);
      }
    }, []);
    measureResults[i] = {
      node,
      rect,
      measureRef
    };
  }
  return measureResults;
};

//获取所有的子节点高度
const getChildrenHeight = (measureResult) =>
  measureResult.reduce((prev, { rect }) => rect.height + prev, 0);

//获取第一个子节点到指定子节点的高度
const getFrontItemHeight = (measureResult, index) =>
  measureResult.reduce((prev, { rect }, idx) => (idx <= index ? rect.height + prev : prev), 0);

const AutoScrollView: React.FC<AutoScrollViewProps> = (props) => {
  const { children, style, className, height, speed, fps } = props;

  const childCount = React.Children.count(children);

  const measureResults = useMeasureChildren(childCount);

  React.useEffect(() => {
    let globalOffsetY = 0;
    let offsetY = Array.from({ length: childCount }).map(() => 0);
    const childrenHeight = getChildrenHeight(measureResults);
    let handle;
    if (height < childrenHeight) {
      handle = setInterval(() => {
        globalOffsetY -= 0.1 * speed;
        //此处是一个优化操作，取余也行
        if (globalOffsetY < -childrenHeight) {
          globalOffsetY += childrenHeight;
          offsetY = offsetY.map(() => 0);
        }
        measureResults &&
          measureResults.forEach(({ node }, idx) => {
            if (node) {
              if (globalOffsetY + offsetY[idx] <= -getFrontItemHeight(measureResults, idx)) {
                offsetY[idx] = childrenHeight;
              }
              node.style.transform = `translateY(${globalOffsetY + offsetY[idx]}px)`;
            }
          });
      }, 1000 / fps);
    }

    return () => {
      handle && clearInterval(handle);
    };
  }, [measureResults]);

  return (
    <div className={className} style={{ height: `${height}px`, overflowY: 'hidden', ...style }}>
      {React.Children.map(children, (child, idx) => {
        return <div ref={measureResults[idx].measureRef}>{child}</div>;
      })}
    </div>
  );
};

AutoScrollView.defaultProps = {
  speed: 4,
  fps: 30
};

export default AutoScrollView;
