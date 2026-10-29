# How to get the Cash Climb APK (no Android Studio needed)

GitHub builds the APK for you, for free. You send the game's files to GitHub with the free **GitHub Desktop** app (it's all clicking), GitHub builds the APK, and you download it on your phone.

Your game is already on GitHub at **https://github.com/TouhidGit/Pocket_Empire**, and its folder on this PC is `D:\Projects\game1`. To update, follow **Part B2**, then Parts C and D. The new APK installs over the old app and keeps your save; the app's name and icon change to Cash Climb.

## Part A: Install GitHub Desktop (one time, already done)
1. Go to https://desktop.github.com and click **Download for Windows**.
2. Run the downloaded installer. GitHub Desktop opens when it's done.
3. Click **Sign in to GitHub.com**, sign in as **TouhidGit** in the browser window that opens, then click **Authorize desktop**.
4. Back in GitHub Desktop, on the **Configure Git** screen, keep the suggested name and email and click **Finish**.

## Part B: Send the game to GitHub

### B1. First time only: putting a folder on GitHub (you already did this for Pocket_Empire)
5. In GitHub Desktop, click **File**, then **Add local repository...**
6. Click **Choose...**, pick the game folder, and click **Select Folder**.
7. If a message says the folder isn't a Git repository yet, click the blue link **create a repository**, then **Create repository**.
8. Type a summary in the **Summary** box at the bottom left and click **Commit to main**.
9. Click **Publish repository**, untick **Keep this code private** (so your phone can download the APK without signing in), and click **Publish repository**.

### B2. Every update (this is what you do now)
5. Open GitHub Desktop. At the top left, **Current repository** must be the game: `Pocket_Empire` (it may show as `game1`). If it isn't, click it and pick it from the list.
6. The left panel lists the changed and new files. Type `Version 3 - Cash Climb` in the **Summary** box at the bottom left, then click **Commit to main**.
7. Click **Push origin** in the top bar.

(The `referance images` folder is never uploaded: the `.gitignore` file leaves it out, because those are screenshots of another company's game.)

## Part C: Build the APK (automatic)
8. Open https://github.com/TouhidGit/Pocket_Empire/actions in your browser.
9. A run called **Build APK** shows a yellow dot while it builds. It takes about 3 to 5 minutes.
   - If no run appears, click **Build APK** on the left, then **Run workflow**, then the green **Run workflow** button.
10. Wait for the green check mark ✅.
    - If you get a red ❌, click the run, click the failed step, and copy the error message.

## Part D: Install it on your Android phone
11. On your phone's browser, open https://github.com/TouhidGit/Pocket_Empire/releases
12. Tap the newest release, **Cash Climb (build N)**.
13. Under **Assets**, tap **CashClimb-N.apk** to download it.
14. Open the downloaded file from the notification, or from **Files**, then **Downloads**.
15. Tap **Update** (or **Install**). If Android says installing unknown apps isn't allowed: tap **Settings**, turn on **Allow from this source**, go back, and tap **Update**.
16. If Play Protect warns about the app, tap **More details**, then **Install anyway**. It warns because the app isn't from the Play Store.
17. Open **Cash Climb** from your home screen. If the home screen still shows the old icon, wait a minute or restart the phone; launchers cache icons.

**Alternative (via PC):** go to **Actions**, open the green run, scroll down to **Artifacts**, and download **CashClimb-APK**. That is a zip file. Unzip it and copy the `.apk` to your phone with a USB cable.

## Updating the game later
Change the files, then in GitHub Desktop type a short summary, click **Commit to main**, and click **Push origin**. A new APK appears under **Releases** a few minutes later.
Every build uses the same signing key (`app/pocketmogul.p12`) and the same app ID, so each new APK installs over the old one and **your save is kept**.

## Playing on your PC
Double-click `D:\Projects\game1\game\index.html` to play in your browser.
