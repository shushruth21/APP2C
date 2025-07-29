# Building APK for Estre Furniture App

## Prerequisites
- Android Studio installed
- Java Development Kit (JDK) 11 or higher
- Android SDK with API level 34

## Method 1: Using Android Studio (Recommended)

1. **Open the project in Android Studio:**
   ```bash
   # Navigate to your project directory
   cd /path/to/your/project
   
   # Open Android Studio and select "Open an existing project"
   # Choose the 'android' folder in your project
   ```

2. **Build APK:**
   - Go to `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - Wait for the build to complete
   - Click "locate" when build finishes to find your APK

3. **For Release APK (Signed):**
   - Go to `Build` → `Generate Signed Bundle / APK`
   - Choose APK
   - Create or select a keystore
   - Fill in the signing information
   - Choose "release" build variant
   - Click "Finish"

## Method 2: Using Command Line (Advanced)

1. **Navigate to android directory:**
   ```bash
   cd android
   ```

2. **Build debug APK:**
   ```bash
   ./gradlew assembleDebug
   ```
   APK will be generated at: `app/build/outputs/apk/debug/app-debug.apk`

3. **Build release APK (requires keystore):**
   ```bash
   ./gradlew assembleRelease
   ```

## Method 3: Using Capacitor CLI

1. **Build and open in Android Studio:**
   ```bash
   npx cap build android
   ```
   This will build the web app, sync with Android, and open Android Studio

## APK Location
- **Debug APK:** `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK:** `android/app/build/outputs/apk/release/app-release.apk`

## App Information
- **App Name:** Estre Furniture
- **Package ID:** com.estre.furniture
- **Version:** 1.0.0
- **Min SDK:** 22 (Android 5.1)
- **Target SDK:** 34 (Android 14)

## Features Included
✅ Login system (Customer/Staff)
✅ Furniture catalog with categories
✅ Sofa configurator with fabric selection
✅ Shopping cart functionality
✅ Responsive design for mobile
✅ Premium UI with luxury aesthetics

## Troubleshooting
- If build fails, ensure all dependencies are installed: `npm install`
- Make sure Android SDK is properly configured
- Check that JAVA_HOME is set correctly
- Ensure you have the required Android SDK platforms installed

## Testing the APK
1. Enable "Unknown sources" or "Install unknown apps" on your Android device
2. Transfer the APK to your device
3. Install and test all features
4. Check performance on different screen sizes