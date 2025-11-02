# Webprogramozás beadandó Tetris
Összefoglaló a működésről és használt technológiákról

A Tetris blokk vízszintes mozgatása: ← nyíllal valamint a → nyíllal történik
Blokk lefelé mozgatása manuálisan: ↓ nyíllal
Hard drop/azonnali leejtés: szóköz billentyűvel
Blokk forgatása: ↑ nyíllal
Aktuális blokk tartása/félretétele: c/C betűkkel
Játék megállítása: p/P betűkkel

-DOM-kezelés a ui.js fájlban: A játék HTML-elemeit (querySelector) JavaScriptből frissítjük, például a pontszámot, szintet és a gombok állapotát. 
-Eseménykezelés: (addEventListener) segítségével a játék reagál a billentyűlenyomásokra és gombkattintásokra.
-Canvas API: A játékteret és a blokkokat a 2D rajzoló kontextus (fillRect, clearRect) segítségével jeleníti meg. 
-requestAnimationFrame: A játék frissítését és animációját biztosítja; minden képkockában újrarajzolja az állapotot.
-LocalStorage: A storage.js segítségével a játék a böngészőben tárolja a ponttörténetet, így az megmarad az oldal újratöltése után is.
-Aszinkron függvények: A pontok mentése és betöltése aszinkron módon történik, hogy a játék ne akadjon meg a háttérműveletek közben(pontok mentése/betöltése).