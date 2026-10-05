import React from 'react';
import {Composition} from 'remotion';
import {XingYanChainVideoV3} from './XingYanChainVideoV3';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="XingYanChain40sV3Voiceover"
      component={XingYanChainVideoV3}
      durationInFrames={1200}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
