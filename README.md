# React openapi designer

React openapi designer is a react based openapi designer that conforms to [Openapi specifications](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md)

## Live Preview

To quickly get started, you can go to [https://codeasashu.github.io/react-openapi-designer/](https://codeasashu.github.io/react-openapi-designer/)

You can create a new openapi spec from scratch, or you can just paste any
existing yaml to import the spec and edit from the UI.


## Hosting

You can also build and host the repo as a static website. To do so, first build
the project.

```sh
npm run build
```

This will put the compiled files in `dist/` directory. Upload everything in that
directory to a static hosting.


## Usage options

You can pass several options to the target HTML div. 

#### Listening to spec changes

You can listen to changes in the openapi spec and take actions on it

```html
  <react-openapi-designer id="abcdef" />

  <script type="text/javascript">
    window.onload = function () {
      var doc = document.getElementById("abcdef")
      doc.addEventListener("specChanged", function (e) {
        e.data.text().then((s) => {
          const spec = JSON.parse(s);
          console.log("spec in yaml syntax", spec.yaml)
          console.log("spec in json syntax", spec.json)
        })
      })
    }
  </script>
```

#### Adding mock url

Adding a external url for host mocking for the spec, will show up as a
mock url in the `Samples` widget.

```html
  <react-openapi-designer mock-url="http://domain.tld/your/mock/url" />
```

## Local development

To start local development, clone this repo.

```sh
git clone https://github.com/codeasashu/react-openapi-designer
```

Then, install npm modules

```sh
npm install
```

and finally start dev server:

```sh
npm run dev
```

