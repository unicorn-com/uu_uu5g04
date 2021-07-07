/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

export const CommonLsi = {
  loadMixin: {
    error: {
      cs: "Data ze serveru nebylo možné načíst.",
      en: "Data from server cannot be loaded.",
      sk: "Dáta zo serveru nebolo možné načítať",
      uk: "Не вдалось отримати дані з сервера.",
    },
  },
  vucMixin: {
    notAuthorized: {
      cs: "Nemáte práva na zobrazení vizuálního případu užití.",
      en: "You have not permission to show visual use case.",
      sk: "Nemáte práva na zobrazenie vizuálneho prípadu použitia.",
      uk: "Ви не маєте прав на перегляд.",
    },
    serverConnection: {
      cs: "Server je dočasně nedostupný.",
      en: "Server is temporarily unavailable.",
      sk: "Server je dočasne nedostupný.",
      uk: "Сервер тимчасово не доступний.",
    },
  },
  error: {
    showErrorDetails: {
      cs: "Zobrazit podrobnosti o chybě.",
      en: "View error details.",
      sk: "Zobraziť podrobnosti o chybe.",
      uk: "Показати деталі помилки.",
    },
    hideErrorDetails: {
      cs: "Skrýt podrobnosti o chybě.",
      en: "Hide error details.",
      sk: "Skryť podrobnosti o chybe.",
      uk: "Приховати деталі помилки.",
    },
    copyButton: {
      cs: "Kopírovat podrobnosti o chybě",
      en: "Copy error details",
      sk: "Skopírovať podrobnosti o chybe.",
      uk: "Скопіювати деталі помилки",
    },
  },
  router: {
    pageLeaveConfirmationHeader: {
      cs: "Chcete tuto stránku opustit?",
      en: "Do you want to leave this page?",
      sk: "Chcete túto stránku opustiť?",
      uk: "Ви бажаєте покинути сторінку?",
    },
    pageLeaveConfirmationBody: {
      cs: "Je možné, že provedené změny nebudou uloženy.",
      en: "Changes you made may not be saved.",
      sk: "Je možné, že vykonané zmeny nebudú uložené.",
      uk: "Внесені зміни можливо не будуть збережені.",
    },
    pageLeaveConfirm: {
      cs: "Odejít",
      en: "Leave",
      sk: "Opustiť",
      uk: "Вийти",
    },
    pageLeaveDeny: {
      cs: "Zůstat",
      en: "Stay",
      sk: "Zostať",
      uk: "Залишитись",
    },
    routeError: {
      cs: "Při zobrazování uuRoute došlo k chybě.",
      en: "There was an error while displaying uuRoute.",
      sk: "Pri zobrazovaní uuRoute došlo k chybe.",
      uk: "Помилка при відображенні uuRoute.",
    },
  },
  notFoundTag: {
    offline: {
      cs: "Komponenta %s nemohla být načtená, protože jste offline.",
      en: "The component %s cannot be loaded because you are offline.",
      sk: "Komponenta %s nemohla byť načítaná, pretože ste offline.",
      uk: "Неможливо загрузити компонент %s оскільки ви offline.",
    },
    notFound: {
      cs: "Komponenta %s neexistuje.",
      en: "The component %s does not exist.",
      sk: "Komponenta %s neexistuje",
      uk: "Компонент %s не існує",
    },
  },
};

export default CommonLsi;
