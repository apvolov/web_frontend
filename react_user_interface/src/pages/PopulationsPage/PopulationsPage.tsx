import { type FC, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { getPopulations } from '../../store/slices/populationSlice'; 
import { getDraftPopulation } from "../../store/slices/populationPrincipalityDraftSlice";
import { ROUTES } from '../../Routes';
import { FloatingBasket } from '../../components/FloatingBasket/FloatingBasket';
import "./PopulationsPage.css";

export const PopulationsPage: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { list, loading, error } = useAppSelector(state => state.populations);
    const { isAuth, isAdmin } = useAppSelector(state => state.user);
    const { items } = useAppSelector(state => state.populationDraft);
    const activeList = list.filter(pop => {
        if (pop.status === 'deleted') return false;
        if (isAdmin) {
            return pop.status !== 'draft';
        }
        return true;
    });

    useEffect(() => {
        if (isAuth) {
            dispatch(getPopulations());
            
            if (!isAdmin) {
                dispatch(getDraftPopulation());
            }
        }
    }, [dispatch, isAuth, isAdmin]);

    const handleBasketClick = () => {
        navigate(ROUTES.POPULATION_DRAFT);
    };

    const getStatusLabel = (status: string) => {
        const statuses: Record<string, string> = {
            draft: "Черновик",
            formed: "Сформирована",
            rejected: "Отклонена",
            finished: "Завершена"
        };
        return statuses[status] || status;
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString || dateString === "0001-01-01T00:00:00Z" || !dateString.length) return "—";
        
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (loading && list.length === 0) {
        return (
            <div className="history-container">
                <div className="history-loader">Загрузка данных реестра...</div>
            </div>
        );
    }

    return (
        <div className="history-container">
            <header className="history-header-section">
                <h1>{isAdmin ? "Реестр всех заявок" : "История моих заявок"}</h1>
            </header>

            {error && <div className="history-error">{error}</div>}

            <div className="history-table-custom">
                <div className="table-head-custom">
                    <div className="col-id">ID</div>
                    <div className="col-res">Исследователь</div>
                    <div className="col-date">Создана</div>
                    <div className="col-date">Сформирована</div>
                    <div className="col-status">Статус</div>
                    <div className="col-action">Действие</div>
                </div>

                {activeList.length === 0 && !loading ? (
                    <div className="history-empty">
                        <p>
                            {isAdmin 
                                ? "На данный момент нет заявок, требующих обработки." 
                                : "У вас пока нет созданных заявок."}
                        </p>
                        {!isAdmin && (
                            <Link to={ROUTES.SERVICES} className="btn-back">
                                К списку княжеств
                            </Link>
                        )}
                    </div>
                ) : (
                    activeList.map((pop) => (
                        <div key={pop.id} className="table-row-custom">
                            <div className="col-id">
                                <span className="id-badge">#{pop.id}</span>
                            </div>
                            
                            <div className="col-res">
                                <span className="res-name">{pop.researcher_name || "—"}</span>
                            </div>

                            <div className="col-date">
                                <span className="date-text">{formatDate(pop.create_date)}</span>
                            </div>

                            <div className="col-date">
                                <span className="date-text">{formatDate(pop.form_date)}</span>
                            </div>

                            <div className="col-status">
                                <span className={`status-tag ${pop.status}`}>
                                    {getStatusLabel(pop.status)}
                                </span>
                            </div>

                            <div className="col-action">
                                <Link 
                                    to={pop.status === 'draft' ? ROUTES.POPULATION_DRAFT : `/populations/${pop.id}`} 
                                    className="history-action-btn"
                                >
                                    {pop.status === 'draft' ? "Изменить" : "Открыть"}
                                </Link>
                            </div>
                        </div>
                    ))
                )}
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