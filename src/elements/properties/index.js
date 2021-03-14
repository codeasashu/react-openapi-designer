import StringProperty from './string-property';
import NumberProperty from './number-property';
import BooleanProperty from './boolean-property';
import ArrayProperty from './array-property';
import ObjectProperty from './object-property';

const Properties = {
    String: StringProperty,
    Number: NumberProperty,
    Boolean: BooleanProperty,
    Array: ArrayProperty,
    Object: ObjectProperty,
};

export default Properties;