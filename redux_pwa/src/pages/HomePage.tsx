import { type FC } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../Routes";

export const HomePage: FC = () => {
  return (
    <div className="container">
      <div className="main-image-section">
        <h1 className="main-image-title">Удельные княжества Древней Руси</h1>
        <p className="main-image-subtitle">
          Добро пожаловать в исторический архив исследовательских данных численности населения разных удельных княжества Древней Руси.

        </p>
        
        <Link to={ROUTES.SERVICES}>
          <button className="card-link btn-main">К списку княжеств</button>
        </Link>
      </div>
    </div>
  );
};