# Building the Undercover APK

## Prerequisites
- Node.js 20.x (20.9 or newer)
- Android Studio (Ladybug 2024.2+)
- Java 17 (JDK)
- Android SDK (API level 34+)

## Steps
1. Navigate to the project root: `cd undercover-app`
2. Install dependencies: `npm ci`
3. Build the Angular production package: `npm run build`
4. Sync the web assets with the Capacitor Android project: `npx cap sync android`
5. Open the project in Android Studio: `npx cap open android`
   - **In Android Studio**: Wait for Gradle sync to complete. Then go to **Build** → **Generate Signed Bundle / APK...** → **APK**
   - **OR** run from the terminal: 
     ```bash
     cd android
     sh ./gradlew assembleDebug
     ```
   - The APK output will be located at: `android/app/build/outputs/apk/debug/app-debug.apk`
   - In Windows PowerShell, use `.\gradlew.bat assembleDebug` in the `android` directory.
6. Transfer the APK to your phone (via USB, Google Drive, email)
   - Enable "Install from unknown sources" in your Android settings
   - Tap the APK file to install and start playing!
