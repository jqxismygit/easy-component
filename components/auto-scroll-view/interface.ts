import React from 'react';
import * as CSS from 'csstype';

export interface AutoScrollViewProps {
  className?: string;
  style?: CSS.Properties<string | number>;
  height: number;
  speed?: number;
  fps?: number;
}
