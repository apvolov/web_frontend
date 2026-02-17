import { type FC, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { type Principality } from "../modules/types"; // Импортируем тип
import { ROUTES } from "../Routes";
import defaultPrincipalityImage from "../assets/default_principality_image.jpg"; 

export const PrincipalityPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    
    const [principality, setPrincipality] = useState<Principality | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        fetch(`http://localhost:8080/api/principalities/${id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Княжество не найдено на сервере");
                }
                return res.json();
            })
            .then((data) => {
                setPrincipality(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Ошибка загрузки:", err);
                setError(err.message);
                setIsLoading(false);
            });
    }, [id]);

    if (isLoading) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
                <h2>Загрузка данных...</h2>
            </div>
        );
    }

    if (error || !principality) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
                <h1>Княжество не найдено</h1>
                <p>{error}</p>
                <Link to={ROUTES.SERVICES} className="card-link btn-more" style={{ marginTop: '20px', display: 'inline-block' }}>
                    Вернуться к списку
                </Link>
            </div>
        );
    }

    const imageUrl = principality.image ? `http://localhost:9000/rip/${principality.image}` : defaultPrincipalityImage;

    return (
        <div className="container">
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

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                <Link to={ROUTES.SERVICES} className="card-link btn-more" style={{ width: '250px', textDecoration: 'none', textAlign: 'center' }}>
                    К списку княжеств
                </Link>
            </div>
        </div>
    );
};