import React, { PureComponent } from 'react';
import { autoBindMethodsForReact } from 'class-autobind-decorator';
import { Button } from "@blueprintjs/core";
import MarkupEditor from '../editors/markup-editor';
import ParameterRow from '../ui/parameter-row';
import BodySelector from '../ui/body-selector';
import SchemaDesigner from './schema';

@autoBindMethodsForReact()
class ResponseDesigner extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            headerOpen: false,
        };
    }

    _handleSchemaChange(schema) {
        console.log('updated schema', schema);
    }

    _handleHeaderToggle() {
        this.setState({ headerOpen: !this.state.headerOpen });
    }

    handleRowDelete() {
        console.log('updated delete');
    }

    handleRowSchemaChange(schema) {
        console.log('updated row schema', schema);
    }

    handleDescription(e) {
        console.log('description changed', e);
    }

    descriptionRenderer() {
        return (
            <div className="flex-1">
                <MarkupEditor value={'abc'} onChange={this.handleDescription} /> 
            </div>
        )
    }

    headerSectionRenderer() {
        return (
            <div className="flex items-center mt-5 mb-2">
                <div className="font-semibold text-gray-6 ml-1">Headers</div>
                <Button
                    small className="ml-1" icon="plus"
                    onClick={this._handleHeaderToggle} 
                />
            </div>
        )
    }

    schemaRenderer() {
        return <div className="mt-8">
                    <SchemaDesigner
                        onChange={this._handleSchemaChange}
                        dark
                    />
                </div>
    }

    render() {
        return (
            <div className="bp3-dark">
                {this.descriptionRenderer()}
                {this.headerSectionRenderer()}
                {this.state.headerOpen && (<ParameterRow
                    schema={{type: 'string'}}
                    deleteRow={this.handleRowDelete}
                    handleSchemaChange={this.handleRowSchemaChange} 
                />)}
                <div className="mt-8">
                    <BodySelector />
                    {this.schemaRenderer()}
                </div>
            </div>
        );
    }
};

export default ResponseDesigner;