import { type FC } from "react";
import { useParams, Link } from "react-router-dom";
import { MOCK_PRINCIPALITIES } from "../mocks/principalities";
import { ROUTES } from "../Routes";
import defaultPrincipalityImage from "../assets/default_principality_image.jpg"; 

export const PrincipalityPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const principality = MOCK_PRINCIPALITIES.find(p => p.id === Number(id));

    if (!principality) {
        return (
            <div className="container" style={{ textAlign: 'center' }}>
                <h1>Княжество не найдено</h1>
                <Link to={ROUTES.SERVICES} className="card-link btn-more" style={{ marginTop: '20px' }}>
                    Вернуться к списку
                </Link>
            </div>
        );
    }

    const imageUrl = principality.image ? `/rip/${principality.image}` : defaultPrincipalityImage;

    return (
        <div className="container">
            {/* Этот блок благодаря flex в CSS поставит картинку слева, а инфо справа */}
            <section className="principality-detail">
                <div className="detail-image-block">
                    <img 
                        src={imageUrl} 
                        alt={principality.name} 
                        className="detail-image"
                        onError={(e) => { (e.target as HTMLImageElement).src = defaultPrincipalityImage; }}
                    />
                </div>

                <div className="detail-info-block">
                    <h1 className="detail-title">{principality.name}</h1>
                    <p className="detail-years">
                        Период существования: <span>{principality.year0} – {principality.year1} гг.</span>
                    </p>
                    <div className="detail-description">
                        <h3>История и описание</h3>
                        <p>{principality.description || "Описание временно отсутствует."}</p>
                    </div>
                </div>
            </section>

            {/* Блок кнопки снизу по центру */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                <Link to={ROUTES.SERVICES} className="card-link btn-more" style={{ width: '250px', textDecoration: 'none' }}>
                    К списку княжеств
                </Link>
            </div>
        </div>
    );
};