import { type FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { ROUTES } from "../../Routes";
import { Link, useNavigate } from "react-router-dom";
import { 
    getDraftPopulation, 
    deletePrincipalityFromDraft, 
    updatePopulationResearcher, 
    updatePrincipalityArea, 
    formPopulation,
    deletePopulation
} from '../../store/slices/populationPrincipalityDraftSlice';
import { resetFilters } from '../../store/slices/filterSlice';
import defaultImage from "../../assets/default_principality_image.jpg";
import "./PopulationDraftPage.css";

const RESEARCHERS = [
    { id: 1, name: "А. П. Терасов" },
    { id: 2, name: "В. И. Машкова" },
    { id: 3, name: "В. В. Новиков" },
];

export const PopulationDraftPage: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    const { items, app_id, researcherName } = useAppSelector(state => state.populationDraft);
    const { isAuth } = useAppSelector(state => state.user);
    
    const [selectedResId, setSelectedResId] = useState<number | string>("");
    const [areas, setAreas] = useState<Record<number, string>>({});

    useEffect(() => {
        if (isAuth) {
            dispatch(getDraftPopulation());
        }
    }, [dispatch, isAuth]);

    useEffect(() => {
        if (researcherName) {
            const res = RESEARCHERS.find(r => r.name === researcherName);
            if (res) setSelectedResId(res.id);
        }
        
        if (items && items.length > 0) {
            const initialAreas: Record<number, string> = {};
            items.forEach(item => {
                initialAreas[item.id] = item.area ? String(item.area) : "";
            });
            setAreas(initialAreas);
        }
    }, [items, researcherName]);

    const saveAllData = async () => {
        if (!app_id) return;
        const researcher = RESEARCHERS.find(r => r.id === Number(selectedResId));
        
        if (researcher) {
            await dispatch(updatePopulationResearcher({ 
                populationId: app_id, 
                researcherName: researcher.name 
            })).unwrap();
        }

        const areaPromises = Object.entries(areas).map(([id, value]) => {
            if (value === "") return Promise.resolve();
            return dispatch(updatePrincipalityArea({
                populationId: app_id,
                principalityId: Number(id),
                area: Number(value)
            })).unwrap();
        });

        await Promise.all(areaPromises);
    };

    const handleSave = async () => {
        try {
            await saveAllData();
            alert("Данные успешно сохранены!");
            dispatch(getDraftPopulation());
        } catch (error: any) {
            alert("Ошибка при сохранении: " + (error || "Проверьте корректность данных"));
        }
    };

    const handleFormSubmit = async () => {
        if (!app_id) return;

        if (!selectedResId) {
            alert("Ошибка: необходимо указать имя исследователя для формирования");
            return;
        }

        const missingArea = items.find(item => !areas[item.id] || areas[item.id] === "");
        if (missingArea) {
            alert(`Ошибка: для княжества "${missingArea.name}" не указана площадь`);
            return;
        }

        if (window.confirm("Вы уверены? После формирования редактирование будет невозможно.")) {
            try {
                await saveAllData();
                await dispatch(formPopulation(app_id)).unwrap();
                
                alert("Данные сохранены и заявка успешно сформирована!");
                dispatch(resetFilters());
                navigate(ROUTES.SERVICES);
            } catch (error: any) {
                alert("Ошибка формирования: " + (error || "Не удалось завершить операцию"));
            }
        }
    };

    const handleDeleteFullDraft = async () => {
        if (!app_id) return;
        if (window.confirm("Вы уверены, что хотите ПОЛНОСТЬЮ удалить эту заявку?")) {
            try {
                await dispatch(deletePopulation(app_id)).unwrap();
                alert("Заявка успешно удалена");
                navigate(ROUTES.SERVICES);
            } catch (error: any) {
                alert("Ошибка при удалении: " + (error || "Неизвестная ошибка"));
            }
        }
    };

    if (!items || items.length === 0) {
        return (
            <div className="draft-empty-container">
                <div className="empty-content">
                    <h2>Ваша заявка пока пуста</h2>
                    <p>Добавьте княжества из каталога, чтобы начать оформление.</p>
                    <Link to={ROUTES.SERVICES} className="btn-back">К списку княжеств</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="draft-container">
            <header className="draft-header-section">
                <h1>Оформление заявки</h1>
            </header>

            <div className="researcher-card">
                <div className="researcher-field">
                    <label htmlFor="res-select">Исследователь:</label>
                    <select 
                        id="res-select" 
                        value={selectedResId}
                        onChange={(e) => setSelectedResId(e.target.value)}
                        className="custom-select"
                    >
                        <option value="">-- Выберите из списка --</option>
                        {RESEARCHERS.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="draft-table">
                <div className="table-head">
                    <div className="col-info">Княжество</div>
                    <div className="col-area">Площадь</div>
                    <div className="col-action">Действие</div>
                </div>

                {items.map((item) => (
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

                        <div className="col-area">
                            <div className="input-wrapper">
                                <input 
                                    type="text"
                                    className="area-input"
                                    placeholder="0"
                                    value={areas[item.id] || ""} 
                                    onChange={(e) => {
                                        let val = e.target.value.replace(/[^0-9]/g, "");
                                        val = val.replace(/^0+/, "");
                                        setAreas(prev => ({ ...prev, [item.id]: val }));
                                    }}
                                />
                                <span className="unit">км²</span>
                            </div>
                        </div>

                        <div className="col-action">
                            <button className="delete-btn" onClick={() => dispatch(deletePrincipalityFromDraft({ populationId: app_id!, principalityId: item.id }))}>
                                Удалить
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <footer className="draft-footer">
                <button className="del-btn" onClick={handleDeleteFullDraft}>
                    Удалить черновик
                </button>
                <button className="save-btn" onClick={handleSave}>
                    Сохранить изменения
                </button>
                <button className="submit-btn" onClick={handleFormSubmit}>
                    Сформировать заявку
                </button>
            </footer>
        </div>
    );
};