//@@viewOn:revision
// coded: Petr Bišof, 18.09.2020
// reviewed: Martin Mach, 20.09.2020
//@@viewOff:revision

export const EditableLsi = {
  common: {
    valueTrue: {
      cs: "zapnuto",
      en: "enabled",
      sk: "zapnuté",
      uk: "увімкнено",
    },
    valueFalse: {
      cs: "vypnuto",
      en: "disabled",
      sk: "vypnuté",
      uk: "вимкнено",
    },
    headerPlaceholder: {
      cs: "Hlavička",
      en: "Header",
    },
    footerPlaceholder: {
      cs: "Patička",
      en: "Footer",
    },
    defaultLevel: {
      cs: "Výchozí úroveň",
      en: "Default Level",
    },
    showHeaderCheckboxLabel: {
      cs: "Hlavička",
      en: "Header",
    },
    showFooterCheckboxLabel: {
      cs: "Patička",
      en: "Footer",
    },
    underlineTooltip: {
      cs: "Podtržení hlavičky",
      en: "Header Underline",
    },
    level: {
      cs: "Úroveň",
      en: "Level",
    },
    levelTooltip: {
      cs: "Úroveň hlavičky",
      en: "Header Level",
    },
    colorSchemaTooltip: {
      cs: "Barevné schéma",
      en: "Color Schema",
    },
    settingButtonLabel: {
      cs: "Nastavení",
      en: "Settings",
    },
    controlsSubmitButton: {
      cs: "Editovat",
      en: "Edit",
    },
    controlsCancelButton: {
      cs: "Zrušit",
      en: "Cancel",
    },
    itemInfo: {
      cs: 'Pro upravení obsahu položky použijte "inline" editaci mimo toto modální okno',
      en: 'To edit the item\'s content use the "inline" editation outside of the modal window.',
    },
    componentPropsLabel: {
      cs: "Základní vlastnosti",
      en: "Basic properties",
      sk: "Základné vlastnosti",
      uk: "Основні властивості",
    },
    advancedPropsLabel: {
      cs: "Pokročilé",
      en: "Advanced",
      sk: "Vedľajšie",
      uk: "Розширений",
    },
    displayPropsLabel: {
      cs: "Vzhled",
      en: "Visual",
      sk: "Vzhľad",
      uk: "Зовнішній вигляд",
    },
    bgStyleLabel: {
      en: "Background style",
      cs: "Styl pozadí",
    },
    bgStyleValueFilled: {
      cs: "vyplněný",
      en: "filled",
      sk: "vyplnený",
      uk: "заповнене",
    },
    bgStyleValueOutline: {
      cs: "ohraničený",
      en: "outline",
      sk: "ohraničený",
      uk: "контур",
    },
    bgStyleValueTransparent: {
      cs: "transparentní",
      en: "transparent",
      sk: "transparentné",
      uk: "прозорий",
    },
    bgStyleValueUnderline: {
      cs: "podtržený",
      en: "underline",
      sk: "podčiarknutý",
      uk: "підкреслення",
    },
    colorSchema: {
      cs: "Barevné schéma",
      en: "Color Scheme",
      sk: "Farba", // TODO
      uk: "Колір", // TODO
    },
    sizeLabel: {
      cs: "Velikost",
      en: "Size",
      sk: "Veľkosť",
      uk: "Розмір",
    },
    sizeValueS: {
      cs: "s",
      en: "s",
      sk: "s",
      uk: "s",
    },
    sizeValueM: {
      cs: "m",
      en: "m",
      sk: "m",
      uk: "m",
    },
    sizeValueL: {
      cs: "l",
      en: "l",
      sk: "l",
      uk: "l",
    },
    sizeValueXL: {
      cs: "xl",
      en: "xl",
      sk: "xl",
      uk: "xl",
    },
    contentLabel: {
      cs: "Obsah",
      en: "Content",
    },
    hrefLabel: {
      en: "URL address",
      cs: "URL adresa",
    },
    targetLabel: {
      en: "Target",
      cs: "Target",
    },
    targetValueBlank: {
      en: "blank",
      cs: "Blank",
    },
    targetValueParent: {
      en: "parent",
      cs: "parent",
    },
    targetValueTop: {
      en: "top",
      cs: "top",
    },
    targetValueSelf: {
      en: "self",
      cs: "self",
    },
    smoothScrollLabel: {
      en: "Scroll duration to the fragment",
      cs: "Doba scrollování k fragmentu",
    },
    smoothScrollMessage: {
      en:
        "The time it takes to scroll to the location that is defined by the URL adress. The location is defined by an element's id. E.g. https://unicorn.com#contacts",
      cs:
        "Doba scrollování k lokaci definované v URL adrese. Lokace je definována atributem id elementu. Např. https://unicorn.com#contacts",
    },
    offsetLabel: {
      en: "Distance from the target location",
      cs: "Odstup od cílové lokace",
    },
    offsetMessage: {
      en:
        "The number of pixels that will end up being between the target location defined in URL address and the top viewport border",
      cs: "Vzdálenost jaká zůstane mezi lokací definovanou v URL adrese a mezi horní hranou viewportu",
    },
    elevationLabel: {
      cs: "Úroveň vyvýšení",
      en: "Elevation",
    },
    elevationHoverLabel: {
      cs: "Úroveň vyvýšení při najetí",
      en: "Elevation Hover",
    },
  },
  section: {
    name: { en: "Section", cs: "Sekce" },
  },
  container: {
    noSpacingTooltip: {
      cs: "Nulové odsazení",
      en: "Zero indentation",
    },
    name: {
      cs: "Kontejner",
      en: "Container",
    },
  },
  row: {
    name: { en: "Row", cs: "Řádek" },
    flexCheckboxLabel: {
      cs: "Stejná výška sloupců",
      en: "Same column height",
    },
    componentDescription: {
      cs:
        "<uu5string />Komponenta <UU5.Bricks.Link href='https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book/page?code=uu5BricksRow' content='UU5.Bricks.Row' /> se používá uvnitř komponenty UU5.Bricks.Container a představuje řádek. Lze ji využít pro naformátování textu a komponent do jednotlivých řádků.",
      en:
        "<uu5string />The <UU5.Bricks.Link href='https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book/page?code=uu5BricksRow' content='UU5.Bricks.Row' /> component is used as a child component of the UU5.Bricks.Container component and represents a row. It is used to format text and components into individual rows.",
    },
    layoutTooltip: {
      cs: "Rozvržení",
      en: "Layout",
    },
    layoutConfirmModalContent: {
      cs: "Chystáte se provést potenciálně destruktivní změny. Opravdu si přejete tuto změnu povést?",
      en: "You are about to do a potentially destructive action. Are you sure you want to proceed?",
    },
    layoutConfirmModalHeader: {
      cs: "Změnit layout?",
      en: "Change layout?",
    },
    layoutConfirmModalConfirm: {
      cs: "Změnit",
      en: "Change",
    },
    layoutConfirmModalCancel: {
      cs: "Zrušit",
      en: "Cancel",
    },
    mainPropertiesLabel: {
      cs: "Vlastnosti řádku",
      en: "Row Properties",
    },
    displayLabel: {
      cs: "Zobrazení",
      en: "Display",
    },
    displayValueStandard: {
      cs: "standardní",
      en: "standard",
    },
    displayValueFlex: {
      cs: "flex",
      en: "flex",
    },
    horizontalPaddingLabel: {
      cs: "Horizontalní padding",
      en: "Horizontal padding",
    },
    horizontalPaddingValueStandard: {
      cs: "standard",
      en: "standard",
    },
    horizontalPaddingValueNone: {
      cs: "bez paddingu",
      en: "none",
    },
    classNameLabel: {
      cs: "CSS třída",
      en: "Class Name",
    },
    colWidthLabel: {
      cs: "Šířka sloupce",
      en: "Column Width",
    },
    colWidthTooltip: {
      cs:
        "Můžete definovat šířku sloupce pomocí standardních CSS jednotek, např. 200px, 10em nebo 33%. Také ale můžete použít jednotky pro responzivní zobrazení, např „xs-6 m-3”.",
      en:
        "You can define column’s width with standard CSS values like 200px, 10em or 33%. You can also use values for responsive grid like „xs-6 m-3”.",
    },
    columnsWidthPresetLabel: {
      cs: "Přednastavé šířky sloupců",
      en: "Columns width preset",
    },
  },
  column: {
    name: { en: "Column", cs: "Sloupec" },
    componentDescription: {
      cs:
        "<uu5string />Komponenta <UU5.Bricks.Link href='https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book/page?code=uu5BricksColumn' content='UU5.Bricks.Column' /> je založena na nápadu a implementaci Bootstrap mřížky (viz <UU5.Bricks.Link href='https://www.w3schools.com/bootstrap/bootstrap_grid_basic.asp' target='_blank' content='W3Schools - Bootstrap Grid System'/>) a reprezentuje sloupec. Tato komponenta musí být obalena komponentou UU5.Bricks.Row jinak by mohlo dojít k překrývání obsahu sloupce elementy, které v dokumentu následují. Šířka komponenty může být nastavena pomocí props a může se lišit pro různé velikosti obrazovky.",
      en:
        "<uu5string />The <UU5.Bricks.Link href='https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book/page?code=uu5BricksColumn' content='UU5.Bricks.Column' /> component is based on the Bootstrap grid implementation (see <UU5.Bricks.Link href='https://www.w3schools.com/bootstrap/bootstrap_grid_basic.asp' target='_blank' content='W3Schools - Bootstrap Grid System'/>) and represents a column. This component must be wrapped by the UU5.Bricks.Row component (otherwise, the contents of the column may overlap with the elements that follow in the document). The component width can be adjusted by built-in properties and can differ for different screen sizes.",
    },
    widthInputLabel: {
      cs: "Šířka",
      en: "Width",
    },
    widthInputMessage: {
      cs:
        "<uu5string />Lze nastavit hodnoty pro <UU5.Bricks.Code content='width' /> nebo <UU5.Bricks.Code content='colWidth' /> dle <UU5.Bricks.Link href='https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book/page?code=uu5BricksColumn' content='dokumentace' />.",
      en:
        "<uu5string />Values for <UU5.Bricks.Code content='width' /> or <UU5.Bricks.Code content='colWidth' /> are allowed according to the <UU5.Bricks.Link href='https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book/page?code=uu5BricksColumn' content='documentation' />.",
    },
    noSpacingTooltip: {
      cs: "Nulové odsazení",
      en: "Zero indentation",
    },
    horizontalPaddingLabel: {
      cs: "Horizontalní padding",
      en: "Horizontal padding",
    },
    horizontalPaddingValueStandard: {
      cs: "standard",
      en: "standard",
    },
    horizontalPaddingValueNone: {
      cs: "bez paddingu",
      en: "none",
    },
    classNameLabel: {
      cs: "CSS třída",
      en: "Class Name",
    },
    colWidthLabel: {
      cs: "Šířka sloupce",
      en: "Column Width",
    },
    colWidthTooltip: {
      cs:
        "Můžete definovat šířku sloupce pomocí standardních CSS jednotek, např. 200px, 10em nebo 33%. Také ale můžete použít jednotky pro responzivní zobrazení, např „xs-6 m-3”.",
      en:
        "You can define column’s width with standard CSS values like 200px, 10em or 33%. You can also use values for responsive grid like „xs-6 m-3”.",
    },
  },
  block: {
    backgroundCheckboxLabel: {
      cs: "Pozadí",
      en: "Background",
    },
  },
  blockquote: {
    componentDescription: {
      cs: `<uu5string/>Komponenta <UU5.Bricks.Code content='UU5.Bricks.Blockquote'/> vychází z komponenty blockquote podle standardu <UU5.Bricks.LinkBootstrap/>.
        Komponenta přidá vlevo od zadaného obsahu vertikální pruh v barvě podle zadaného <UU5.Bricks.Code content='colorSchema'/> a pomocí vlastnosti
      <UU5.Bricks.Code content='background'/> i barevně odpovídající pozadí. Pokud není <UU5.Bricks.Code content='colorSchema'/>
      definováno přímo na komponentě, přebírá jej od nadřazené komponenty. <br/><br/>
      Od komponenty <UU5.Bricks.Link href='https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book/page?code=uu5BricksBlockquote' content='UU5.Bricks.Blockquote' />
      se liší formátováním textu a vlastnostmi, které se dají komponentě <UU5.Bricks.Code content='blockquote'/> nastavit: <UU5.Bricks.Code content='alignment'/> - zarovnání obsahu vpravo či vlevo,
      <UU5.Bricks.Code content='footer'/> - zápatí, <UU5.Bricks.Code content='footerAlignment'/> - zarovnání zápatí vpravo či vlevo. Komponenta <UU5.Bricks.Code content='block'/> má pouze vlastnost <UU5.Bricks.Code content='background'/>.
      Komponenta <UU5.Bricks.Code content='UU5.Bricks.Blockquote'/> se používá hlavně v případě, že chceme zobrazit nějakou citaci, kde do zápatí vložíme např. jméno autora.
      Komponenta <UU5.Bricks.Code content='UU5.Bricks.Block'/> je zase vhodnější, když potřebujeme zobrazit např. nějaké upozornění, kde není nutné vkládat další text do zápatí.`,
      en: `The <UU5.Bricks.Code content = 'UU5.Bricks.Blockquote'/> component is based on the blockquote component according to the <UU5.Bricks.LinkBootstrap/> standard.
        The component adds a vertical strip to the left of any content in a color according to the <UU5.Bricks.Code content = 'colorSchema'/> and in a backround color based on the
        <UU5.Bricks.Code content = 'background'/> property. If the <UU5.Bricks.Code content = 'colorSchema'/> is not defined directly on the component, it is taken from the parent component
      which has the <UU5.Bricks.Code content = 'colorSchema'/> defined. <br/> <br/>
      From the <UU5.Bricks.Link href='https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book/page?code=uu5BricksBlockquote' content='UU5.Bricks.Blockquote' /> component it differs in text formatting and properties.
        The <UU5.Bricks.Code content = 'UU5.Bricks.Block'/> component has only the <UU5.Bricks.Code content = 'background'/> property
        but to the <UU5.Bricks.Code content = 'blockquote'/> component, apart from the <UU5.Bricks.Code content = 'background'/>, we can also set the <UU5.Bricks.Code content = 'alignment'/>
        - content alignment to the left or right, a <UU5.Bricks.Code content = 'footer'/> and the <UU5.Bricks.Code content = 'footerAlignment'/>
        - a footer alignment to the left or right <br/>
      The <UU5.Bricks.Code content = 'UU5.Bricks.Blockquote'/> component is used mainly if we want to display a quotation, where we include the author's name in the footer.
      The <UU5.Bricks.Code content = 'UU5.Bricks.Block'/> component is more preferable when we need to display a warning, for example, where there is no need to insert additional text into the footer.`,
    },
    backgroundCheckboxLabel: {
      cs: "Pozadí",
      en: "Background",
    },
    footerAlignmentInputLabel: {
      cs: "Zarovnání patičky",
      en: "Footer alignment",
    },
    footerAlignmentLeft: {
      cs: "vlevo",
      en: "left",
    },
    footerAlignmentRight: {
      cs: "vpravo",
      en: "right",
    },
    noSpacingTooltip: {
      cs: "Nulové odsazení",
      en: "Zero indentation",
    },
  },
  colorPicker: {
    defaultColorSchema: {
      cs: "Výchozí barva",
      en: "Default Color",
    },
    colorSchemaTooltip: {
      cs: "Barevnost",
      en: "Color",
    },
  },
  authenticated: {
    authenticated: {
      en: "Authenticated",
      cs: "Přihlášený",
    },
    notAuthenticated: {
      en: "Unathenticated",
      cs: "Nepřihlášený",
    },
    name: {
      en: "Authenticated",
      cs: "Authenticated",
    },
    pending: {
      en: "Pending",
      cs: "Neznámý",
    },
  },
  tabs: {
    name: { en: "Tabs", cs: "Taby" },
    typeLabel: {
      cs: "Typ zobrazení záložek",
      en: "Type",
      sk: "Typ zobrazenia záložiek",
      uk: "Тип відображення закладок",
    },
    typeValueTabs: {
      cs: "podtržené záložky",
      en: "tabs",
      sk: "podčiarknuté záložky",
      uk: "підкреслені закладки",
    },
    typeValuePills: {
      cs: "vyplněné záložky",
      en: "pills",
      sk: "vyplnené záložky",
      uk: "заповнені закладки",
    },
    borderRadiusLabel: {
      cs: "Zaoblení okrajů",
      en: "Border Radius",
      sk: "Zaobalenie okrajov",
      uk: "Радіус заокруглення",
    },
    borderRadiusPlaceholder: {
      cs: "Např. 16px 16px 0 0",
      en: "For example 16px 16px 0 0",
      sk: "Napr. 16px 16px 0 0",
      uk: "Напр. 16px 16px 0 0",
    },
    elevationLabel: {
      cs: "Úroveň vyvýšení aktivní záložky",
      en: "Elevation of Active Tab",
      sk: "Úroveň vyvýšenia aktívnej záložky",
      uk: "Рівень підйому активної закладки",
    },
    elevationHoverLabel: {
      cs: "Úroveň vyvýšení aktivní záložky při najetí",
      en: "Elevation Hover of Active tab",
      sk: "Úroveň vyvýšenia aktívnej záložky pri nabehnutí",
      uk: "Рівень підйому активної закладки при наведенні",
    },
    justifiedLabel: {
      cs: "Zarovnání záložek",
      en: "Justified",
      sk: "Zarovnanie záložiek",
      uk: "Вирівнювання закладок",
    },
    justifiedValueFalse: {
      cs: "vypnuto",
      en: "disabled",
      sk: "vypnuté",
      uk: "вимкнено",
    },
    justifiedValueTrue: {
      cs: "zapnuto",
      en: "enabled",
      sk: "zapnuté",
      uk: "увімкнено",
    },
    fadeLabel: {
      cs: "Animace při změně aktivního tabu",
      en: "Active tab change animation",
      sk: "Animácia pri zmene aktívneho tabu",
      uk: "Анімація зміни активної закладки",
    },
    fadeValueFalse: {
      cs: "vypnuto",
      en: "disabled",
      sk: "vypnuté",
      uk: "вимкнено",
    },
    fadeValueTrue: {
      cs: "zapnuto",
      en: "enabled",
      sk: "zapnuté",
      uk: "yвімкнено",
    },
    underlineLabel: {
      cs: "Podtržení záhlaví",
      en: "Underline",
      sk: "Podčiarknutie záhlavia",
      uk: "Підкреслити заголовок",
    },
    underlineValueFalse: {
      cs: "vypnuto",
      en: "disabled",
      sk: "vypnuté",
      uk: "вимкнено",
    },
    underlineValueTrue: {
      cs: "zapnuto",
      en: "enabled",
      sk: "zapnuté",
      uk: "yвімкнено",
    },
    idLabel: {
      cs: "Id komponenty",
      en: "Component's id",
      sk: "Id komponenty",
      uk: "Id компоненту",
    },
    disabledLabel: {
      cs: "Stav komponenty",
      en: "Component's state",
      sk: "Stav komponenty",
      uk: "Стани компоненту",
    },
    disabledValueFalse: {
      cs: "aktivní",
      en: "enabled",
      sk: "aktívny",
      uk: "активний",
    },
    disabledValueTrue: {
      cs: "neaktivní",
      en: "disabled",
      sk: "neaktívny",
      uk: "неактивний",
    },
    mountTabContentLabel: {
      en: "Tab content mount method",
      cs: "Způsob přimountění obsahu záložek",
    },
    mountTabContentValueOnActive: {
      en: "on active",
      cs: "při zaktivnění",
    },
    mountTabContentValueOnFirstActive: {
      en: "on first active",
      cs: "při prvním zaktivnění",
    },
    mountContentDescription: {
      en: `Defines when is the content of the tab mounted. Choosing a value like "on active" is recommended for performance optimalization.`,
      cs: `Udává kdy se namountí obsah jednotlivých záložek. Výběr hodnoty jako je "při zaktivnění" je doporučen pro optimalizaci výkonu.`,
    },
    initialActiveNameLabel: {
      en: "Initial Active Tab",
      cs: "Výchozí aktivní záložka",
    },
    tabNameLabel: {
      cs: "Název záložky",
      en: "Tab's Name",
      sk: "Názov záložky",
      uk: "Назва закладки",
    },
    tabHeaderLabel: {
      cs: "Hlavička záložky",
      en: "Tab's Header",
      sk: "Hlavička záložky",
      uk: "Заголовок закладки",
    },
    newItemHeader: {
      cs: "Nová položka",
      en: "New Item",
      sk: "Nová položka",
      uk: "Новий товар",
    },
  },
  box: {
    infoHeaderLabel: {
      cs: "Hlavička informačního modálu",
      en: "Information Modal Header",
      sk: "Hlavička informačného modalu",
      uk: "Заголовок інформаційного вікна",
    },
    infoContentLabel: {
      cs: "Obsah informačního modálu",
      en: "Information Modal Content",
      sk: "Obsah informačného modalu",
      uk: "Зміст інформаційного вікна",
    },
    name: {
      cs: "Box",
      en: "Box",
    },
  },
  qRCode: {
    modalHeader: {
      cs: "Upravit QR kód",
      en: "Edit QR code",
    },
    valueLabel: {
      en: "Value",
      cs: "Hodnota",
    },
    sizeLabel: {
      en: "Size",
      cs: "Velikost",
    },
    correctionLabel: {
      en: "Correction",
      cs: "Korekce",
    },
    correctionMessage: {
      en: "Defines an error correction capability of the generated QR Code in percentages.",
      cs: "Definuje schopnost korekce chyb vygenerované QR kódu v procentech.",
    },
    lowValue: {
      en: "low (7%)",
      cs: "nízká (7%)",
    },
    mediumValue: {
      en: "medium (15%)",
      cs: "střední (15%)",
    },
    quartileValue: {
      en: "quartile (25%)",
      cs: "čtvrtinová (25%)",
    },
    highValue: {
      en: "high (30%)",
      cs: "vysoká (30%)",
    },
  },
  carousel: {
    modalHeader: {
      cs: "Upravit carousel",
      en: "Edit carousel",
    },
    height: {
      cs: "Výška",
      en: "Height",
    },
    minHeight: {
      cs: "Minimální Výška",
      en: "Minimal height",
    },
    hideControlsLabel: {
      cs: "Skrýt ovládací prvky",
      en: "Hide controls",
    },
    hideIndicatorsLabel: {
      cs: "Skrýt indikátory",
      en: "Hide indicators",
    },
    activeIndexLabel: {
      cs: "Výchozí aktivní položka",
      en: "Initial active item",
    },
    nextIconLabel: {
      cs: 'Ikona "Další"',
      en: '"Next" icon',
    },
    prevIconLabel: {
      cs: 'Ikona "Předchozí"',
      en: '"Previous" icon',
    },
    displayedItemsLabel: {
      cs: "Počet naráz zobrazených položek",
      en: "Number of items displayed at once",
    },
    typeLabel: {
      cs: "Typ",
      en: "Type",
    },
    typeValueCircular: {
      en: "circular",
      cs: "okružní",
    },
    typeValueFinal: {
      en: "final",
      cs: "uzavřený",
    },
    typeValueRewind: {
      en: "rewind",
      cs: "převíjený",
    },
    intervalLabel: {
      cs: "Interval",
      en: "Interval",
    },
    stepByOneLabel: {
      cs: "Krokování po jedné položce",
      en: "Step by one item",
    },
    itemLabel: {
      cs: "Položka ${itemNumber}",
      en: "Item ${itemNumber}",
    },
    name: { en: "Carousel", cs: "Carousel" },
    heightMessage: {
      cs:"Pokud v této komponentě používáte obrázky (nebo jiné asynchronní načítání), je nutné jim nastavit pevnou výšku nebo nastavit pevnou výšku komponentě!",
      en:
        "If you use images in this component (or other asynchronous loading), it is required to set them a fixed height or set fixed height to the component!",
    },
  },
  panel: {
    modalHeader: {
      cs: "Upravit panel",
      en: "Edit panel",
    },
    expandedLabel: {
      en: "Expanded",
      cs: "Otevřený panel",
    },
    alwaysExpandedLabel: {
      en: "Always expanded",
      cs: "Vždy otevřený panel",
    },
    iconExpandedLabel: {
      en: "Icon expanded",
      cs: "Ikona otevřeného panelu",
    },
    iconCollapsedLabel: {
      en: "Icon collapsed",
      cs: "Ikona zavřeného panelu",
    },
    iconAlignLabel: {
      en: "Icon align",
      cs: "Umístění ikony",
    },
    iconAlignValueLeft: {
      en: "left",
      cs: "vlevo",
    },
    iconAlignValueRight: {
      en: "right",
      cs: "vpravo",
    },
    iconAlignValueAfter: {
      en: "after",
      cs: "za textem",
    },
    openClickLabel: {
      en: "Open panel by click on",
      cs: "Panel se otevře kliknutím na",
    },
    openClickValueHeader: {
      en: "header",
      cs: "hlavičku",
    },
    openClickValueIcon: {
      en: "icon",
      cs: "ikonu",
    },
    bgStyleHeaderLabel: {
      en: "Header background style",
      cs: "Styl pozadí hlavičky",
    },
    bgStyleContentLabel: {
      en: "Content background style",
      cs: "Styl pozadí obsahu",
    },
    colorSchemaHeaderLabel: {
      en: "Header color schema",
      cs: "Barevné schéma hlavičky",
    },
    colorSchemaContentLabel: {
      en: "Content color schema",
      cs: "Barevné schéma obsahu",
    },
    mountContentLabel: {
      en: "Mount content method",
      cs: "Vykreslení obsahu",
    },
    mountContentValueOnEachExpand: {
      en: "on each expand",
      cs: "při každém rozbalení",
    },
    mountContentValueOnFirstExpand: {
      en: "on first expand",
      cs: "při prvním rozbalení",
    },
    mountContentValueOnFirstRender: {
      en: "on first render",
      cs: "při prvním vykreslení",
    },
    mountContentDescription: {
      en: `Defines when is the content of the panel mounted. Choosing a value like "on each expand" is recommended for performance optimalization.`,
      cs: `Definuje, kdy je obsah panelu vykreslen. Vybrání hodnoty "při každém rozbalení" je doporučeno z hlediska optimalizace výkonu.`,
    },
  },
  accordion: {
    modalHeader: {
      cs: "Upravit accordion",
      en: "Edit accordion",
    },
    name: {
      cs: "Akordeon",
      en: "Accordion",
    },
    onClickNotCollapseOthersLabel: {
      cs: "Povolit více otevřených panelů naráz",
      en: "Allow multiple expanded panels at once",
    },
    mountPanelContentLabel: {
      en: "Mount panel content method",
      cs: "Vykreslení obsahu panelů",
    },
    mountPanelContentValueOnEachExpand: {
      en: "on each expand",
      cs: "při každém rozbalení",
    },
    mountPanelContentValueOnFirstExpand: {
      en: "on first expand",
      cs: "při prvním rozbalení",
    },
    mountPanelContentValueOnFirstRender: {
      en: "on first render",
      cs: "při prvním vykreslení",
    },
    mountPanelContentDescription: {
      en: `Defines when is the content of each of the panels mounted. Choosing a value like "on each expand" is recommended for performance optimalization.`,
      cs: `Definuje, kdy je obsah všech vložených panelů vykreslen. Vybrání hodnoty "při každém rozbalení" je doporučeno z hlediska optimalizace výkonu.`,
    },
  },
  buttonGroup: {
    verticalLabel: {
      en: "Orientation",
      cs: "Orientace",
    },
    verticalValueFalse: {
      en: "Horizontal",
      cs: "Horizontální",
    },
    verticalLabelTrue: {
      en: "Vertical",
      cs: "Vertikální",
    },
    baselineLabel: {
      en: "Align to baseline",
      cs: "Zarovnat na baseline",
    },
    itemLabelButton: {
      en: "Button",
      cs: "Tlačítko",
    },
    itemLabelDropdown: {
      en: "Dropdown",
      cs: "Rozbalovací menu",
    },
    itemLabelButtonSwitch: {
      en: "Button switch",
      cs: "Zamačkávací tlačítko",
    },
    itemLabelLanguageSelector: {
      en: "Language selector",
      cs: "Výběr jazyka",
    },
    name: {
      en: "ButtonGroup",
      cs: "ButtonGroup",
    },
  },
  newspaper: {
    columnsCountValue1: {
      en: "Column",
      cs: "Sloupec",
    },
    columnsCountValue2: {
      en: "Columns",
      cs: "Sloupce",
    },
    columnsCountValue3: {
      en: "Columns",
      cs: "Sloupců",
    },
    columnsCountTooltip: {
      en: "Number of columns",
      cs: "Počet sloupců",
    },
    name: { en: "Newspaper", cs: "Newspaper" },
  },
  rating: {
    modalHeader: {
      cs: "Upravit hodnocení",
      en: "Edit Rating",
    },
    countLabel: {
      en: "Number of icons",
      cs: "Počet ikon",
    },
    valueLabel: {
      en: "Value",
      cs: "Hodnota",
    },
    iconLabel: {
      en: "Icon",
      cs: "Ikona",
    },
  },
  line: {
    modalHeader: {
      cs: "Upravit Line",
      en: "Edit Line",
    },
    sizeLabel: {
      cs: "Velikost",
      en: "Size",
    },
    verticalLabel: {
      cs: "Typ zobrazení",
      en: "Display type",
    },
    verticalValueTrue: {
      cs: "vertikální",
      en: "vertical",
    },
    verticalValueFalse: {
      cs: "horizontální",
      en: "horizontal",
    },
    verticalHeightLabel: {
      cs: "Výška",
      en: "Height",
    },
  },
  progressBar: {
    progressLabel: {
      en: "Progress",
      cs: "Pokrok",
    },
    stripedLabel: {
      en: "Visual type",
      cs: "Typ vzhledu",
    },
    stripedValueFalse: {
      en: "plain",
      cs: "plochý",
    },
    stripedValueTrue: {
      en: "striped",
      cs: "pruhovaný",
    },
    animatedLabel: {
      en: "Animated stripes",
      cs: "Animované pruhy",
    },
  },
  loading: {
    modalHeader: {
      en: "Edit Loading",
      cs: "Editovat Loading",
    },
    inlineLabel: {
      en: "Display type",
      cs: "Typ zobrazení",
    },
    inlineValueFalse: {
      en: "standard",
      cs: "standardní",
    },
    inlineValueTrue: {
      en: "inline",
      cs: "inline",
    },
  },
  card: {
    modalHeader: {
      cs: "Upravit kartu",
      en: "Edit card",
    },
    elevationPropsLabel: {
      cs: "Vyvýšení a mezery",
      en: "Elevation and spaces",
    },
    inlinePropsLabel: {
      cs: "Inline zobrazení",
      en: "Inline display",
    },
    widthLabel: {
      en: "Width",
      cs: "Šířka",
    },
    elevationHoverLabel: {
      en: "Elevation on hover",
      cs: "Úroveň vyvýšení při najetí",
    },
    minWidthLabel: {
      en: "Minimal width",
      cs: "Minimální šířka",
    },
    inlineLabel: {
      en: "Inline display",
      cs: "Inline zobrazení",
    },
    noSpacesLabel: {
      en: "No spaces",
      cs: "Žádné mezery",
    },
    noSpacesMessage: {
      en: "When enabled, the component has no margin.",
      cs: "Pokud je zapnuto, komponenta nemá margin.",
    },
    name: {
      en: "Card",
      cs: "Karta",
    },
  },
  richLink: {
    typeLabel: {
      en: "Display type",
      cs: "Typ zobrazení",
    },
    typeValueSimple: {
      en: "simple",
      cs: "jednoduchý",
    },
    typeValueFull: {
      en: "full",
      cs: "plný",
    },
    targetLabel: {
      en: "Link opening method",
      cs: "Způsob otevření odkazu",
    },
    downloadLabel: {
      en: "Download linked file",
      cs: "Stáhnout odkazovaný soubor",
    },
    authenticateLabel: {
      en: "Add authentication token to URL",
      cs: "Přidat autentizační token to URL",
    },
  },
  button: {
    modalHeader: {
      en: "Edit button",
      cs: "Upravit tlačítko",
    },
    displayBlockLabel: {
      en: "Display block",
      cs: "Zobrazit v bloku",
    },
    pressedLabel: {
      en: "Pressed",
      cs: "Zobrazit button jako zmáčknutý",
    },
    baselineLabel: {
      en: "Align to baseline",
      cs: "Zarovnat na baseline",
    },
    bgStyleValueLink: {
      en: "link",
      cs: "odkaz",
    },
  },
  touchIcon: {
    modalHeader: {
      en: "Edit touch icon",
      cs: "Upravit touch icon",
    },
    iconLabel: {
      en: "Icon",
      cs: "Ikona",
    },
    linesLabel: {
      en: "Number of lines of text",
      cs: "Počet řádků textu",
    },
  },
  dropdown: {
    modalHeader: {
      en: "Edit dropdown",
      cs: "Upravit dropdown",
    },
    labelLabel: {
      en: "Label",
      cs: "Popisek",
    },
    iconHiddenLabel: {
      en: "Button Icon",
      cs: "Ikona tlačítka",
    },
    iconHiddenValueTrue: { cs: "skryta", en: "hidden" },
    iconHiddenValueFalse: { cs: "zobrazena", en: "displayed" },
    iconOpenLabel: {
      en: "Button icon in open state",
      cs: "Ikona tlačítka v otevřeném stavu",
    },
    iconClosedLabel: {
      en: "Button icon in closed state",
      cs: "Ikona tlačítka v zavřeném stavu",
    },
    pullRightLabel: {
      en: "Expand menu to the right side",
      cs: "Otevřít menu doprava",
    },
    dropupLabel: {
      en: "Expand menu above the dropdown",
      cs: "Zobrazit menu nahoru",
    },
    splitLabel: {
      en: "Divide the button into two parts",
      cs: "Rozdělit tlačítko na dvě části",
    },
    closedOnLeaveLabel: {
      en: "Close the menu after moving the cursor away",
      cs: "Zavřít menu při opustění kurzorem",
    },
    openOnHoverLabel: {
      en: "Open the menu after hovering over the component",
      cs: "Otevřít menu při najetí myší na komponetu",
    },
    disableBackdropLabel: {
      en: "Collapse the menu only when the button is clicked again",
      cs: "Zavřít menu pouze po opětovném kliknutí na tlačítko",
    },
    baselineLabel: {
      en: "Align button to baseline",
      cs: "Zarovnat tlačítko na baseline",
    },
    fitMenuToViewportLabel: {
      en: "Menu height is limited by the visible part of the window",
      cs: "Výška menu je omezena výškou okna",
    },
    compactSubmenuLabel: {
      en: "Compact Menu",
      cs: "Kompaktní Menu",
    },
    itemTypeLabel: {
      en: "Item Type",
      cs: "Typ položky",
    },
    itemTypeValueDivider: {
      en: "Divider",
      cs: "Rozdělovač",
    },
    itemTypeValueLink: {
      en: "Link",
      cs: "Odkaz",
    },
    itemTypeValueHeader: {
      en: "Header",
      cs: "Hlavička",
    },
  },
  screenSize: {
    name: {
      en: "Screen size",
      cs: "Screen size",
    },
    sizes: {
      en: "Screen sizes",
      cs: "Screen sizes",
    },
    componentInfo: {
      cs: "Náhlédni do dokumentace",
      en: "Consult documentation of",
    },
    sameScreenSizeInfo: {
      cs:
        "V případě, že jsou vloženy dvě či více komponent se stejnou hodnotou vlastnosti screenSize, bude použita pouze komponenta, která je uvedena nejpozději.",
      en:
        "If two or more components with the same screenSize property value are inserted, only the component that is listed at the latest will be used.",
    },
    otherLabel: { cs: "ostatní", en: "other" },
    itemLabel: {
      cs: "Položka ${itemNumber}",
      en: "Item ${itemNumber}",
    },
  },
  header: {
    name: {
      en: "Header",
      cs: "Hlavička",
    },
  },
};

export default EditableLsi;
