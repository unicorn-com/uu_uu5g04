# How to add new icon

1. Prepare new icon (.svg file).
2. Install FontForge https://fontforge.org/en-US/
3. Open `src/uu5g04-icons.woff2` in FontForge.
4. View -> Next Defined Glyph (or `Ctrl+Alt+]`). It should move you to a spot with unicode code ~e900.
5. Edit next empty spot (double click square with no icon in it) - new window gets opened.
6. In new window: File -> Import, select the icon to add (might need to change Format dropdown to SVG).
7. Close the window. In main window the spot should now contain the new icon.
8. Remember the character unicode code of the spot (e.g. e917).
9. Element -> Font Info, tab PS Names, update Version and sfnt Revision, e.g. 1.1 -> 1.2. Press OK.
10. File -> Generate Fonts, in dropdown select WOFF2, change name to uu5g04-icons.woff2, press Generate. If a popup "Errors detected" is shown, ignore and press Generate. Move generated file to `src/`.
11. Repeat steps 9 and 10 for formats WOFF, TTF, SVG.
12. Generate EOT from TTF: `npx ttf2eot src/uu5g04-icons.ttf src/uu5g04-icons.eot`
13. Update `src/icons.less` - add CSS class with proper unicode (from step 8).
14. Update `src/demo/icons.html` - add icon code to `uu5Icons` array.
15. Update documentation - https://uuapp.plus4u.net/uu-bookkit-maing01/ed11ec379073476db0aa295ad6c00178/book/page?code=icons

# How to create uuAppBox
1. Update version in uuapp.json in key "uu5g04_icons".
2. Run `npm run uuAppBox` from uu5g04_icons/ folder.
