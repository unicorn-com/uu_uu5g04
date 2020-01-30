/**
 * Copyright (C) 2019 Unicorn a.s.
 *
 * This program is free software; you can use it under the terms of the UAF Open License v01 or
 * any later version. The text of the license is available in the file LICENSE or at www.unicorn.com.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See LICENSE for more details.
 *
 * You may contact Unicorn a.s. at address: V Kapslovne 2767/2, Praha 3, Czech Republic or
 * at the email: info@unicorn.com.
 */

export const CommonLsi = {
  loadMixin: {
    error: {
      cs: "Data ze serveru nebylo možné načíst.",
      en: "Data from server cannot be loaded."
    }
  },
  vucMixin: {
    notAuthorized: {
      cs: "Nemáte práva na zobrazení vizuálního případu užití.",
      en: "You have not permission to show visual use case."
    },
    serverConnection: {
      cs: "Server je dočasně nedostupný.",
      en: "Server is temporarily unavailable."
    }
  },
  error: {
    showErrorDetails: {
      cs: "Zobrazit podrobnosti o chybě.",
      en: "View error details."
    },
    hideErrorDetails: {
      cs: "Skrýt podrobnosti o chybě.",
      en: "Hide error details."
    },
    copyButton: {
      cs: "Kopírovat podrobnosti o chybě",
      en: "Copy error details"
    }
  },
  router: {
    pageLeaveConfirmationHeader: {
      cs: "Chcete tuto stránku opustit?",
      en: "Do you want to leave this page?"
    },
    pageLeaveConfirmationBody: {
      cs: "Je možné, že provedené změny nebudou uloženy.",
      en: "Changes you made may not be saved."
    },
    pageLeaveConfirm: {
      cs: "Odejít",
      en: "Leave"
    },
    pageLeaveDeny: {
      cs: "Zůstat",
      en: "Stay"
    },
    routeError: {
      cs: "Při zobrazování uuRoute došlo k chybě.",
      en: "There was an error while displaying uuRoute."
    }
  },
  notFoundTag: {
    offline: {
      cs: "Komponenta %s nemohla být načtená, protože jste offline.",
      en: "The component %s cannot be loaded because you are offline."
    },
    notFound: {
      cs: "Komponenta %s neexistuje.",
      en: "The component %s does not exist."
    }
  }
};

export default CommonLsi;
