import Environment from "../../environment/environment";

// insert font CSS to HTML page (if it is not there yet)
let fontUri = Environment.fontCssUrl;
if (fontUri) Environment.DocumentManager.addUniqueCss(fontUri);
