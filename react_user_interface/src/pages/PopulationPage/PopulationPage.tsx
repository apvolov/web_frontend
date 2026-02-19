import { type FC, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { getPopulation, clearCurrentItem } from '../../store/slices/populationSlice'; 
import { getDraftPopulation } from "../../store/slices/populationPrincipalityDraftSlice";
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import { FloatingBasket } from '../../components/FloatingBasket/FloatingBasket';
import defaultImage from "../../assets/default_principality_image.jpg";
import "../PopulationDraftPage/PopulationDraftPage.css"; 

export const PopulationDetailsPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { currentItem, loading, error } = useAppSelector(state => state.populations);
    const { items: draftItems } = useAppSelector(state => state.populationDraft);
    const { isAuth, isAdmin } = useAppSelector(state => state.user);

    useEffect(() => {
        if (id) {
            dispatch(getPopulation(Number(id)));
        }

        if (isAuth) {
            dispatch(getDraftPopulation());
        }

        return () => {
            dispatch(clearCurrentItem());
        };
    }, [dispatch, id, isAuth]);

    const handleBasketClick = () => {
        navigate(ROUTES.POPULATION_DRAFT);
    };

    if (loading) return <div className="draft-empty-container"><h2>Загрузка данных...</h2></div>;
    if (error) return <div className="draft-empty-container"><h2>Ошибка: {error}</h2></div>;
    if (!currentItem) return <div className="draft-empty-container"><h2>Заявка не найдена</h2></div>;

    return (
        <div className="draft-container">
            <header className="draft-header-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>{ROUTE_LABELS.REQUEST_DETAIL}</h1>
                </div>
            </header>

            <div className="researcher-card">
                <div className="researcher-field">
                    <span className="info-label"><strong>Исследователь:</strong></span>
                    <span className="res-name" style={{ fontSize: '18px', marginLeft: '10px' }}>
                        {currentItem.researcher_name || "Не назначен"}
                    </span>
                </div>
            </div>

            <div className="draft-table">
                <div className="table-head">
                    <div className="col-info">Княжество</div>
                    <div className="col-area">Площадь</div>
                </div>

                {currentItem.items?.map((item: any) => (
                    <div key={item.id} className="table-row">
                        <div className="col-info">
                            <img 
                                src={item.image ? `http://localhost:9000/rip/${item.image}` : defaultImage} 
                                alt={item.name}
                                className="principality-thumb"
                            />
                            <div className="info-text">
                                <span className="name">{item.name}</span>
                                <span className="years">{item.year0} — {item.year1} гг.</span>
                            </div>
                        </div>

                        <div className="col-area" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div className="input-wrapper" style={{ 
                                border: 'none', 
                                background: 'transparent', 
                                display: 'flex', 
                                alignItems: 'baseline', 
                                justifyContent: 'center',
                                width: '100%' 
                            }}>
                                <span style={{ fontSize: '20px' }}>{item.area || 0}</span>
                                <span className="unit" style={{ marginLeft: '10px' }}>км²</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isAuth && !isAdmin && (
                <FloatingBasket 
                    count={draftItems?.length || 0} 
                    onClick={handleBasketClick} 
                />
            )}
        </div>
    );
};