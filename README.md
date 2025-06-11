# Hypr
Revolutionize your school game—get instant access to cutting-edge school tools!

## Why use Hypr?
There are many reasons to use Hypr:

* **Extensibility**: Hypr allows you to use tools on any site to assist with anything!
* **Ease of use**: Hypr is easy to use and requires no knowledge of web development.
* **Speed**: Hypr is fast and can run tools quickly.
* **Customizability**: Hypr allows you to customize the behavior to your needs.

## Installation
Hypr can be installed in one of two ways:

* **Browser Extension**: You can install the Hypr browser extension from the [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/hypr/).
* **Bookmarklet**: You can install the Hypr bookmarklet by creating a new bookmark and setting the URL to `javascript:(function()%7B(function()%7Bconst%20response%3Dfetch(%22https%3A%2F%2Fget-hypr.github.io%2Fhypr%2Fhypr.latest.js%22).then(res%3D%3E%7Bif(!res.ok)%7Balert('Failed%20to%20load%20Hypr!')%3Breturn%7Dreturn%20res.text()%7D)%3Bresponse.then(scriptContent%3D%3E%7Bconst%20script%3Ddocument.createElement(%22script%22)%3Bscript.textContent%3DscriptContent%3Bdocument.body.appendChild(script)%7D)%7D)()%7D)()`

## Usage
Once installed, you can use Hypr to run tools on any website. To run a tools, simply click the Hypr icon in the top right corner of your browser and the Hypr window will appear where you can run tools.

## Examples
Here are a few examples of what you can do with Hypr:

* **Use a Calculator**: Use a calculator on any website to help you with math problems.
* **Write Notes**: You can write notes to help you remember things during class.
* **Summarize Text**: Easily summarize text from any website.
* **Stealth Opener**: Open websites **without** it showing up in your history.
* **History Flooder**: Use this tool to flood your history with fake history items.

## Contributing
Hypr is an open-source project and contributions are welcome. If you have an idea for a new feature or would like to contribute code, please open an issue or pull request on the [Hypr GitHub page](https://github.com/get-hypr/get-hypr.github.io).

## License
Hypr is licensed under the [MIT License](https://opensource.org/licenses/MIT).
