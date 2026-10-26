import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="app-header py-2 px-3 d-flex justify-content-between align-items-center shadow-sm">
        <div className="d-flex align-items-center gap-2">
            <img src="/images/heart_logo.svg" alt="Лого" width="42" height="42" />
            <span className="logo-text">МедСити</span>
        </div>
        <div className="contacts text-end">
            <div className="contacts-text">Контакты</div>
            <div className="contacts-text">+7 (495) 364-18-92</div>
        </div>
    </header>
  );
};

export default Header;