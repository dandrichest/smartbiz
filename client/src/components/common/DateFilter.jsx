import { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import '../../styles/DateFilter.css';

const DateFilter = ({ onDateChange, initialRange = '7d' }) => {
    const [range, setRange] = useState(initialRange);
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');
    const [showCustom, setShowCustom] = useState(false);

    const presets = [
        { label: 'Today', value: 'today' },
        { label: 'Last 7 Days', value: '7d' },
        { label: 'Last 30 Days', value: '30d' },
        { label: 'Last 90 Days', value: '90d' },
        { label: 'Custom', value: 'custom' },
    ];

    const handlePresetChange = (value) => {
        setRange(value);
        if (value === 'custom') {
            setShowCustom(true);
        } else {
            setShowCustom(false);
            onDateChange(value);
        }
    };

    const handleCustomApply = () => {
        if (customStart && customEnd) {
            onDateChange({ start: customStart, end: customEnd });
        }
    };

    return (
        <div className="date-filter-wrapper">
            <div className="date-filter-presets">
                <FaCalendarAlt className="filter-icon" />
                {presets.map((preset) => (
                    <button
                        key={preset.value}
                        className={`preset-btn ${range === preset.value ? 'active' : ''}`}
                        onClick={() => handlePresetChange(preset.value)}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            {showCustom && (
                <div className="custom-date-range">
                    <input
                        type="date"
                        value={customStart}
                        onChange={(e) => setCustomStart(e.target.value)}
                        className="date-input"
                    />
                    <span>to</span>
                    <input
                        type="date"
                        value={customEnd}
                        onChange={(e) => setCustomEnd(e.target.value)}
                        className="date-input"
                    />
                    <button 
                        className="apply-btn"
                        onClick={handleCustomApply}
                        disabled={!customStart || !customEnd}
                    >
                        Apply
                    </button>
                </div>
            )}
        </div>
    );
};

export default DateFilter;