import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import i18next from 'i18next';
import {I18nextProvider, initReactI18next} from 'react-i18next';
import ru from './translations/ru.ts';
import {Provider} from 'react-redux';
import Store from './store/index.ts';

const lng = import.meta.env.VITE_LANGEAGE;

//Connecting translation files and setting the default application language
i18next.use(initReactI18next).init({
  lng: lng,
  resources: {
    ru,
  },
  fallbackLng: 'en',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <I18nextProvider i18n={i18next}>
    <React.StrictMode>
      <Provider store={Store}>
        <App />
      </Provider>
    </React.StrictMode>
  </I18nextProvider>,
);
