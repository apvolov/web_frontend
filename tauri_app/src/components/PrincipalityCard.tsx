import { type FC } from 'react';
import { type Principality } from '../modules/types';
import defaultPrincipalityImage from "../assets/default_principality_image.jpg"; 
import { dest_img } from "../../target_config";

interface Props extends Principality {
    onDetailClick: (id: number) => void;
    onAddClick: (id: number) => void;
}

export const PrincipalityCard: FC<Props> = ({ id, name, image, year0, year1, onDetailClick, onAddClick }) => {
    const imageUrl = image ? `${dest_img}/${image}` : defaultPrincipalityImage;

    return (
        <div className="card">
            <div className="card-image-container">
                <img 
                    src={imageUrl} 
                    alt={name} 
                    className="card-image" 
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== defaultPrincipalityImage) {
                            target.src = defaultPrincipalityImage;
                        }
                    }}
                />
            </div>

            <div className="card-info">
                <h2 className="card-title">{name}</h2>
                <p className="card-years">{year0} – {year1}</p>
            </div>

            <div className="card-buttons">
                <button className="card-link btn-more" onClick={() => onDetailClick(id)}>Подробнее</button>
                <button className="card-link btn-add" onClick={() => onAddClick(id)}>Добавить</button>
            </div>
        </div>
    );
};