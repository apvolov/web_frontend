import { type FC, useState, useEffect } from "react";
import { PrincipalityCard } from "../components/PrincipalityCard";
import { type Principality } from "../modules/types";
import { useNavigate } from "react-router-dom";
import { MOCK_PRINCIPALITIES } from "../mocks/principalities";
import BasketIcon from "../assets/icon_basket.svg";
import SearchIcon from "../assets/icon_search.svg";

export const PrincipalitiesPage: FC = () => {
  const [principalities, setPrincipalities] = useState<Principality[]>(MOCK_PRINCIPALITIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [basketCount, setBasketCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/principalities") 
      .then((res) => {
        if (!res.ok) throw new Error("ошибка сервера");
        return res.json();
      })
      .then((data) => {
        console.log("данные загружены");
        setPrincipalities(data);
      })
      .catch((err) => {
        console.warn("использование mock", err);
      });
  }, []);

  const filteredData = principalities.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDetail = (id: number) => {
        navigate(`/principalities/${id}`);
    };

  const handleAdd = (id: number) => {
    console.log("Добавлено в корзину:", id);
    setBasketCount(prev => prev + 1);
  };

  return (
    <div className="container">
      <div className="search-section">
        <div className="search-form">
        <input
          type="text"
          placeholder="Поиск княжества..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ 
            backgroundImage: `url("${SearchIcon}")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            backgroundSize: '20px 20px',
          }}
        />
        </div>
      </div>

      <div className="principalities-grid">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <PrincipalityCard
              key={item.id}
              {...item}
              onDetailClick={handleDetail}
              onAddClick={handleAdd}
            />
          ))
        ) : (
          <div style={{ textAlign: "center", gridColumn: "1 / -1", padding: "50px" }}>
            <h3>Княжество не найдено</h3>
          </div>
        )}
      </div>

      <a href="/population" className="floating-basket" onClick={(e) => e.preventDefault()}>
        <img src={BasketIcon} alt="Корзина" />
        <span className="basket-count">{basketCount}</span>
      </a>
    </div>
  );
};