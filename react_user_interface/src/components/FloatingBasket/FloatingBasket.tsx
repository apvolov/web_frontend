import { type FC } from 'react';
import BasketIcon from '../../assets/icon_basket.svg';
import './FloatingBasket.css';

interface FloatingBasketProps {
  count: number;
  onClick: () => void;
}

export const FloatingBasket: FC<FloatingBasketProps> = ({ count, onClick }) => {
  return (
    <div className="floating-basket" onClick={onClick}>
      <div className="basket-icon-wrapper">
        <img src={BasketIcon} alt="Корзина" className="basket-icon-img" />
        <span className="basket-count">{count}</span>
      </div>
    </div>
  );
};