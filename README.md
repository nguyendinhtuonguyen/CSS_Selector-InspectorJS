# CssSelector-InspectorJS

[![Build Status](https://travis-ci.org/nguyendinhtuonguyen/CssSelector-InspectorJS.svg?branch=master)](https://travis-ci.org/nguyendinhtuonguyen/CssSelector-InspectorJS)

A lightweight JavaScript library to help you generate CSS selectors by clicking anywhere on a web page.

An open source library. :) Feel free to use it on your product.


##How does it work?
A quick high-level overview:
- Capture an element by a click
- Traverses up the DOM tree querying both the current location’s parent element and the global document (DOM)
- Check if the target element has an ID
- Check it has a class/tag which is unique to the global document
- Check it has a class/tag which is unique to it’s parent
- Support ‘nth-child’ selector
- Continue to build up a selector string until find one which is able to return the original target element
- Return full css selector path to a custom callback defined by user

**Notes**
> * Sometimes when using css selector returned, web browser cannot identify. Please check your page at [here](https://validator.w3.org/)

##Installation
Load the script file: inspector.js to your application:
```html
<script type="text/javascript" src="..../Source/inspector.js"></script>
```

##Usage
 The inspector is available since you loaded the page
 
 Using by calling window.inspector
 
##Options:
- ignoreClasses: element matches this class regix patterns aren't counted
- hiddenClasses: element matches this class regix patterns will be ignored all its css
