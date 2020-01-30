import UU5 from "uu5g04";
export const FormsLsi = {
  common: {
    headerPlaceholder: {
      cs: "Hlavička",
      en: "Header"
    },
    footerPlaceholder: {
      cs: "Patička",
      en: "Footer"
    },
    defaultLevel: {
      cs: "Výchozí úroveň",
      en: "Default Level"
    },
    showHeaderCheckboxLabel: {
      cs: "Hlavička",
      en: "Header"
    },
    showFooterCheckboxLabel: {
      cs: "Patička",
      en: "Footer"
    },
    underlineTooltip: {
      cs: "Podtržení hlavičky",
      en: "Header Underline"
    },
    level: {
      cs: "Úroveň",
      en: "Level"
    },
    levelTooltip: {
      cs: "Úroveň hlavičky",
      en: "Header Level"
    },
    colorSchemaTooltip: {
      cs: "Barevné schéma",
      en: "Color Schema"
    },
    settingButtonLabel: {
      cs: "Nastavení",
      en: "Settings"
    },
    controlsSubmitButton: {
      cs: "Editovat",
      en: "Edit"
    },
    controlsCancelButton: {
      cs: "Zrušit",
      en: "Cancel"
    }
  },
  section: {},
  container: {
    noSpacingTooltip: {
      cs: "Nulové odsazení",
      en: "Zero indentation"
    }
  },
  row: {
    flexCheckboxLabel: {
      cs: "Stejná výška sloupců",
      en: "Same column height"
    },
    componentDescription: {
      cs:
        "<uu5string />Komponenta <UU5.Bricks.Link href='https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book/page?code=uu5BricksRow' content='UU5.Bricks.Row' /> se používá uvnitř komponenty UU5.Bricks.Container a představuje řádek. Lze ji využít pro naformátování textu a komponent do jednotlivých řádků.",
      en:
        "<uu5string />The <UU5.Bricks.Link href='https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book/page?code=uu5BricksRow' content='UU5.Bricks.Row' /> component is used as a child component of the UU5.Bricks.Container component and represents a row. It is used to format text and components into individual rows."
    },
    layoutTooltip: {
      cs: "Rozvržení",
      en: "Layout"
    },
    layoutConfirmModalContent: {
      cs: "Chystáte se provést potenciálně destruktivní změny. Opravdu si přejete tuto změnu povést?",
      en: "You are about to do a potentially destructive action. Are you sure you want to proceed?"
    },
    layoutConfirmModalHeader: {
      cs: "Změnit layout?",
      en: "Change layout?"
    },
    layoutConfirmModalConfirm: {
      cs: "Změnit",
      en: "Change"
    },
    layoutConfirmModalCancel: {
      cs: "Zrušit",
      en: "Cancel"
    },
    mainPropertiesLabel: {
      cs: "Vlastnosti řádku",
      en: "Row Properties"
    },
    displayLabel: {
      cs: "Zobrazení",
      en: "Display"
    },
    displayValueStandard: {
      cs: "Standardní",
      en: "Standard"
    },
    displayValueFlex: {
      cs: "Flex",
      en: "Flex"
    },
    horizontalPaddingLabel: {
      cs: "Horizontalní padding",
      en: "Horizontal padding"
    },
    horizontalPaddingValueStandard: {
      cs: "Standard",
      en: "Standard"
    },
    horizontalPaddingValueNone: {
      cs: "Bez paddingu",
      en: "None"
    },
    classNameLabel: {
      cs: "CSS třída",
      en: "Class Name"
    },
    colWidthLabel: {
      cs: "Šířka sloupce",
      en: "Column Width"
    },
    colWidthTooltip: {
      cs:
        "Můžete definovat šířku sloupce pomocí standardních CSS jednotek, např. 200px, 10em nebo 33%. Také ale můžete použít jednotky pro responzivní zobrazení, např „xs-6 m-3”.",
      en:
        "You can define column’s width with standard CSS values like 200px, 10em or 33%. You can also use values for responsive grid like „xs-6 m-3”."
    },
    columnsWidthPresetLabel: {
      cs: "Přednastavé šířky sloupců",
      en: "Columns width preset"
    }
  },
  column: {
    componentDescription: {
      cs:
        "<uu5string />Komponenta <UU5.Bricks.Link href='https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book/page?code=uu5BricksColumn' content='UU5.Bricks.Column' /> je založena na nápadu a implementaci Bootstrap mřížky (viz <UU5.Bricks.Link href='https://www.w3schools.com/bootstrap/bootstrap_grid_basic.asp' target='_blank' content='W3Schools - Bootstrap Grid System'/>) a reprezentuje sloupec. Tato komponenta musí být obalena komponentou UU5.Bricks.Row jinak by mohlo dojít k překrývání obsahu sloupce elementy, které v dokumentu následují. Šířka komponenty může být nastavena pomocí props a může se lišit pro různé velikosti obrazovky.",
      en:
        "<uu5string />The <UU5.Bricks.Link href='https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book/page?code=uu5BricksColumn' content='UU5.Bricks.Column' /> component is based on the Bootstrap grid implementation (see <UU5.Bricks.Link href='https://www.w3schools.com/bootstrap/bootstrap_grid_basic.asp' target='_blank' content='W3Schools - Bootstrap Grid System'/>) and represents a column. This component must be wrapped by the UU5.Bricks.Row component (otherwise, the contents of the column may overlap with the elements that follow in the document). The component width can be adjusted by built-in properties and can differ for different screen sizes."
    },
    widthInputLabel: {
      cs: "Šířka",
      en: "Width"
    },
    widthInputMessage: {
      cs:
        "<uu5string />Lze nastavit hodnoty pro <UU5.Bricks.Code content='width' /> nebo <UU5.Bricks.Code content='colWidth' /> dle <UU5.Bricks.Link href='https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book/page?code=uu5BricksColumn' content='dokumentace' />.",
      en:
        "<uu5string />Values for <UU5.Bricks.Code content='width' /> or <UU5.Bricks.Code content='colWidth' /> are allowed according to the <UU5.Bricks.Link href='https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book/page?code=uu5BricksColumn' content='documentation' />."
    },
    noSpacingTooltip: {
      cs: "Nulové odsazení",
      en: "Zero indentation"
    },
    horizontalPaddingLabel: {
      cs: "Horizontalní padding",
      en: "Horizontal padding"
    },
    horizontalPaddingValueStandard: {
      cs: "Standard",
      en: "Standard"
    },
    horizontalPaddingValueNone: {
      cs: "Bez paddingu",
      en: "None"
    },
    classNameLabel: {
      cs: "CSS třída",
      en: "Class Name"
    },
    colWidthLabel: {
      cs: "Šířka sloupce",
      en: "Column Width"
    },
    colWidthTooltip: {
      cs:
        "Můžete definovat šířku sloupce pomocí standardních CSS jednotek, např. 200px, 10em nebo 33%. Také ale můžete použít jednotky pro responzivní zobrazení, např „xs-6 m-3”.",
      en:
        "You can define column’s width with standard CSS values like 200px, 10em or 33%. You can also use values for responsive grid like „xs-6 m-3”."
    },
  },
  block: {
    backgroundCheckboxLabel: {
      cs: "Pozadí",
      en: "Background"
    }
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
      The <UU5.Bricks.Code content = 'UU5.Bricks.Block'/> component is more preferable when we need to display a warning, for example, where there is no need to insert additional text into the footer.`
    },
    backgroundCheckboxLabel: {
      cs: "Pozadí",
      en: "Background"
    },
    footerAlignmentInputLabel: {
      cs: "Zarovnání patičky",
      en: "Footer alignment"
    },
    footerAlignmentLeft: {
      cs: "Vlevo",
      en: "Left"
    },
    footerAlignmentRight: {
      cs: "Vpravo",
      en: "Right"
    },
    noSpacingTooltip: {
      cs: "Nulové odsazení",
      en: "Zero indentation"
    }
  },
  colorPicker: {
    defaultColorSchema: {
      cs: "Výchozí barva",
      en: "Default Color"
    },
    colorSchemaTooltip: {
      cs: "Barevnost",
      en: "Color Schema"
    }
  }
};

export default FormsLsi;
