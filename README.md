# Hype Dynamic Camera

![Hype-Dynamic-Camera|690x487](https://playground.maxziebell.de/Hype/DynamicCamera/HypeDynamicCamera.jpg)

<sup>The cover artwork is not hosted in this repository and &copy;opyrighted by Max Ziebell</sup>

Create transformations based on a square defining the view port for animations and dynamic framing.

Documentation
--
## Features

- **Automatic Stage Transform**  
  Binds a camera element’s CSS transforms to your stage so that the scene always centers and scales to match.  
- **Flexible Fitting Modes**  
  Choose between `contain`, `cover`, or `fill` behaviors to control letterboxing versus cropping.  
- **IDE-Friendly Borders**  
  Highlights your dynamic camera region in the Hype editor by default (toggleable).  
- **Zero-Code Setup**  
  All options are set via data attributes in Hype’s Inspector—no manual scripting required.  
- **Lightweight and MIT-Licensed**  
  Approximately 4 KB, vanilla JavaScript, no dependencies, MIT license.

## Installation

Include **HypeDynamicCamera.js** in your Hype project using one of three methods:

1. **Via Hype Resources Panel**  
   - Drag and drop the `HypeDynamicCamera.js` file into Hype’s **Resources** panel.  
   - Hype will automatically link it in the document’s `<head>` when you publish or preview.

2. **Manual Reference Using `${resourcesFolderName}`**  
   - Copy `HypeDynamicCamera.js` into your project’s `${resourcesFolderName}` folder, located alongside your `.hype` document.  
   - In the **Document Inspector**, under **Head HTML**, add:
     ```html
     <script src="${resourcesFolderName}/HypeDynamicCamera.js"></script>
     ```  
   - Publish or preview your document.

3. **CDN Reference (not recommended)**  
   - In the **Document Inspector**, under **Head HTML**, add:
     ```html
     <script src="https://cdn.jsdelivr.net/gh/worldoptimizer/HypeDynamicCamera/HypeDynamicCamera.min.js"></script>
     ```  
   - **Note:** Using the CDN offers convenience but may introduce version mismatch or availability issues. We recommend downloading the script locally (via method 1 or 2) for production stability.

## Usage

1. Add a camera element on your scene (any rectangle or group) and assign it a CSS class (for example, `camera-element`).  
2. Assign your stage container a CSS class (for example, `stage-element`).  
3. In Hype’s **Element Inspector → Attributes**, add the data attributes described below to the camera element.  
4. (Optional) For custom stage overrides, add matching data attributes to the stage element.

## Data Attributes

Configure all options via Hype’s **Element Inspector → Attributes** panel.

### Camera Element Attributes

| Attribute                          | Description                                                                                 | Values                           | Default    |
|------------------------------------|---------------------------------------------------------------------------------------------|----------------------------------|------------|
| `data-dynamic-camera`              | Designates this element as the camera; set to the CSS selector for the stage container.     | `.stage-element`, `.my-stage`    | —          |
| `data-dynamic-camera-stage-fit`    | Controls how the stage scales to fit the camera’s viewport.                                  | `contain`, `cover`, `fill`       | `contain`  |
| `data-dynamic-camera-show`         | Boolean flag; when present, shows the camera border in the published output.                  | present                          | hidden     |

### Global IDE Styling (Optional)

| Method                              | Effect                                                                       |
|-------------------------------------|------------------------------------------------------------------------------|
| `HypeDynamicCamera.hideBorderInIDE()` | Call in code before DOM ready to disable the IDE border entirely.            |
| `.dynamic-camera-no-border`         | Add this class to the camera element to suppress only its IDE border.         |
| `--dynamic-camera-border`           | Override the default border style (e.g., `--dynamic-camera-border: solid blue 2px`). |

## API (Advanced)

For scenarios requiring manual invocation:

```js
hypeDocument.setupDynamicCamera(
  document.querySelector('.camera-element'),
  document.querySelector('.stage-element'),
  {
    stageFit: 'cover',
    showCamera: true
  }
);
```

- **`HypeDynamicCamera.version`** returns the version (`"1.2.5"`).
- **`HypeDynamicCamera.hideBorderInIDE()`** disables IDE-specific CSS injection.

## Example

Below is how to configure camera and stage elements through Hype’s **Element Inspector → Attributes** using class selectors:

| Element                   | Attribute                          | Value             |
|---------------------------|------------------------------------|-------------------|
| **Camera** (`.camera-element`) | `data-dynamic-camera`              | `.stage-element`  |
|                           | `data-dynamic-camera-stage-fit`    | `cover`           |
|                           | `data-dynamic-camera-show`         | (present)         |
| **Stage** (`.stage-element`)
|                           | *no camera-specific attributes*    | —                 |

Animate or drag the element with class `camera-element` in Hype’s Scene Editor; the published output will pan, zoom, and rotate the container with class `stage-element` automatically.

## License

Distributed under the MIT License. See the `LICENSE` file for details.



Content Delivery Network (CDN)
--

Latest version can be linked into your project using the following in the head section of your project:

```html
<script src="https://cdn.jsdelivr.net/gh/worldoptimizer/HypeDynamicCamera/HypeDynamicCamera.min.js"></script>
```
Optionally you can also link a SRI version or specific releases. 
Read more about that on the JsDelivr (CDN) page for this extension at https://www.jsdelivr.com/package/gh/worldoptimizer/HypeDynamicCamera

Learn how to use the latest extension version and how to combine extensions into one file at
https://github.com/worldoptimizer/HypeCookBook/wiki/Including-external-files-and-Hype-extensions
