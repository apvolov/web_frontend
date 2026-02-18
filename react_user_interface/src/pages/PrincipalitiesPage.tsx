import { type FC, useState, useEffect } from "react";
import { PrincipalityCard } from "../components/PrincipalityCard";
import { type Principality } from "../modules/types";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { setSearchQuery } from "../store/slices/filterSlice";
import { MOCK_PRINCIPALITIES } from "../mocks/principalities";

import BasketIcon from "../assets/icon_basket.svg";
import SearchIcon from "../assets/icon_search.svg";

export const PrincipalitiesPage: FC = () => {
  const [principalities, setPrincipalities] = useState<Principality[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [localSearch, setLocalSearch] = useState("");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const searchQuery = useAppSelector((state) => state.filters.searchQuery);
  
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setIsLoading(true);

    const baseUrl = "http://localhost:8080/api/principalities";
    const url = searchQuery 
      ? `${baseUrl}?name=${encodeURIComponent(searchQuery)}` 
      : baseUrl;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("ошибка сервера");
        return res.json();
      })
      .then((data) => {
        console.log("Данные получены с сервера");
        setPrincipalities(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn("Бэкенд недоступен, переключаюсь на mock-данные", err);
        
        const filteredMocks = MOCK_PRINCIPALITIES.filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        setPrincipalities(filteredMocks);
        setIsLoading(false);
      });
  }, [searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      dispatch(setSearchQuery(localSearch));
    }
  };

  const handleDetail = (id: number) => {
    navigate(`/principalities/${id}`);
  };

  const handleAdd = (_id: number) => {
    console.log("Клик по кнопке Добавить для id:", _id);
  };

  const handleBasketClick = () => {
    fetch("http://localhost:8080/api/populations/draft", {
      method: "GET",
    })
      .then(() => console.log("Метод populations/draft успешно вызван"))
      .catch((err) => console.error("Ошибка при вызове метода (бэк отключен):", err));
  };

  return (
    <div className="container">
      <div className="search-section">
        <div className="search-form">
          <input
            type="text"
            placeholder="Поиск княжества..."
            className="search-input"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
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

      <div 
        className="floating-basket" 
        onClick={handleBasketClick} 
        style={{ cursor: 'pointer' }}
      >
        <img src={BasketIcon} alt="Корзина" />
        <span className="basket-count">0</span>
      </div>
    </div>
  );
};