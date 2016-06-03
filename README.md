# linter-jing

[![Travis CI Status](https://travis-ci.org/aerhard/linter-jing.svg?branch=master)](https://travis-ci.org/aerhard/linter-jing)
[![Appveyor CI Status](https://ci.appveyor.com/api/projects/status/github/aerhard/linter-jing?branch=master&svg=true)](https://ci.appveyor.com/project/aerhard/linter-jing)
[![Circle CI Status](https://circleci.com/gh/aerhard/linter-jing/tree/master.svg?style=shield&circle-token=93c48cdbcad41ba1b7cd08f231286b94b195de53)](https://circleci.com/gh/aerhard/linter-jing)
[![Dependencies](https://david-dm.org/aerhard/linter-jing.svg)](https://david-dm.org/aerhard/linter-jing)

On-the-fly validation and well-formedness check of XML documents in Atom.

Supported schema types: RELAX NG (XML and compact syntax), Schematron (1.5, ISO), W3C Schema (XSD 1.0) and DTD.

The XML document checks are based on a slightly extended and adapted version of [Jing](https://github.com/relaxng/jing-trang).

## Installation

Run `apm install linter-jing` or select the package in Atom's Settings view / Install Packages.

The linter depends on a Java Runtime Environment (JRE) v1.6 or above. If running `java -version` on the command line returns an appropriate version number, you should be set. Otherwise, install a recent JRE and provide the path to the Java executable either in the PATH environment variable or in the linter-jing package settings in Atom.

## Settings

* *Java Executable Path:* The path to the Java executable file (`java`) to be used running Jing.
* *JVM Arguments:* Space-separated list of arguments to get passed to the Java Virtual Machine on which the validation server is run.
* *Schema Cache Size:* The maximum number of schemata retained simultaneously in memory. (There is a -- now fixed -- bug in a recent version of Atom's Settings View preventing users from setting 0 as a value in numeric fields, see the discussion at https://github.com/atom/settings-view/issues/783). Currently only schemata referenced via xml-model processing instructions are added to the cache.
* *Display Schema Parser Warnings:* Whether or not to display warning messages from the schema parser.
* *XML Catalog:* The path to the XML Catalog file to be used in validation.

(In order to edit the settings, open Atom's settings view by pressing <kbd>Ctrl-,</kbd> or by selecting "Packages" / "Settings View" / "Open" in the main menu). In the "Packages" tab, search for "linter-jing" and click the "Settings" button.)

## Commands

* *linter-jing:clear-schema-cache*: Removes all schema and catalog data from the in-memory cache so it will get read from disk in the next validation run.

## File types

The linter gets activated when the document in the active editor tab has one of the following top-level grammar scopes: `text.xml`, `text.xml.xsl`, `text.xml.plist` or `text.mei`. The Atom core package [language-xml](https://atom.io/packages/language-xml) (installed by default) assigns a large set of common XML file extensions to the `text.xml` and `text.xml.xsl` scopes. XML property lists are supported by another core package, [language-property-list](https://atom.io/packages/language-property-list). In order to associate `.mei` files with `text.mei`, install [language-mei](https://atom.io/packages/language-xml).

Please send a pull request or create an issue on the [Github page of this package](https://github.com/aerhard/linter-jing) when you would like to extend the linter's list of supported grammar scopes. If there's no grammar scope available for your file name extension yet, you can either request to extend the list at https://github.com/atom/language-xml or create a local association in your `config.cson`:

1. Open `config.cson` by pressing <kbd>Ctrl-Shift-P</kbd> and then entering `Open Your Config`
2. Add or extend the `customFileTypes` property of `core`

The following example assigns the `.tei` and `.odd` extensions to the `text.xml` grammar scope:  

```
  core:
    customFileTypes:
      "text.xml": [
        "tei"
        "odd"
      ]
```

## Specifying Schemata

The linter supports the common ways of specifying schemata in XML files (DOCTYPE declarations, XSI schema instance attributes, xml-model processing instructions; see  https://github.com/aerhard/linter-jing/tree/master/spec/xml for a collection of examples).   
If your documents contain references to remote schemata, you can improve performance and reduce network traffic by using an XML catalog file to map remote resources to local files. Projects like the Text Encoding Initiative (TEI) provide [packages](https://sourceforge.net/projects/tei/files/TEI-P5-all/) which include catalog files that can be added to the linter settings.

## Development

While developing, run `npm run watch` to transpile the ES6 code in `src` to ES5 in `lib`.
