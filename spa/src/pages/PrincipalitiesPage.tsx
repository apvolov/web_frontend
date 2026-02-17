import { type FC, useState, useEffect } from "react";
import { PrincipalityCard } from "../components/PrincipalityCard";
import { type Principality } from "../modules/types";
import { useNavigate } from "react-router-dom";
import { MOCK_PRINCIPALITIES } from "../mocks/principalities";
import BasketIcon from "../assets/icon_basket.svg";
import SearchIcon from "../assets/icon_search.svg";

export const PrincipalitiesPage: FC = () => {
  const [principalities, setPrincipalities] = useState<Principality[]>([]);
  
  const [localInput, setLocalInput] = useState("");
  const [searchResult, setSearchResult] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    const url = searchResult 
      ? `/api/principalities?name=${encodeURIComponent(searchResult)}` 
      : "/api/principalities";

    fetch(url) 
      .then((res) => {
        if (!res.ok) throw new Error("ошибка сервера");
        return res.json();
      })
      .then((data) => {
        setPrincipalities(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn("Ошибка сервера, используем mock", err);
        const mocked = MOCK_PRINCIPALITIES.filter(p => 
            p.name.toLowerCase().includes(searchResult.toLowerCase())
        );
        setPrincipalities(mocked);
        setIsLoading(false);
      });
  }, [searchResult]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchResult(localInput);
    }
  };

  const handleDetail = (id: number) => {
    navigate(`/principalities/${id}`);
  };

  const handleAdd = (id: number) => {
    console.log("Клик по 'Добавить' (id: " + id + ")");
  };

  const handleBasketClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    fetch("/api/populations/draft", { method: "POST" })
      .then(() => console.log("Метод /api/populations/draft вызван"))
      .catch((err) => console.error("Ошибка draft:", err));
  };

  return (
    <div className="container">
      <div className="search-section">
        <div className="search-form">
          <input
            type="text"
            placeholder="Поиск княжества..."
            className="search-input"
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            onKeyDown={handleKeyDown}
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
        {isLoading ? (
          <div style={{ textAlign: "center", gridColumn: "1 / -1" }}>
            <h3>Загрузка...</h3>
          </div>
        ) : principalities.length > 0 ? (
          principalities.map((item) => (
            <PrincipalityCard
              key={item.id}
              {...item}
              onDetailClick={handleDetail}
              onAddClick={handleAdd}
            />
          ))
        ) : (
          <div style={{ textAlign: "center", gridColumn: "1 / -1", padding: "50px" }}>
            <h3>Ничего не найдено</h3>
          </div>
        )}
      </div>

      <a href="/population" className="floating-basket" onClick={handleBasketClick}>
        <img src={BasketIcon} alt="Корзина" />
        <span className="basket-count">0</span>
      </a>
    </div>
  );
};