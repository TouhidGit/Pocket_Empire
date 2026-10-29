# Cash Climb

An idle business tycoon game for Android, by TouhidGit. (Version 2 was called Pocket Mogul.)

You start broke, with big dreams. Tap the coin for your first dollars, then climb from a lemonade stand to a space colony:
- open 12 businesses that earn money every second; five are on show from the start
- double their income at levels 10, 25, 50…, and pair them up in **combos** for ×2 more
- trade stocks that drift around a fair value, with crashes, booms and dividend stocks
- buy property when the housing market is cold and collect rent forever
- borrow from the **bank** when it's worth it
- collect 49 cars, homes, style items, aircraft, yachts and treasures for **reputation** (the crown)
- pass your empire to your heir for permanent **Legacy Stars** (the star)

Signals on every screen show the wise move: a **Best deal** badge, payback clocks, Undervalued / Overvalued stocks, Cold / Hot housing, Smart buy luxuries, the bank's Worth it, odds on every pop-up and heir advice. The goal bar is a 30-step path to riches. [ECONOMY.md](ECONOMY.md) explains the economy and how to get rich fast.

Your **profile**: pick a name and one of 24 looks, or upload your own photo. The Profile tab also has an **Assets** page (what you own, its value and income) and a **Collection** page (every lifestyle item, grouped and tracked).

It also has daily login bonuses, random events and bonus briefcases.

## Project layout
| Path | What it is |
|---|---|
| `game/` | The game itself. Open `index.html` to play in a browser. `game.js` is the economy and the Business, Market, Property and Lifestyle tabs; `profile.js` is the player, the header badges and the Profile tab. |
| `game/img/` | Photos, 3D icons, avatars, stock logos and the logo. See [CREDITS.md](CREDITS.md) for who made them and their licenses. |
| `app/` | A small Android app that shows the game full-screen. |
| `.github/workflows/build-apk.yml` | GitHub Actions builds the APK on every push and publishes it under **Releases**. |

To get the APK, see [HOW_TO_GET_APK.md](HOW_TO_GET_APK.md).
