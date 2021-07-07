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

export const FormsLsi = {
  message: {
    patternMessage: {
      en: "Enter a value that matches the specified format.",
      cs: "Zadejte hodnotu, která odpovídá požadovanému formátu.",
      sk: "Zadajte hodnotu, ktorá odpovedá požadovanému formátu.",
      uk: "Введіть значення яке відповідає заданому формату.",
    },
    requiredMessage: {
      en: "This field is required.",
      cs: "Toto pole je povinné.",
      sk: "Toto pole je povinné.",
      uk: "Це поле є обов'язковим",
    },
    requiredMessageChoice: {
      en: "Select some item.",
      cs: "Vyberte položku.",
      sk: "Vyberte položku.",
      uk: "Виберіть значення.",
    },
    requiredMessageGroup: {
      en: "Choose at least one option.",
      cs: "Vyberte alespoň jednu položku.",
      sk: "Vyberte aspoň jednu položku.",
      uk: "Виберіть принаймні одне значення.",
    },
  },
  formMixin: {
    validContent: {
      en: "Form is valid.",
      cs: "Formulář je validní.",
      sk: "Formulár je validný.",
      uk: "Форма є дійсна.",
    },
    invalidContent: {
      en: "Form is not valid.",
      cs: "Formulář není validní.",
      sk: "Formulár nie je validný.",
      uk: "Форма є не дійсна.",
    },
  },
  controls: {
    ok: {
      en: "OK",
      cs: "OK",
      sk: "OK",
      uk: "OK",
    },
    validate: {
      en: "Validate",
      cs: "Zvalidovat",
      sk: "Validovať",
      uk: "Валідувати",
    },
    reset: {
      en: "Reset",
      cs: "Reset",
      sk: "Reset",
      uk: "Скинути",
    },
    cancel: {
      en: "Cancel",
      cs: "Zrušit",
      sk: "Zrušit",
      uk: "Відмінити",
    },
  },
  time: {
    hours: {
      en: "Hours",
      cs: "Hodiny",
      sk: "Hodiny",
      uk: "Години",
    },
    minutes: {
      en: "Minutes",
      cs: "Minuty",
      sk: "Minúty",
      uk: "Хвилини",
    },
    seconds: {
      en: "Seconds",
      cs: "Sekundy",
      sk: "Sekundy",
      uk: "Секунди",
    },
  },
  select: {
    selectAll: {
      cs: "Vybrat vše",
      nl: "Selecteer alles",
      en: "Select all",
      "en-gb": "Select all",
      "en-us": "Select all",
      fr: "Tout sélectionner",
      de: "Alles auswählen",
      pl: "Zaznacz wszystko",
      ru: "Выбрать все",
      sk: "Vybrať všetko",
      es: "Seleccionar todo",
      uk: "Вибрати все",
    },
    unselectAll: {
      cs: "Odebrat vše",
      nl: "Deselecteer alles",
      en: "Deselect all",
      "en-gb": "Deselect all",
      "en-us": "Deselect all",
      fr: "Tout déselectionner",
      de: "Alle abwählen",
      pl: "Odznacz wszystkie",
      ru: "Удалить все",
      sk: "Odznačiť všetko",
      es: "Anular la selección de todo",
      uk: "Cкасувати всі",
    },
  },
  iconPicker: {
    noMatchError: {
      cs: "Žádné výsledky",
      en: "No matches",
      sk: "Žiadne výsledky",
      uk: "Збігів не знайдено",
    },
    loadError: {
      cs: "Vybranou kategorii se nepodařilo načíst",
      en: "Selected category couldn't be loaded",
      sk: "Vybranú kategóriu sa nepodarilo načítať",
      uk: "Обрану категорію неможливо загрузити",
    },
    searchPlaceholder: {
      cs: "Hledat ikonu",
      en: "Search icon",
      sk: "Hľadať ikonu",
      uk: "Знайти іконку",
    },
    removeSelection: {
      cs: "Odstranit vybranou ikonu",
      en: "Remove selected icon",
      sk: "Odstrániť vybranú ikonu",
      uk: "Видалити обрану іконку",
    },
    selectAll: {
      cs: "Všechny ikony",
      en: "All icons",
      sk: "Všetky ikony",
      uk: "Всі іконки",
    },
  },
  colorPicker: {
    invalidFormat: {
      cs: "Formát hodnoty {0} není validní.",
      en: "Invalid format of value {0}.",
      sk: "Formát hodnoty {0} nie je validný",
      uk: "Формат значення {0} некоректний.",
    },
    clearButton: {
      cs: "Bez barvy",
      en: "Clear",
      sk: "Bez farieb",
      uk: "Без кольору",
    },
    preview: {
      cs: "Ukázka",
      en: "Preview",
      sk: "Ukážka",
      uk: "Перегляд",
    },
  },
  number: {
    nanMessage: {
      cs: "Prosím vložte číslo.",
      en: "Please insert a number.",
      sk: "Prosím vložte číslo.",
      uk: "Будь ласка вкажіть число.",
    },
    lowerMessage: {
      cs: "Zadejte prosím větší číslo. Minimální povolená hodnota je %d.",
      en: "Please type in bigger number. Minimum allowed value is %d.",
      sk: "Zadajte prosím väčšie číslo. Minimálna povolená hodnota je %d.",
      uk: "Будь ласка вкажіть велике число. Мінімальне значення є %d.",
    },
    upperMessage: {
      cs: "Zadejte prosím menší číslo. Maximální povolená hodnota je %d.",
      en: "Please type in smaller number. Maximum allowed value is %d.",
      sk: "Zadajte prosím menšie číslo. Maximálna povolená hodnota je %d.",
      uk: "Будь ласка вкажіть невелике число. Максимальне значення є %d.",
    },
  },
  file: {
    dropHere: {
      cs: "Přesuňte soubor sem",
      en: "Move file here",
      sk: "Presuňte súbor sem",
      uk: "Перемістіть файл сюди",
    },
  },
  tagSelect: {
    addButtonLabel: {
      cs: "Přidat",
      en: "Add",
      sk: "Pridať",
      uk: "Додати",
    },
    tagIsAlreadyAdded: {
      cs: 'Tag "%s" je již přidaný.',
      en: 'The tag "%s" is already added.',
      sk: 'Tag "%s" je už pridaný',
      uk: 'Тег "%s" вже додано.',
    },
    customTagIsNotAllowed: {
      cs: "Není povolené přidávat vlastní tagy.",
      en: "It is not allowed to create custom tags.",
      sk: "Nie je povolené pridávať vlastné tagy.",
      uk: "Не дозволено створювати власні теги.",
    },
    tagIsNotAllowed: {
      cs: 'Tag "%s" není povolený.',
      en: 'The tag "%s" is not allowed.',
      sk: 'Tag "%s" nie je povolený.',
      uk: 'Тег "%s" не дозволений.',
    },
    placeholder: {
      cs: "Název tagu",
      en: "Tag Name",
      sk: "Názov tagu",
      uk: "Назва тегу",
    },
    noTagInfoText: {
      cs: "Vložte tag pomocí vstupního pole níže.",
      en: "Insert a tag via input field lower.",
      sk: "Vložte tag pomocou vstupného poľa nižšie.",
      uk: "Вставте тег в поле для вводу нижче.",
    },
  },
};

export default FormsLsi;
