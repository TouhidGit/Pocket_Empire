# Cash Climb — the economy (version 3)

This page explains how money works in Cash Climb, what was wrong before, what changed, and how we
checked it. The last part is a plain-English guide: **how to get rich fast, the wise way**.

---

## 1. The short version

* **Before (version 2)** everybody got rich almost at once. A good player had a billion dollars after
  6 minutes and a trillion after 9; even a careless player had a trillion after 21 minutes. After that
  there was nothing left to buy. Tapping the coin was worth more than all your businesses together, and
  the game never told you what was a good or a bad buy.
* **Now (version 3)** every part of the game has a **wise move** and a **careless move**, and the game
  shows you which is which with small signals: a green **Best deal** badge, a payback **clock** on every
  buy button, **Undervalued** / **Overvalued** stock pills, **Cold** / **Hot** housing, **Smart buy** /
  **Too early** luxuries, a **Worth it** pill at the bank, green / red odds on every pop-up, and heir advice.
* In our test games a wise player reaches **$1 billion in about 16 minutes** and **$1 trillion in about
  46 minutes**. A careless player needs **32 minutes** and **2 hours 13 minutes**: about **2–3 times
  slower**, and the gap keeps growing (after 8 hours the wise player earns 500 times more per second).
* The first 10 minutes stay fast: 5–6 businesses, several boosts, a combo and about a million dollars.
* Old saves keep everything they own. Most old players even earn a little more, thanks to the new combos.

---

## 2. What was wrong with the old economy (version 2)

We played the old `game.js` with robot players (see part 4). Times are minutes of play with casual tapping.

| Milestone | Careless player | Wise player |
|---|---|---|
| $1 million | 5 min | 3 min |
| $1 billion | 13 min | 6.5 min |
| $1 trillion | 21 min | 9 min |
| $1 quadrillion | 29 min | 10 min |

At the 10-minute mark the wise robot already owned all 12 businesses and up to all 23 boosts. Why so fast?

1. **Tapping was overpowered.** Every tap paid 4% of your income per second, multiplied by the three hustle
   boosts (×30): one tap = 1.2 seconds of income, 2.4 with a full streak. Tapping 4 times a second earned
   about 10 times your whole empire. A fast tapper reached $1 trillion in **3.6 minutes**.
2. **Boosts were very cheap.** "TV Commercial" (all businesses ×2) cost $3M; the final "Mogul Mindset" $5Qa.
3. **Every new business paid back in seconds.** Before boosts, the Lemonade Stand pays back its price in
   25 seconds and the Space Colony in 69 minutes, only 167 times slower. But boosts, reputation and
   ×2 levels multiply income by 1,000 and more, so every business paid for itself almost immediately.
4. **The game showed no information.** No payback times, no fair value for stocks, housing just wandered
   around randomly, and pop-ups hid their odds (the "Risky Deal" was a 50/50 bet on ×3, so it was always worth it).
5. **Goals rewarded spending, not thinking:** "Buy a Gold Watch", "Buy your first car", "Buy shares of any company".
6. **Only 2 businesses were visible at the start** (the one you own and the next one).
7. Lifestyle grew from 24 items (700 reputation) to 49 items (924 reputation): the full collection now
   multiplies income by ×10.24 instead of ×8, and the cheap new items made the early game even faster.

---

## 3. The new design: a wise way and a careless way everywhere

