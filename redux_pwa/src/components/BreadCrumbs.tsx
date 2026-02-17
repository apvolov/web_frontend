import { type FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTE_LABELS } from '../Routes';

export const BreadCrumbs: FC = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <Link to="/">{ROUTE_LABELS.HOME}</Link>
                </li>
                {pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    
                    const label = ROUTE_LABELS[value.toUpperCase() as keyof typeof ROUTE_LABELS] || value;

                    return last ? (
                        <li key={to} className="breadcrumb-item active">{label}</li>
                    ) : (
                        <li key={to} className="breadcrumb-item">
                            <Link to={to}>{label}</Link>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};