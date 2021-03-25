import React from 'react';
import { ButtonGroup, Button, ControlGroup, InputGroup } from "@blueprintjs/core";
import { Popover2, Tooltip2 } from "@blueprintjs/popover2";
import LocaleProvider from '../locale';
import AdvancedProperties from '../elements/advanced-properties';

const ParameterRow = (props) => {
    return (
        <ControlGroup>
            <InputGroup className="flex-auto" placeholder="Header0" />
            <div className="bp3-select flex-shrink">
                <select data-test="param-type-select">
                    <option label="any" value="">any</option>
                    <option value="string">string</option>
                    <option value="number">number</option>
                    <option value="integer">integer</option>
                    <option value="boolean">boolean</option>
                    <option value="array">array</option>
                </select>
            </div>
            <InputGroup className="flex-auto" placeholder="Description" />
            <ButtonGroup>
                <Popover2
                  content={
                  <AdvancedProperties
                    data={JSON.stringify(props.schema, null, 2)}
                    onChange={props.handleSchemaChange} />
                  }
                  placement="right">
                  <Tooltip2 content={<span>{LocaleProvider('adv_setting')}</span>}>
                    <Button small minimal icon="property" />
                  </Tooltip2>
                </Popover2>
                <Tooltip2 content="Delete field">
                  <Button onClick={props.deleteRow} small minimal icon="trash" />
                </Tooltip2>
            </ButtonGroup>
        </ControlGroup>
    )
};

export default ParameterRow;