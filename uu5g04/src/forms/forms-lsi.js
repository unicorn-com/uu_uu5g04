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

export const FormsLsi = {
  message: {
    patternMessage: {
      en: "Enter a value that matches the specified format.",
      cs: "Zadejte hodnotu, která odpovídá požadovanému formátu."
    },
    requiredMessage: { en: "This field is required.", cs: "Toto pole je povinné." },
    requiredMessageChoice: { en: "Select some item.", cs: "Vyberte položku." },
    requiredMessageGroup: { en: "Choose at least one option.", cs: "Vyberte alespoň jednu položku." }
  },
  formMixin: {
    validContent: { en: "Form is valid.", cs: "Formulář je validní." },
    invalidContent: { en: "Form is not valid.", cs: "Formulář není validní." }
  },
  controls: {
    ok: { en: "OK", cs: "OK" },
    validate: { en: "Validate", cs: "Zvalidovat" },
    reset: { en: "Reset", cs: "Reset" },
    cancel: { en: "Cancel", cs: "Zrušit" }
  },
  time: {
    hours: { en: "Hours", cs: "Hodiny" },
    minutes: { en: "Minutes", cs: "Minuty" },
    seconds: { en: "Seconds", cs: "Sekundy" }
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
      uk: "Вибрати все"
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
      uk: "Cкасувати всі"
    }
  },
  iconPicker: {
    noMatchError: {
      cs: "Žádné výsledky",
      en: "No matches"
    },
    loadError: {
      cs: "Vybranou kategorii se nepodařilo načíst",
      en: "Selected category couldn't be loaded"
    },
    searchPlaceholder: {
      cs: "Hledat ikonu",
      en: "Search icon"
    },
    removeSelection: {
      cs: "Odstranit vybranou ikonu",
      en: "Remove selected icon"
    },
    selectAll: {
      cs: "Všechny ikony",
      en: "All icons"
    }
  },
  colorPicker: {
    invalidFormat: {
      cs: "Formát hodnoty {0} není validní.",
      en: "Invalid format of value {0}."
    },
    clearButton: {
      cs: "Bez barvy",
      en: "Clear"
    },
    preview: {
      cs: "Ukázka",
      en: "Preview"
    }
  },
  number: {
    nanMessage: {
      cs: "Prosím vložte číslo.",
      en: "Please insert a number."
    },
    lowerMessage: {
      cs: "Zadejte prosím větší číslo. Minimální povolená hodnota je",
      en: "Please type in bigger number. Minimum allowed value is"
    },
    upperMessage: {
      cs: "Zadejte prosím menší číslo. Maximální povolená hodnota je",
      en: "Please type in smaller number. Maximum allowed value is"
    }
  },
  file: {
    dropHere: {
      cs: "Přesuňte soubor sem",
      en: "Move file here"
    }
  },
  tagSelect: {
    addButtonLabel: {
      cs: "Přidat",
      en: "Add"
    },
    tagIsAlreadyAdded: {
      cs: 'Tag "$1" je již přidaný.',
      en: 'The tag "$1" is already added.'
    },
    customTagIsNotAllowed: {
      cs: "Není povolené přidávat vlastní tagy.",
      en: "It is not allowed to create custom tags."
    },
    tagIsNotAllowed: {
      cs: 'Tag "$1" není povolený.',
      en: 'The tag "$1" is not allowed.'
    },
    placeholder: {
      cs: "Název tagu",
      en: "Tag Name"
    },
    noTagInfoText: {
      cs: "Vložte tag pomocí vstupního pole níže",
      en: "Insert a tag via input field lower"
    }
  }
};

export default FormsLsi;
