# From this repo to TestFlight, without a Mac

You do this **once**. After that, new builds are one command, or automatic on every push.

Nothing here needs Xcode. Expo's cloud (EAS) builds the app. The one-time setup does need a
terminal for about 20 minutes, because Apple makes you sign in interactively the first time.
Pick one:

- **A Windows or Linux computer**: install [Node.js LTS](https://nodejs.org) and Git.
- **No computer, just a browser (works on iPad)**: open this repo on github.com, then the green
  **Code** button, then the **Codespaces** tab, then **Create codespace on this branch**. You get a
  terminal in the browser with Node already installed.

---

## 0. Decide the permanent IDs (2 minutes)

These are in `app.json`. Change them **before the first build**, because Apple doesn't let you
rename a bundle ID later.

| What | Current value | Notes |
| --- | --- | --- |
| App name on the home screen | `Y2K Home` | `expo.name`. You can change this any time. |
| Bundle ID | `com.jaylonwlv.y2khome` | `expo.ios.bundleIdentifier`. Permanent. |
| Widget bundle ID | `com.jaylonwlv.y2khome.widget` | Derived automatically (bundle ID + `.widget`). |
| App Group | `group.com.jaylonwlv.y2khome` | `expo.ios.entitlements`. The app and widget share settings through it. |

If you change the bundle ID, change the App Group to `group.<new bundle id>` as well, because the
widget works out the group name from its own bundle ID.

**Add your Apple Team ID.** Go to <https://developer.apple.com/account> and scroll to
*Membership details*. The **Team ID** is 10 characters, like `AB12CD34EF`. Add it to `app.json`:

```json
"ios": {
  "appleTeamId": "AB12CD34EF",
  "bundleIdentifier": "com.jaylonwlv.y2khome",
  ...
```

(Or just send it to Claude and it will commit the change.)

---

## 1. Get the code and sign in to Expo

In your terminal (or Codespace):

```sh
git clone https://github.com/jaylonwlv/Y2K.git   # skip in Codespaces, it's already there
cd Y2K
git checkout claude/ios-home-screen-app-s9dp1p    # or main, once this is merged
npm install
npx eas-cli@latest login          # your expo.dev username + password
npx eas-cli@latest init           # "Create a project?" → Yes
```

`init` creates the project on expo.dev and writes its `projectId` into `app.json`.
**Commit that change** so future builds (and Claude) use the same project:

```sh
git add app.json && git commit -m "Link EAS project" && git push
```

---

## 2. Development build: the fast loop for day-to-day work

A development build is your own copy of the app. It loads its JavaScript live from your computer
through Metro, so changes to the screens show up on your phone within seconds. It installs directly
from an EAS link, so you skip TestFlight and Apple's processing wait.

**What still needs a new build:** anything native. That means the widget (`targets/widget/`, which
is Swift), `app.json` plugins and permissions, and new native packages. Rebuild the dev client when those change.

### 2a. One-time phone setup

1. **Register your iPhone:**
   ```sh
   npx eas-cli@latest device:create
   ```
   Choose **Website**. It shows a QR code or link. Open it **on the iPhone in Safari** and allow the
   profile download. Then go to Settings, tap **Profile Downloaded**, and tap **Install**. This tells
   Apple your phone's ID, so the build is allowed to run on it.
2. **Turn on Developer Mode:** Settings › Privacy & Security › **Developer Mode** (at the bottom), then turn it on and restart.
   The switch only appears after a development build is installed, so if it isn't there yet, do this
   step after 2b.

### 2b. Build and install

```sh
npx eas-cli@latest build --platform ios --profile development
```

If this is your very first build, you get the same Apple questions as in step 3's table below: log in, then **Yes** to everything.
EAS also asks which registered devices to include. Select your iPhone.

When the build finishes (about 15 to 25 minutes), open the build page on expo.dev **on your iPhone**, or scan the QR code the
terminal prints, and tap **Install**.

### 2c. Every day after that

```sh
npx expo start          # on a PC on the same Wi-Fi as your phone
npx expo start --tunnel # in a Codespace (slower, but works from anywhere)
```

Open **Y2K Home** on the phone. It shows the dev launcher. Pick the server, or scan the QR code with the Camera app.
Save a file and the phone updates.

If you add a new iPhone later, run `device:create` again and rebuild. Development builds only run on
registered devices.

---

## 3. TestFlight build (for sharing, or the real thing)

```sh
npx eas-cli@latest build --platform ios --profile production --auto-submit
```

It asks a series of questions. Here's what to answer:

| Prompt | Answer |
| --- | --- |
| *Do you want to log in to your Apple account?* | **Yes**. Enter your Apple ID email and password, then the 6-digit code sent to your iPhone. EAS uses this session to set up Apple for you. It doesn't store your password. |
| *Select a team* | Your developer team. |
| *Bundle identifier … registered?* / capabilities sync | Automatic. EAS **creates both bundle IDs** (app + widget), **creates the App Group** and switches on the App Groups capability for both. You don't need to click anything on developer.apple.com. |
| *Generate a new Apple Distribution Certificate?* | **Yes** |
| *Generate a new Apple Provisioning Profile?* | **Yes**. It asks twice: once for the app, once for the widget. |
| *What would you like your iOS app name to be?* (App Store Connect) | A name for the App Store listing. It must be **unique across the whole App Store**. If `Y2K Home` is taken, try something like `Y2K Home – Chrome Widgets`. This doesn't change the name under the icon. |
| *Generate a new App Store Connect API Key?* | **Yes**. EAS creates the key, stores it on expo.dev and uses it for every upload from now on. |

Then wait:

1. **Build**: about 15 to 25 minutes on Expo's servers. Watch it at <https://expo.dev> under your project, then **Builds**.
2. **Submit**: EAS uploads the build to App Store Connect.
3. **Apple processing**: 5 to 30 minutes. Apple emails you when the build is ready.
   The export-compliance question is already answered in `app.json`
   (`usesNonExemptEncryption: false`), so you won't get stuck on "Missing Compliance".

### If you'd rather set things up by hand, or EAS reports an Apple error

<details>
<summary>Manual App Store Connect API key</summary>

1. Go to <https://appstoreconnect.apple.com>, then **Users and Access**, then the **Integrations** tab, then **App Store Connect API**.
2. If you're asked to *Request Access*, click it (the Account Holder has to do this once).
3. Under **Team Keys**, click **+** (Generate API Key). Name it `EAS` and set **Access** to **App Manager**.
4. **Download** the `.p8` file. Apple only lets you download it once, so keep it somewhere safe and never commit it.
   Note down the **Key ID** (next to the key) and the **Issuer ID** (at the top of the page).
5. Run `npx eas-cli@latest credentials`, choose **iOS**, then **production**, then **App Store Connect: Manage your API Key**,
   then **Add a new ASC API Key**, and give it the `.p8` path, the Key ID and the Issuer ID.
</details>

<details>
<summary>Manual bundle IDs and App Group</summary>

On <https://developer.apple.com/account/resources/identifiers>:

1. Click **+**, choose **App Groups**, then Continue. Description `Y2K Home`, identifier `group.com.jaylonwlv.y2khome`. Click Register.
2. Click **+**, choose **App IDs**, then **App**. Description `Y2K Home`, choose *Explicit* with `com.jaylonwlv.y2khome`.
   Tick **App Groups**, then Continue, then Register. Open it again, click **Configure** next to App Groups, tick the group, and Save.
3. Repeat step 2 for `com.jaylonwlv.y2khome.widget`.
4. Run the build command again. EAS picks up the existing IDs.
</details>

<details>
<summary>Manual App Store Connect app record</summary>

<https://appstoreconnect.apple.com>: go to **Apps**, click **+**, then **New App**. Platform iOS, a unique name,
language, Bundle ID `com.jaylonwlv.y2khome`, and SKU `y2khome`. Then run
`npx eas-cli@latest submit -p ios --latest`.
</details>

---

## 4. Install it from TestFlight

1. On the iPhone, install **TestFlight** from the App Store.
2. Go to <https://appstoreconnect.apple.com>, then **Apps**, then your app, then the **TestFlight** tab.
3. Under **Internal Testing**, click **+**, create a group called `Me`, and add yourself (your Apple ID).
   Add the build to the group if it isn't there already.
4. You'll get an email or a TestFlight notification. Tap **Install**.

## 5. Try it out

1. **Themes**, then **Y2K Pink Chrome**, then **Preview**, then **Save wallpaper**. Allow Photos, which asks for "add only" access.
2. In **Photos**, open the wallpaper, tap **Share**, then **Use as Wallpaper**, then **Add**, then **Set as Wallpaper Pair**.
3. Back in the app, go to **Widgets**, then **Connect calendar**, and allow full access.
4. On the home screen, long-press an empty spot, then **Edit**, then **Add Widget**. Search for your app and add
   **Chrome Calendar**.
5. Long-press the widget, then **Edit Widget**, then **Position**, and choose where it sits (for example *Middle right*). That lines
   the frosted glass up with the wallpaper behind it.

---

## Later builds

- **After a native change (widget, plugins, permissions):** `npx eas-cli@latest build -p ios --profile development`,
  then reinstall from the link. Changes that are only JavaScript need no build, because Metro reloads them.
- **Manually:** `npx eas-cli@latest build -p ios --profile production --auto-submit`. There are no prompts
  now, and the build number goes up automatically.
- **Automatically on every push to `main`:** go to <https://expo.dev>, open your project, then **Project settings**, then **GitHub**,
  and connect `jaylonwlv/Y2K`. The workflow in `.eas/workflows/testflight.yml` then builds and submits
  on each push to `main`. You can also start it by hand: `npx eas-cli@latest workflow:run testflight.yml`.

The free Expo plan has a monthly build quota, so the automatic trigger can use it up quickly. If
that becomes a problem, change `branches: ['main']` to a `release` branch.
