const Theme = {
    global: {
        button: {
            default: {
                background: {
                    color: '#212121'
                }
            },
            color: '#fdf6ed',
            primary: {
                background: {
                    color: '#212121'
                }
            },
            border: {
                color: '#212121',
                radius: '4em'
            }
        },
        colors: {
            background: '#fdf6ed',
            brand: '#de8821',
            'accent-1': '#212121',
            text: {
                dark: '#fdfffc',
                light: '#212121'
            }
        },
        focus: {
            border: {
                color: 'accent-1'
            }
        },
        hover: {
            background: 'accent-1'
        }
    },
    button: {
        border: {
            radius: '0.2em'
        }
    },
    select: {
        control: {
            extend: 'padding: 3px 6px;',
            open: {
                background: '#ece0fa',
                border: '1px solid #7D4CDB'
            }
        },
        icons: {
            color: 'dark-1',
            margin: 'small'
        },
        container: {
            text: {
                size: 'small'
            },
            extend: 'max-height: 250px;'
        }
    }
};

export default Theme;
