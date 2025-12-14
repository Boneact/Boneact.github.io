# Webprogramozás beadandó Tetris

Összefoglaló a működésről és használt technológiákról

## Billentyűzet vezérlés

- ← / →: Blokk vízszintes mozgatása
- ↓: Blokk lefelé mozgatása manuálisan
- szóköz: Hard drop (azonnali leejtés)
- ↑: Blokk forgatása
- c/C: Aktuális blokk tartása/félretétele
- p/P: Játék megállítása

## Technológiák

Frontend:
- DOM-kezelés (querySelector) és eseménykezelés (addEventListener)
- Canvas API (fillRect, clearRect) játéktér megjelenítéshez
- requestAnimationFrame animációhoz
- Aszinkron fetch API PHP végpontokkal való kommunikációhoz

Backend:
- PHP (save_score.php, register.php, index.php) felhasználó hitelesítéshez és pontszámok mentéséhez
- JSON fájlalapú tárolás (playerstorage.php)

## Játék folyamata

1. Regisztráció/Bejelentkezés után a játékos a játéktérre kerül
2. Játék végén a pontszám automatikusan POST-olódik a szerverhez
3. Játék végekor megjelenik egy összegző; bezáráskor a leaderboard frissül a szerverről
4. A leaderboard top 10 eredményt mutat és valós időben frissül
