import { type FC, useState, useEffect } from "react";
import { ROUTES } from '../../Routes';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PrincipalityCard } from "../../components/PrincipalityCard/PrincipalityCard";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { setSearchQuery } from "../../store/slices/filterSlice";
import { fetchStart, setPrincipalities, fetchError } from "../../store/slices/principalitySlice"; 
import { getDraftPopulation, addToDraft } from "../../store/slices/populationPrincipalityDraftSlice";
import { FloatingBasket } from '../../components/FloatingBasket/FloatingBasket';
import { type DsPrincipality } from "../../api/Api";
import { SearchSection } from '../../components/SearchSection/SearchSection';
import { MOCK_PRINCIPALITIES } from "../../mocks/principalities";
import "./PrincipalitiesPage.css";

export const PrincipalitiesPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [localSearch, setLocalSearch] = useState("");

  const { items, isLoading, error } = useAppSelector((state) => state.principalities);
  const { searchQuery } = useAppSelector((state) => state.filters);
  const { isAuth, isAdmin } = useAppSelector(state => state.user);
  const { count } = useAppSelector((state) => state.populationDraft);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const loadPrincipalities = async () => {
      dispatch(fetchStart());

      try {
        const response = await axios.get("http://localhost:8080/api/principalities", {
          params: { name: searchQuery }
        });

        dispatch(setPrincipalities(response.data));
      } catch (err: any) {
        console.warn("Бэкенд недоступен, используем моки для фильтрации");
        
        const query = searchQuery.toLowerCase();
        const filtered = MOCK_PRINCIPALITIES.filter(p => 
          p.name.toLowerCase().includes(query)
        );

        if (filtered.length === 0 && query) {
          dispatch(fetchError("Ничего не найдено"));
        } else {
          dispatch(setPrincipalities(filtered as DsPrincipality[]));
        }
      }
    };

    loadPrincipalities();
    
    if (isAuth) {
      dispatch(getDraftPopulation());
    }
  }, [dispatch, searchQuery, isAuth]);

  const handleSearchExecute = () => {
    dispatch(setSearchQuery(localSearch));
  };

  const handleDetail = (id: number) => {
    navigate(`/principalities/${id}`);
  };

  const handleAdd = (id: number) => {
    dispatch(addToDraft(id)); 
  };

  const handleBasketClick = () => {
    navigate(ROUTES.POPULATION_DRAFT); 
  };

  return (
    <div className="content-wrapper">
      <div className="container">
        <SearchSection 
          value={localSearch} 
          onChange={setLocalSearch} 
          onSearch={handleSearchExecute}
        />

        <div className="principalities-grid">
          {isLoading ? (
            <div className="status-message"><h3>Загрузка данных...</h3></div>
          ) : error ? (
            <div className="status-message error"><h3>Ошибка: {error}</h3></div>
          ) : items.length > 0 ? (
            items.map((item: DsPrincipality) => (
              <PrincipalityCard
                key={item.id}
                id={item.id!}
                name={item.name || ""}
                image={item.image || ""}
                year0={item.year0 || ""}
                year1={item.year1 || ""}
                description={item.description || ""}
                onDetailClick={handleDetail}
                onAddClick={handleAdd}
                isAuth={isAuth}
                isAdmin={isAdmin}
              />
            ))
          ) : (
            <div className="status-message"><h3>Ничего не найдено</h3></div>
          )}
        </div>

        {isAuth && !isAdmin && (
          <FloatingBasket 
            count={count} 
            onClick={handleBasketClick} 
          />
        )}
      </div>
    </div>
  );
};