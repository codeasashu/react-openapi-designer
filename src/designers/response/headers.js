import React, { PureComponent } from 'react';
import { autoBindMethodsForReact } from 'class-autobind-decorator';
import produce from 'immer';
import { Button } from "@blueprintjs/core";
import { isEqual, set, unset } from 'lodash';
import OrderedDict from '../../ordered-dict';
import { generateHeaderName, defaultSchema } from '../../utils';
import Parameter from '../parameter';

@autoBindMethodsForReact()
class Headers extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            parameters: this.props.parameters || {}
        }
    }

    _addRow() {
      const { parameters } = this.state;
      const newParamName = generateHeaderName(parameters);
      this.setState(
        produce(draft => {
          set(
            draft.parameters,
            newParamName,
            {schema: defaultSchema.string}
          )
        })
      );
    }

    componentDidUpdate(oldProps, oldState) {
        const { parameters } = this.state;
        if(!isEqual(oldState.parameters, parameters)) {
            this.props.onChange(parameters);
        }
    }

    onChange(oldName, value) {
      const { name, in: _in, required, ...rest } = value;
      this.setState(
        produce(draft => {
          if(name !== oldName) {
            let orderDict = new OrderedDict(draft.parameters);
            const keyIndex = orderDict.findIndex(oldName);
            orderDict.insert(keyIndex, name, rest);
            orderDict.remove(oldName);
            draft.parameters = orderDict.toDict();
          }
          else draft.parameters[name] = rest;
        })
      );
    }

    render() {
        const { parameters } = this.state;
        return (
          <React.Fragment>
            <div className="flex items-center mt-5 mb-2">
                <div className="font-semibold text-gray-6 ml-1">Headers</div>
                <Button
                    small minimal className="ml-1" icon="plus"
                    onClick={this._addRow}
                />
            </div>
            {Object.keys(parameters).map((name, i) =>
                <Parameter
                    key={i}
                    name={name}
                    schema={parameters[name]?.schema}
                    description={parameters[name]?.description}
                    disableRequired={true}
                    onChange={e => this.onChange(name, e)}
                    onDelete={e => this.setState(
                      produce(draft => { unset(draft.parameters, name) })
                    )}
                />
            )}
          </React.Fragment>);
    }
};

export default Headers;