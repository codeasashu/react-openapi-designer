# openapi-designer

`openapi-designer` is a React component library of UI elements needed to build [Openapi specifications](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md)

## Usage

Import the application and start using it in any React basded application

```js
// ...
import ReactOpenapiDesigner from 'react-openapi-designer';

const handleChange = (schema) => {
    console.log('Changed Schema', schema)
}

export const MyApp = (props) => {
    const initSchema = {
        type: 'object',
        properties: {
            status: {type: 'string'}
        },
        required: ['status'],
        examples: {}
    };
    return  (<ReactOpenapiDesigner
                dark
                schema={schema}
                onChange={handleChange} 
            />);
}
```

## Supported props

Following props are supported:


| name |  default | description |
| ---  |    ---   |   ---   |
| dark |  false   | Enable `dark` mode
| schema | `{type: "object"}` | The default schema to start with |
| onChange | None | This props is triggered on any change in the schema. You'll get a javascript object of schema |

## Local development

To start local development, clone this repo and run `npm run dev`.


If you wish to use this repo in some other project, while quickly making changes,
you should try using `npm run watch`, which starts this project in watch mode and is
a **lot** faster.
