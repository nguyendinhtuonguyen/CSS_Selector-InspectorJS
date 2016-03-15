/*
 csspath_jsInspector v1.0 by Uyen Nguyen
 An open source library. :) Feel free to use it for your product
 The inspector is available since you loaded the page
 Using by calling window.inspector
 A quick high-level overview:
- Capture an element by a click
- Traverses up the DOM tree querying both the current location’s parent element and the global document (DOM)
- Check if the target element has an ID
- Check it has a class/tag which is unique to the global document
- Check it has a class/tag which is unique to it’s parent
- Support ‘nth-child’ selector
- Continue to build up a selector string until find one which is able to return the original target element
- Return full path by a custom callback to the users

 Config options:
- ignoreClasses:"", //element math this class regix patterns aren't counted
- hiddenClasses:"", //element matches this class regix patterns will be ignored all its css

 */

(function (document) {

    inspectorWrapper = function () {
        this.last;
        this.inspectorClickedCallback = null;
        this.inspectorCancelCallback = null;
        this.defaults = {
            ignoreClasses: [],
            hiddenClasses: [],
        }
        this.options = {};

    };


    inspectorWrapper.prototype.merge_options = function (obj1, obj2) {
        var obj3 = {};
        for (var attrname in obj1) {
            obj3[attrname] = obj1[attrname];
        }
        for (var attrname in obj2) {
            obj3[attrname] = obj2[attrname];
        }
        return obj3;
    }

    inspectorWrapper.prototype.config = function (config) {
        this.options = this.merge_options(this.defaults, config);
    }

    function inspectorMouseOver(e) {
        var element = e.target;

        element.style.outline = '2px solid #3FAADC';

        inspector.last = element;
    }

    function inspectorMouseOut(e) {
        e.target.style.outline = '';
    }

    function deposeInspector(e) {
        if (document.removeEventListener) {
            document.removeEventListener("mouseover", inspectorMouseOver, true);
            document.removeEventListener("mouseout", inspectorMouseOut, true);
            document.removeEventListener("click", inspector.inspectorOnClick, true);
            document.removeEventListener("keydown", inspector.cancel, true);

            inspector.last.style.outline = 'none';
            document.body.style.cursor = "";
        }
    }

    inspectorWrapper.prototype.inspectorOnClick = function (e) {
        e.preventDefault();
        e.stopPropagation();

        deposeInspector(e)

        if (inspectorClickedCallback) {
            var target = new inspectorWrapper.target(e, inspector.options);
            var path = (target.calculateSelector());

            inspectorClickedCallback(e, path);
        }

        return false;
    }

    inspectorWrapper.prototype.cancel = function (e) {
        deposeInspector(e)

        if (inspectorCancelCallback) {
            inspectorCancelCallback();
        }
    }


    inspectorWrapper.prototype.start = function (config, clickedCallback, cancelCallback) {
        if (document.addEventListener) {

            inspectorClickedCallback = clickedCallback;
            inspectorCancelCallback = cancelCallback;

            document.addEventListener("mouseover", inspectorMouseOver, true);
            document.addEventListener("mouseout", inspectorMouseOut, true);
            document.addEventListener("click", this.inspectorOnClick, true); // cannot inject callback because cannot removeEvent later
            document.addEventListener("keydown", this.cancel, true);

            document.body.style.cursor = "pointer";

        }
    }


    // START TARGET

    inspectorWrapper.target = function (el, config) {
        this.targetElement = el.target;
        this.currentElement = el.target;
        this.options = config;
        this.completed = false;
        this.selectors = [];
    };

    inspectorWrapper.target.prototype.calculateSelector = function () {
        this.traverseAndCalculate(this.targetElement);

        return this.generateSelectorString();
    };

    inspectorWrapper.target.prototype.generateSelectorString = function () {
        var selectorString = "";
        for (var i = this.selectors.length - 1; i >= 0; i--) {
            selectorString += this.selectors[i];
            if (i != 0) {
                selectorString += " ";
            }
        }

        return selectorString;
    };

    inspectorWrapper.target.prototype.traverseAndCalculate = function (element) {
        var id = element.id;
        var className = element.className;

        while (this.completed == false && this.currentElement != null) {
            id = this.currentElement.id;
            className = this.currentElement.className;

            if (id != "" && id != null) {
                this.calculateIdSelector(id);
            }
            else if (className != "" && className != null) {
                this.calculateClassSelector(className);
            }
            else {
                this.calculateTagSelector();
            }

            this.currentElement = this.currentElement.parentElement;
        }

        return this.selectors;
    };

    inspectorWrapper.target.prototype.calculateIdSelector = function (id) {
        if (document.getElementById(id) != null) {
            this.selectors.push("#" + id);
            this.completed = true;
        }
    };

    inspectorWrapper.target.prototype.calculateClassSelector = function (classname) {
        var selectorForClass = this.generateClassesString(classname);
        /* remove dupe */

        if (selectorForClass != "") {
            this.selectors.push("." + selectorForClass);

            var foundElements = document.getElementsByClassName(selectorForClass);
            if (foundElements.length == 1) {
                this.completed = true;
            }
        }
        else {
            this.calculateTagSelector();
        }
    };

    inspectorWrapper.target.prototype.calculateTagSelector = function () {
        var tagName = this.currentElement.nodeName;
        var parent = this.currentElement.parentElement;
        var childElements = (parent == null ? [] : parent.children);
        var childrenByTagElements = (parent == null ? [] : parent.getElementsByTagName(tagName));

        if (tagName.toLowerCase() == "body") {
            this.selectors.push(tagName.toLowerCase());
        }

        else if (childrenByTagElements.length == 1) {
            this.selectors.push(tagName.toLowerCase());
        }

        else {
            for (var i = 0; i < childElements.length; i++) {
                if (childElements[i] == this.currentElement) {
                    this.selectors.push(tagName.toLowerCase() + ":nth-child(" + (i + 1) + ")");
                }
            }
        }
    };


    inspectorWrapper.target.prototype.generateClassesString = function (classname) {
        var validClasses = this.getValidClasses(classname);
        var parent = this.currentElement.parentElement;

        //check current element's parent is unique
        for (var i = 0; i < validClasses.length; i++) {
            if (parent.getElementsByClassName(validClasses[i]).length == 1 &&
                parent.getElementsByClassName(validClasses[i])[0] == this.currentElement) {
                return validClasses[i];
            }
        }

        var className = validClasses[0];
        var foundElements = parent.getElementsByClassName(className);
        for (var i = 0; i < foundElements.length; i++) {
            if (foundElements[i] == this.currentElement) {
                return className + ":nth-child(" + (i + 1) + ")";
            }
        }

        return validClasses.join(", ");
    };

    inspectorWrapper.target.prototype.getValidClasses = function (className) {
        var classes = className.split(" ");
        var classArr = [];

        for (var i = 0; i < classes.length; i++) {
            // don't use css selector when element is hidden
            if (this.matchPattern(classes[i], this.options.hiddenClasses))
                return [];

            if (this.isAllowedClass(classes[i])) {
                if (this.classNotExist(classes[i], classArr)) {
                    classArr.push(classes[i]);
                }
            }
        }
        return classArr;
    };

    inspectorWrapper.target.prototype.classNotExist = function (className, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (className.toLowerCase() == arr[i].toLowerCase()) {
                return false;
            }
        }
        return true;
    };

    inspectorWrapper.target.prototype.isAllowedClass = function (className) {
        var className = className.toLowerCase();
        if (this.matchPattern(className, this.options.ignoreClasses)) {
            return false;
        }

        return true;
    };

    inspectorWrapper.target.prototype.matchPattern = function (string, regexpArr) {
        for (var i = 0; i < regexpArr.length; i++) {
            var expr = regexpArr[i];
            var pattern = new RegExp(expr);
            return pattern.test(string);
        }

        return false;
    }

    /* END OF CSS PATH GENERATE */

    window.inspector = new inspectorWrapper();

})(document);