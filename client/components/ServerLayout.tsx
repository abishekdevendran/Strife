import React, { ReactNode, useEffect } from 'react';

const ServerLayout = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    console.log('serverLayout');
  },[]);
	return <div>serverLayout{children}</div>;
};

export default ServerLayout;