| Pillar | Wise move — and the signal that shows it | Careless move |
|---|---|---|
| **Hustle** (tapping) | Tap hard in the first minutes to build the ×2 streak. Buy hustle boosts only if you really tap: when you don't, their clock says *Tap to use*. | Buying hustle boosts and then just watching. |
| **Businesses** | Buy the green **Best deal**. The **clock** on each buy button shows how long until it pays for itself. If the best deal is out of reach, the badge moves to anything you can afford that pays back before you could buy it. | Buying the cheapest thing, or at random, spreading levels thin. |
| **×2 levels** | Use **Next ×2**: it buys exactly the levels to the next doubling (Lv 10, 25, 50, 100…). The bar on each card shows how close you are. | Stopping one level short of a doubling. |
| **Combos** (new) | Pairs of businesses (Lemonade + Taco, Coffee + Car Wash, Gym + Tech, Hotel + Airline, Movies + Bank, Satellites + Colony): both at Lv 25 → **both earn ×2**. Every card shows its partner; the *Combos* row shows progress. | Leaving one partner behind. |
| **Boosts** | Clock colours: **green** = pays back within 10 minutes, **orange** = within an hour, **red** = later. *Best* badge on the best one. | Buying red boosts early. |
| **Stocks** | Each price wobbles around a **fair value** (the dashed line) and drifts back to it, so **Undervalued** shares tend to rise and **Overvalued** ones to fall. Headlines are right 4 times in 5. A **crash** (every 8–15 min) puts everything on sale for 2 minutes; a **boom** is the time to sell. Dividend stocks pay 9–15% an hour. | Buying at random, panic-selling after a dip (1% fee every trade). |
| **Property** | Prices move in waves of about 10 minutes. **Cold** (blue) = same rent for a lower price: buy. **Hot** = the only good time to sell. | Buying when it's hot, selling when it's cold (15% selling fee). |
| **Lifestyle** | Every reputation point adds 1% to all income. **Smart buy** = it pays its price back within 10 minutes. *1 pt = $X/s* shows what a point is worth right now. | Buying every luxury the moment you can afford it (**Too early** = over an hour). |
| **Bank** (new) | Borrow only when the bank says **Worth it**: a Best deal you can almost afford that pays back fast. Repay soon. | Borrowing the maximum to go shopping. |
| **Events** | Every pop-up shows its odds as pills: **green** = good deal, **red** = bad deal. | Clicking without reading (the investment pitches lose 10% on average). |
| **Legacy Stars** | Retire when the heir card says **Good** (heir earns ×1.5) or **Great** (×2 or more). | Retiring for one or two stars. |
| **Goals** | The goal bar is now a 30-step **path to riches**: each step teaches one wise move. Tap it to see why and jump to the right tab. | Ignoring it. |

### The bank, in detail
* The bank lends up to **a quarter of your net worth**, **one loan at a time**.
* 5% fee up front, then **1% interest every minute** until it's paid back.
* A quarter of your income repays it automatically, or tap **Repay**.
* Because the bank only lends a quarter of what you own, a careless player can't ruin a save with debt;
  borrowing badly just wastes money on fees and interest.

### Numbers that changed

| Thing | Version 2 | Version 3 |
|---|---|---|
| Businesses visible at start | 2 | **5**, then always two beyond your best one, plus a blurred "next business" |
| Income per level, ×2 levels, boost strengths, reputation points | — | **unchanged** (so old saves keep their income) |
| Combos | none | 6 pairs, ×2 both at Lv 25 |
| Business prices (opening) | Car Wash $26K … Space Colony $20T | Car Wash $31K … Space Colony $1.4Qa (prices above $10K grow on a curve: 10K × (old ÷ 10K)^1.2) |
| Base payback (before boosts) | 25 s … 69 min | 25 s … 81 h, so later businesses really need boosts, combos and reputation |
| Boost prices | TV Commercial $3M, Mogul Mindset $5Qa | TV Commercial $740M, Mogul Mindset $6Sx (same kind of curve, ^1.4) |
| Luxury prices | Sports Car $600K, Private Jet $40B, Moon Mansion $10Qa | Sports Car $3.1M, Private Jet $17T, Moon Mansion $630Qi (items under $10K unchanged) |
| Property prices | Tiny Studio $30K … Private Island $400B | Tiny Studio $37K … Private Island $13T; selling fee 10% → **15%** |
| Tap value | 4% of income per second | **0.5%** |
| Stock fee / limit | 0.5%, no limit | **1%**, each company holds up to 2 minutes of your income |
| Legacy Stars | 3 × √(earned ÷ $1B): 3 at $1B, 95 at $1T | **3 × ∛(earned ÷ $1B)**: 3 at $1B, 30 at $1T, 300 at $1Qa (keeps the retire loop rewarding without exploding) |
| Goal rewards | fixed, up to $10Qa | fixed prizes sized for the step, or 10 seconds of income for players far ahead |

