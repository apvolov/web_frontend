import { type FC, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { getPrincipality, clearCurrentPrincipality } from "../../store/slices/principalitySlice";
import { getDraftPopulation } from "../../store/slices/populationPrincipalityDraftSlice";
import { ROUTES } from "../../Routes";
import { FloatingBasket } from "../../components/FloatingBasket/FloatingBasket";
import defaultPrincipalityImage from "../../assets/default_principality_image.jpg";
import "./PrincipalityPage.css"

export const PrincipalityPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { currentPrincipality, isLoading, error } = useAppSelector((state) => state.principalities);
  const { isAuth, isAdmin } = useAppSelector(state => state.user);
  const { items } = useAppSelector((state) => state.populationDraft);

  useEffect(() => {
    if (id) {
      dispatch(getPrincipality(Number(id)));
    }
    if (isAuth) {
        dispatch(getDraftPopulation());
    }

    return () => {
      dispatch(clearCurrentPrincipality());
    };
  }, [dispatch, id, isAuth]);

  const handleBasketClick = () => {
    navigate(ROUTES.POPULATION_DRAFT);
  };

  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Загрузка данных...</h2>
      </div>
    );
  }

  if (error || !currentPrincipality) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
        <h1>Княжество не найдено</h1>
        <p style={{ color: 'red' }}>{error || "Данные отсутствуют"}</p>
        <Link to={ROUTES.SERVICES} className="card-link btn-more" style={{ marginTop: '20px', display: 'inline-block' }}>
          Вернуться к списку
        </Link>
      </div>
    );
  }

  const imageUrl = currentPrincipality.image 
    ? `http://localhost:9000/rip/${currentPrincipality.image}` 
    : defaultPrincipalityImage;

  return (
    <div className="container">
      <section className="principality-detail">
        <div className="detail-image-block">
          <img 
            src={imageUrl} 
            alt={currentPrincipality.name || "Княжество"} 
            className="detail-image"
            onError={(e) => { 
              (e.target as HTMLImageElement).src = defaultPrincipalityImage; 
            }}
          />
        </div>

        <div className="detail-info-block">
          <h1 className="detail-title">{currentPrincipality.name}</h1>
          <p className="detail-years">
            Период существования: <span>{currentPrincipality.year0} – {currentPrincipality.year1} гг.</span>
          </p>
          <div className="detail-description">
            <h3>История и описание</h3>
            <p>{currentPrincipality.description || "Описание временно отсутствует."}</p>
          </div>
        </div>
      </section>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <Link to={ROUTES.SERVICES} className="btn-back">
          К списку княжеств
        </Link>
      </div>

      {isAuth && !isAdmin && (
        <FloatingBasket 
          count={items?.length || 0} 
          onClick={handleBasketClick} 
        />
      )}
    </div>
  );
};