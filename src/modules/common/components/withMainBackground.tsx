/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-confusing-arrow */
import React, { ComponentType } from 'react';

const withMainBackground = (WrappedComponent: ComponentType): React.FC<number> => (value?: number): JSX.Element => {
  console.log(`Loading Background ${value}`);
  return value === 1 ? (
    <div className="main-page flex-column justify-content-center">
      <WrappedComponent />
    </div>
  ) : (
    <WrappedComponent />
  );
};

export default withMainBackground;