---

## 4. How we tested it (simulation)

The real `game.js` (old and new) runs inside Node.js with a fake screen, a simulated clock and fixed
random seeds, so the robots play with exactly the same formulas as you. Files: `D:\Projects\_pm_assets\sim\`
(`harness.js` loads the game, `sim2.js` has the players, `run_final.sh` runs everything,
`summarize.js` makes the tables; `game_before.js` is the old version 2). Three robot players, all with the same hands:

* **Careless**: buys every luxury it can afford, then random things one level at a time, trades stocks at
  random and panic-sells, buys property whenever, borrows the maximum, clicks pop-ups at random.
* **Goal-follower**: buys the Best deal and Smart-buy luxuries, and does whatever the goal bar asks.
* **Wise**: reads every signal: Best deal in ×1 and Next ×2, Smart buys, cold-market property,
  undervalued stocks, crashes and headlines, the bank's Worth it, the odds pills.

Tapping: **casual** = 3 taps a second for 2 minutes, then one tap every 3 seconds (the main tables);
also tested **active** (4/s, then 2/s, then 0.5/s) and **idle** (2 minutes of tapping, then none).
3 runs per robot, middle value shown; 8 hours of play (6 for the old game).

### Old vs new, casual tapping

| Milestone | Old careless | Old wise | New careless | New goal-follower | New wise |
|---|---|---|---|---|---|
| $1K per second | 2 min | 1 min | 6 min | 2 min | 2 min |
| $1 million | 5 min | 3 min | 9 min | 6 min | 4 min |
| $1M per second | 10 min | 4.5 min | 19 min | 11 min | 8 min |
| **$1 billion** | 13 min | 6.5 min | **32 min** | 19 min | **16 min** |
| $1B per second | 17 min | 7 min | 1 h 48 min | 49 min | 36 min |
| **$1 trillion** | 21 min | 9 min | **2 h 13 min** | 54 min | **46 min** |
| $1 quadrillion | 29 min | 10 min | not within 8 h | 3 h 28 min | 2 h 47 min |

Careless ÷ wise: $1M 2.4×, $1M/s 2.5×, **$1B 2.1×**, $1B/s 3.0×, **$1T 2.9×**, $1Qa: the careless robot
never gets there in 8 hours. After 8 hours: wise $10.7T per second, goal-follower $3–6T, careless $21B.

At the 10-minute mark the wise robot has 6 businesses, 6 boosts and about $0.8M per second;
the careless one 4 businesses and about $25K per second.

### Tapping matters, but it's no longer the whole game

| $1 trillion | Active tapping | Casual | Idle |
|---|---|---|---|
| Old, wise | 3.6 min | 9 min | 12 min |
| New, wise | 49 min | 46 min | 52 min |
| New, careless | 2 h 05 min | 2 h 13 min | 2 h 07 min |

### What each wise habit is worth (wise robot with one habit switched off)

| Wise robot… | $1 billion | $1 trillion | $1 quadrillion |
|---|---|---|---|
| with every habit | 16 min | 46 min | 2 h 47 min |
| buying every luxury as soon as it can | 23 min | 1 h 00 min | 3 h 04 min |
| never buying luxuries | 27 min | 1 h 40 min | not within 8 h |
| without Next ×2 (×2 levels) | 29 min | 1 h 11 min | 4 h 00 min |
| without the stock market | 18 min | 54 min | 3 h 06 min |
| without the bank | 17 min | 53 min | 2 h 56 min |
| without property | 17 min | 53 min | 2 h 50 min |
| clicking pop-ups at random | 19 min | 52 min | 3 h 01 min |

(Switching off a pillar also blocks the goal that teaches it, so its later goal prizes are lost too.)
The careless robot's habit of borrowing the maximum and spending it on luxuries costs it 4 minutes to
reach $1K per second (6 min instead of 2).

### Exploits we looked for and closed
* **Endless loans** (in the half-finished rewrite): the limit grew with income, so borrow → buy → bigger
  limit → borrow again. A careless robot hit $1B per second in 2 minutes. Fixed: one loan at a time,
  limit based on net worth.
* **Goal prize snowball**: prizes of "N seconds of income" let several finished goals multiply each
  other (net worth jumped from $45K to $1.9M in 10 seconds). Fixed: fixed prizes.
* **House flipping**: buying at the bottom of a wave and selling at the top returns about 30% per wave,
  but a wise player has little spare cash, and in our test flipping made the robot slower
  ($1T in 54 instead of 46 minutes). Cold markets are for buying to keep; sell only if you need the cash.
* **Stock trading** was making up about half of a wise player's fortune; the per-company limit (2 minutes
  of income) keeps it a nice extra (about +15%).

### The long run, with retiring
A wise robot that retires whenever the heir card says **Great** first retires after about an hour
(20 stars, heir earns ×2), owns every luxury and finishes all 30 goals after about 3 hours, and has about
2–3 million Legacy Stars after 12 hours. The goal-follower finishes everything after about 4 hours.
Real players with breaks will take a few days: the late game is reachable, not instant.

---

## 5. How to get rich fast (the wise way)

**The steps**

1. **Tap hard for the first minute or two** to build the ×2 streak, buy *Comfy Sneakers*, open the
   Lemonade Stand. After that tapping is a bonus, not a job.
2. **Always buy the green "Best deal".** The clock on every button tells you how fast it pays for itself;
   shorter is better.
3. **Switch the buy amount to "Next ×2".** Every business doubles its income at level 10, 25, 50, 100…
   Never stop one level short.
4. **Chase combos.** Get both partners to level 25 and both earn double.
5. **Open the next business when its clock beats the others.** Five are on show from the start.
6. **Buy luxuries only when they say "Smart buy".** "Too early" means: grow your businesses first.
7. **Buy property when the market is Cold** (blue). Keep it: it pays rent forever.
8. **Stocks: buy Undervalued, sell when back above the dashed line.** In a crash, buy the dip; in a boom,
   take profits. Headlines are right 4 times in 5. Keep it small.
9. **Borrow only when the bank says "Worth it"**, and repay quickly: interest is 1% every minute.
10. **Read the pills on pop-ups.** Green = take it, red = pass.
11. **Retire when the heir card says Good or Great.** Your heir keeps every Legacy Star: +5% income each, forever.
12. **Follow the goal bar.** It is the path to riches: tap it to see why each step is wise.

**The traps**

* Buying whatever is cheapest, or at random: 2–3 times slower.
* Buying every luxury the moment you can afford it.
* Stopping one level before a ×2 level.
* Buying hustle boosts and then not tapping.
* Panic-selling shares after a dip; buying shares marked Overvalued.
* Buying property in a Hot market or selling in a Cold one.
* Borrowing the maximum to go shopping.
* Saying yes to every investment pitch (on average they lose 10%).
* Retiring for one or two stars.

---

## 6. Where the numbers live (for future tuning)

All in `game/game.js`, near the top: `BUSINESSES` (price and income), `MILESTONES`, `BIZ_GROWTH`
(each level costs 15% more), `COMBOS`, `UPGRADES` (boosts), `STOCKS`, `STOCK_FEE`, `STOCK_CAP`, `REVERT`,
`NEWS_TRUTH`, `PROPERTIES`, `PROP_GROWTH`, `PROP_FEE`, `COLD` / `HOT`, `LOAN`, `LUXURY`, `SMART_LUX`,
`TITLES`, `GOALS`, `EVENTS`; further down `TAP_IPS`, `REP_BONUS`, `STAR_BONUS`, `starsAvailable()`.
After a change, copy the new `game.js` to `D:\Projects\_pm_assets\sim\out\final\game_v3.js`, then run
`bash run_final.sh` and `node summarize.js` inside `D:\Projects\_pm_assets\sim` to see the new timings
(10–20 minutes).
