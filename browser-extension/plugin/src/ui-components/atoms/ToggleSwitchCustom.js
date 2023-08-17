import PropTypes from 'prop-types';
// import "./Toggle.css";

export const ToggleSwitchCustom = ({ onToggleChange, checked }) => {
    const switchStyles = `
        .toggle-container {
            display: flex;
            align-items: center;
        }
        
        .toggle-switch {
            position: relative;
            width: 50px;
            height: 25px;
            margin-right: 10px;
        }
        
        .toggle-switch input[type='checkbox'] {
            display: none;
        }
        
        .toggle-switch .switch {
            position: absolute;
            cursor: pointer;
            background-color: #9D9893;
            border-radius: 25px;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            transition: background-color 0.2s ease;
        }
        
        .toggle-switch .switch::before {
            position: absolute;
            content: '';
            left: 2px;
            top: 2px;
            width: 21px;
            height: 21px;
            background-color: #FFFFFF;
            border-radius: 50%;
            transition: transform 0.3s ease;
        }
        
        .toggle-switch input[type='checkbox']:checked + .switch::before {
            transform: translateX(25px);
            background-color: #DE8821;
        }
        
        .toggle-switch input[type='checkbox']:checked + .switch {
            background-color: #fabc73;
        }
        
        .label {
            color: #212121;
        }
    `;

    return (
        <div>
            <style>{switchStyles}</style>
            <div className="toggle-container">
                <label className="toggle-switch">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                            onToggleChange();
                        }}
                    />
                    <span className="switch" />
                </label>
                <span className="label">{checked ? 'On' : 'Off'}</span>
            </div>
        </div>
    );
};

ToggleSwitchCustom.propTypes = {
    onToggleChange: PropTypes.func.isRequired,
    checked: PropTypes.bool.isRequired
};

export default ToggleSwitchCustom;
