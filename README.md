# Undercover

Undercover is a pass-and-play word game for a group sharing one device. It includes several hidden-role modes, English and French interfaces, saved player groups, and custom word pairs.

## Run locally

Use Node.js 20.x (20.9 or newer) with the pinned Angular 17 toolchain. [Angular version compatibility](https://angular.dev/reference/versions#unsupported-angular-versions)

```sh
cd undercover-app
npm ci
npm start
```

Open [localhost:4200](http://localhost:4200). From the same directory, run `npm run build` to generate the production web build in `dist/undercover-app/browser`.

## Mobile builds

The Angular app is wrapped with Capacitor. Follow [the Android build guide](BUILDING_APK.md) to build a debug APK. For iOS, build the web app, run `npx cap sync ios` from `undercover-app`, then open the project with `npx cap open ios` on a Mac with Xcode and CocoaPods. [Capacitor 6 environment setup](https://capacitorjs.com/docs/v6/getting-started/environment-setup)

## Contributing and license

See the [contributor guide](CONTRIBUTING.md) for bug reports and pull requests. The project's original code is available under the [MIT License](LICENSE). See the [third-party notices](THIRD_PARTY_NOTICES.md) for the toolchain and generated platform files.
