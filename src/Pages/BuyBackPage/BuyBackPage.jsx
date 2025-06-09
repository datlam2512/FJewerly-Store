import React, { useEffect } from 'react';
import ProductListBuyBack from './ProductListBuyBack';
import "./BuyBackPage.scss"
import { ConfigProvider } from 'antd';

const BuyBackPage = () => {

  return (
    <div className='buy-back-page'>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "var(--primary-color)",
            colorPrimaryHover: "var(--primary-color-hover)",
            colorPrimaryActive: "grey"
          },
          components: {
            Select: {
              optionSelectedBg: "white"
            },
            Input: {
              activeShadow: "0 0 0 0 rgba(5, 145, 255, 0.1)"
            },
          },
        }}
      >
        <ProductListBuyBack />
      </ConfigProvider>
    </div>
  );
};

export default BuyBackPage;
