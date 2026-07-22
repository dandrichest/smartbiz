/* eslint-disable react-hooks/purity */
import { FaArrowUp, FaArrowDown, FaChartLine } from 'react-icons/fa';
import '../../styles/DashboardCard.css';

const DashboardCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    subtitle,
    growth,
    trend = 'up',
    loading = false 
}) => {
    const getColorClass = () => {
        const colors = {
            blue: 'blue',
            green: 'green',
            purple: 'purple',
            yellow: 'yellow',
            red: 'red',
            indigo: 'indigo',
            pink: 'pink'
        };
        return colors[color] || 'blue';
    };

    const formatValue = (val) => {
        if (typeof val === 'number' && val >= 1000000) {
            return (val / 1000000).toFixed(1) + 'M';
        }
        if (typeof val === 'number' && val >= 1000) {
            return (val / 1000).toFixed(1) + 'K';
        }
        return val;
    };

    const getTrendIcon = () => {
        if (trend === 'up') return <FaArrowUp />;
        if (trend === 'down') return <FaArrowDown />;
        return <FaChartLine />;
    };

    const getTrendClass = () => {
        if (trend === 'up') return 'up';
        if (trend === 'down') return 'down';
        return 'neutral';
    };

    if (loading) {
        return (
            <div className="dashboard-card loading">
                <div className="dashboard-card-content">
                    <div className="dashboard-card-left">
                        <div className="skeleton-title"></div>
                        <div className="skeleton-value"></div>
                    </div>
                    <div className="skeleton-icon"></div>
                </div>
            </div>
        );
    }

    const colorClass = getColorClass();

    return (
        <div className={`dashboard-card ${colorClass}`}>
            <div className="dashboard-card-content">
                <div className="dashboard-card-left">
                    <p className="dashboard-card-title">{title}</p>
                    <p className="dashboard-card-value">{formatValue(value)}</p>
                    
                    <div className="dashboard-card-footer">
                        {growth !== undefined && (
                            <span className={`dashboard-card-growth ${getTrendClass()}`}>
                                {getTrendIcon()}
                                {growth}%
                            </span>
                        )}
                        {subtitle && (
                            <span className="dashboard-card-subtitle">{subtitle}</span>
                        )}
                    </div>
                </div>
                
                <div className="dashboard-card-icon-wrapper">
                    <Icon className="dashboard-card-icon" />
                </div>
            </div>
            
            {/* Progress bar for visual interest */}
            <div className="dashboard-card-progress">
                <div 
                    className="dashboard-card-progress-bar"
                    style={{ width: `${Math.min(Math.random() * 40 + 60, 100)}%` }}
                ></div>
            </div>
        </div>
    );
};

export default DashboardCard;