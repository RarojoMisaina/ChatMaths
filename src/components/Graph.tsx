import React, { useRef, useEffect } from 'react';
import functionPlot from 'function-plot';
import { GraphOptions } from '../types';

interface GraphProps {
  expressions: string[];
  options?: Partial<GraphOptions>;
  className?: string;
}

const defaultOptions: GraphOptions = {
  xRange: [-10, 10],
  yRange: [-10, 10],
  grid: true,
  showPoints: false
};

const Graph: React.FC<GraphProps> = ({
  expressions,
  options = {},
  className = ''
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const mergedOptions = { ...defaultOptions, ...options };

  useEffect(() => {
    if (!rootRef.current || expressions.length === 0) return;

    try {
      const width = rootRef.current.clientWidth;
      const height = 300;

      // Prepare data for the graphing library
      const data = expressions.map((expr, index) => ({
        fn: expr,
        color: getColor(index),
        graphType: 'polyline'
      }));

      // Configure the graph
      functionPlot({
        target: rootRef.current,
        width,
        height,
        grid: mergedOptions.grid,
        xAxis: {
          domain: mergedOptions.xRange
        },
        yAxis: {
          domain: mergedOptions.yRange
        },
        data
      });
    } catch (error) {
      console.error('Error rendering graph:', error);
    }
  }, [expressions, mergedOptions, rootRef.current?.clientWidth]);

  // Generate different colors for multiple expressions
  const getColor = (index: number): string => {
    const colors = ['#2563EB', '#7C3AED', '#10B981', '#F59E0B', '#EF4444'];
    return colors[index % colors.length];
  };

  return (
    <div className={`graph-container border border-gray-200 rounded-lg bg-white ${className}`}>
      <div 
        ref={rootRef} 
        className="w-full h-[300px] md:h-[400px] overflow-hidden"
      ></div>
    </div>
  );
};

export default Graph;