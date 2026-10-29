# How to get the Pocket Mogul APK (no Android Studio needed)

GitHub builds the APK for you, for free. Version 2 has about 145 files, which is more than GitHub's website accepts in one upload (100). So we send them with the free **GitHub Desktop** app. It's all clicking, no commands.

## Part A: Install GitHub Desktop (one time)
1. Go to https://desktop.github.com and click **Download for Windows**.
2. Run the downloaded installer. GitHub Desktop opens when it's done.
3. Click **Sign in to GitHub.com**, sign in as **TouhidGit** in the browser window that opens, then click **Authorize desktop**.
4. Back in GitHub Desktop, on the **Configure Git** screen, keep the suggested name and email and click **Finish**.

## Part B: Send the game to GitHub
Follow **B1** or **B2**, whichever matches you.

### B1. You have NOT made a `pocket-mogul` repository on GitHub yet
5. In GitHub Desktop, click **File**, then **Add local repository...**
6. Click **Choose...**, pick the folder `D:\Projects\game1`, and click **Select Folder**.
7. A message says the folder isn't a Git repository yet. Click the blue link **create a repository**.
8. Set **Name** to `pocket-mogul`. Leave everything else as it is and click **Create repository**.
9. If the left panel lists files under **Changes**, type `Version 2` in the **Summary** box at the bottom left and click **Commit to main**.
10. Click **Publish repository** in the top bar.
11. Untick **Keep this code private**, so your phone can download the APK without signing in. Then click **Publish repository**.

### B2. You ALREADY made `pocket-mogul` with the first version
5. In GitHub Desktop, click **File**, then **Clone repository...**
6. On the **GitHub.com** tab, pick **TouhidGit/pocket-mogul**. Set **Local path** to `D:\Projects\pocket-mogul` and click **Clone**.
7. In File Explorer, open `D:\Projects\game1` and press **Ctrl + A**, then **Ctrl + C**.
8. Open `D:\Projects\pocket-mogul`, press **Ctrl + V**, and choose **Replace the files in the destination**.
9. Back in GitHub Desktop, the changed files are listed on the left. Type `Version 2` in the **Summary** box at the bottom left, then click **Commit to main**.
10. Click **Push origin** in the top bar.
11. From now on, make any changes in `D:\Projects\pocket-mogul`.

(The `referance images` folder is never uploaded: the `.gitignore` file leaves it out, because those are screenshots of another company's game.)

## Part C: Build the APK (automatic)
12. Open https://github.com/TouhidGit/pocket-mogul in your browser and click the **Actions** tab.
13. A run called **Build APK** shows a yellow dot while it builds. It takes about 3 to 5 minutes.
    - If no run appears, click **Build APK** on the left, then **Run workflow**, then the green **Run workflow** button.
14. Wait for the green check mark ✅.
    - If you get a red ❌, click the run, click the failed step, and copy the error message.

## Part D: Install it on your Android phone
15. On your phone's browser, open https://github.com/TouhidGit/pocket-mogul/releases
16. Tap the newest release, **Pocket Mogul (build N)**.
17. Under **Assets**, tap **PocketMogul-N.apk** to download it.
18. Open the downloaded file from the notification, or from **Files**, then **Downloads**.
19. If Android says installing unknown apps isn't allowed: tap **Settings**, turn on **Allow from this source**, go back, and tap **Install** (or **Update** if version 1 is already installed).
20. If Play Protect warns about the app, tap **More details**, then **Install anyway**. It warns because the app isn't from the Play Store.
21. Open **Pocket Mogul** from your home screen. Have fun!

**Alternative (via PC):** go to **Actions**, open the green run, scroll down to **Artifacts**, and download **PocketMogul-APK**. That is a zip file. Unzip it and copy the `.apk` to your phone with a USB cable.

## Updating the game later
Change the files, then in GitHub Desktop type a short summary, click **Commit to main**, and click **Push origin**. A new APK appears under **Releases** a few minutes later.
Every build uses the same signing key (`app/pocketmogul.p12`), so each new APK installs over the old one and **your save is kept**.

## Playing on your PC
Double-click `D:\Projects\game1\game\index.html` to play in your browser.
