const React = require("react");

const MixinProps = {
  "UU5.Common.BaseMixin": {
    id: {
      values: ["myId"],
    },
    name: {
      values: ["myName"],
    },
    tooltip: {
      values: ["My Tooltip"],
    },
    className: {
      values: ["my-classname"],
    },
    style: {
      values: ["padding:8px; borderRadius: 2px", { backgroundColor: "red", color: "blue" }],
    },
    mainAttrs: {
      style: [{ backgroundColor: "red", color: "blue" }],
    },
    noIndex: {
      values: [true, false],
    },
  },

  "UU5.Common.ColorSchemaMixin": {
    colorSchema: {
      values: [
        "default",
        "red",
        "red-rich",
        "green",
        "green-rich",
        "yellow",
        "yellow-rich",
        "purple",
        "purple-rich",
        "brown",
        "brown-rich",
        "orange",
        "orange-rich",
        "cyan",
        "cyan-rich",
        "grey",
        "grey-rich",
        "pink",
        "pink-rich",
      ],
    },
  },

  "UU5.Common.ElementaryMixin": {
    hidden: {
      values: [true, false],
    },
    disabled: {
      values: [true, false],
    },
    selected: {
      values: [true, false],
    },
    controlled: {
      values: [true, false],
    },
  },

  "UU5.Common.ContentMixin": {
    content: {
      values: [12345, "This is Content from ContentMixin"],
    },
    ignoreHTML: {
      values: [true, false],
    },
    checkSpaces: {
      values: [true, false],
    },
    checkGrammar: {
      values: [true, false],
    },
    checkHighlight: {
      values: [true, false],
    },
    textCorrector: {
      values: [true, false],
    },
    dynamic: {
      values: [true, false],
    },
  },

  "UU5.Common.NestingLevelMixin": {
    nestingLevel: {
      values: [
        "spa",
        "container",
        "page",
        "bigBoxCollection",
        "bigBox",
        "boxCollection",
        "box",
        "smallBoxCollection",
        "smallBox",
        "inline",
      ],
    },
  },

  "UU5.Common.PureRenderMixin": {
    pureRender: {
      values: [true, false],
    },
  },

  "UU5.Common.CcrWriterMixin": {
    ccrKey: {
      values: ["<UU5.Parrot.Page ccrKey='UU5.Parrot.Page' />"],
    },
  },
  "UU5.Common.SectionMixin": {
    header: {
      values: [React.createElement("div", undefined, "Header of section")],
    },
    footer: {
      values: [React.createElement("div", undefined, "Footer of section")],
    },
    underline: {
      values: [true, false],
    },
  },
  "UU5.Common.LevelMixin": {
    level: {
      values: [0, 1, 2, 3, 4, 5, 6, "0", "1", "2", "3", "4", "5", "6"],
    },
  },
  "UU5.Common.SwipeMixin": {
    swiped: {
      values: ["up", "right", "down", "left", "upRight", "downRight", "upLeft", "downLeft"],
    },
    swipedLong: {
      values: [null, true, false],
    },
    swipedFast: {
      values: [null, true, false],
    },
  },
  "UU5.Common.LsiMixin": {
    language: {
      values: ["cs", "en", "en-gb", "en-us", "fr", "de", "ru", "sk", "es", "uk"],
    },
  },
  "UU5.Common.ScreenSizeMixin": {
    //Mixin has not props only ifc
  },
  "UU5.Bricks.DraggableMixin": {
    //Mixin has not props only ifc
  },
  "UU5.Common.CcrReaderMixin": {
    //Mixin has not props only ifc
  },
  "UU5.Forms.TextInputMixin": {
    placeholder: {
      values: ["např.: +420 000 000 000", "Prosím vyplňte požadované pole .."],
    },
    required: {
      values: [true, false],
    },
    requiredMessage: {
      values: ["Bez tohoto pole se nehnete dál."],
    },
    //onFocus
    //onBlur
    //onEnter
    //validateOnChange
    focusMessage: {
      values: ["Bedlivě hlídám co píšete."],
    },
    patternMessage: {
      values: ["Hodnota inputu není validní."],
    },
    autocompleteItems: {
      array: ["Uchazeč(ka)", "Nasazení", "Přínos"],
    },
  },
  "UU5.Forms.InputMixin": {
    label: {
      values: ["Your personal email"],
    },
    message: {
      values: ["Your password is too short!"],
    },
    feedback: {
      values: ["initial", "success", "warning", "error", "loading"],
    },
    readOnly: {
      values: [true, false],
    },
    size: {
      values: ["s", "m", "l"],
    },
    labelColWidth: {
      values: ["xs12 s3", "xs12 s6 m4 l3"],
    },
    inputColWidth: {
      values: ["xs12 s9", "xs12 s6 m8 l9"],
    },
    inputAttrs: {
      values: [{ type: "email", width: "150px" }],
    },
    labelAlignment: {
      values: ["xs-left s-right", "xs-right s-left"],
    },
    //onChange
    //onValidate
    //onChangeFeedback
  },
  "UU5.Forms.ChoiceMixin": {
    placeholder: {
      values: ["Vyplňte jméno včetně titulů"],
    },
    required: {
      values: [true, false],
    },
    requiredMessage: {
      values: ["Vyberte alespoň jednu možnost."],
    },
    iconOpen: {
      values: ["mdi-chevron-up"],
    },
    iconClosed: {
      values: ["mdi-chevron-down"],
    },
    buttonHidden: {
      values: [true, false],
    },
  },
  "UU5.Forms.ControlsMixin": {
    //Mixin does not have props only ifc
  },
  "UU5.Forms.FormMixin": {
    values: {
      values: [{ input0: "Jan" }],
    },
    progressIndicator: {
      values: ["Libovolný vstup pro progressIndicator."],
    },
    saveOnEnter: {
      values: [true, false],
    },
    // onInit
    // onSave
    // onSaveDone
    // onSaveFail
    // onSaveByKey
    // onValidate
    // onReset
    // onCancel
  },
  "UU5.Forms.GroupMixin": {
    value: {
      array: [
        { label: "První možnost", name: "a1" },
        { label: "Druhá možnost", name: "a2" },
      ],
    },
    required: {
      values: [true, false],
    },
    requiredMessage: {
      values: ["Položka je povinná!"],
    },
    icon: {
      values: ["mdi-ok"],
    },
    inline: {
      values: [true, false],
    },
    labelPosition: {
      values: ["left", "right"],
    },
  },
};

module.exports = MixinProps;
