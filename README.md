# Deceptive Design pattern Google Chrome Extension

This repository includes a Google Chrome extension that can detect some [deceptive design patterns](https://deceptive.design/) on webpages. Currently, there are some detection methods implemented for limited time messages (mostly for WooCommerce) and some countdown timer plugins for WordPress. On top of that, the main purpose of this plugin is to filter out the visual interference deceptive design pattern in cookie banners. The detector built in for cookie banners alters the styling of consent buttons whenever it detects that they are different (and visual interference is used).

This browser plugin uses [VueJS](https://vuejs.org) for rendering the popup and settings sections.

## Extending the plugin

Adding a new detection method or a new deceptive design pattern is easy due to the framework of the plugin. For adding a new type of deceptive design pattern, head over to the `dark-patterns/src/models/dark-patterns` folder and add a new class that extends the abstract `DarkPattern` class. Also do not forget to add an instance of the new class in the `DarkPatternsCollection` class (in the `darkPatterns` class variable).

Adding a new method for analyzing a page is also easy, head on over to the `dark-patterns/src/models/page-analyzers` folder and create a new class that extends the `PageAnalyzer` class. Make sure to also add the new analyzer to a `Collection` and add that colleciton to a `DarkPattern` class. `PageAnalyzer` classes have two methods, an `analyzePageContent` method which analyzed the page content and returns a list of all elements that have been detected. The `alterBlock` is then executed for each of the elements that `analyzePageContent` returned. In this method you can for example equalize the styling of the cookie popup data.