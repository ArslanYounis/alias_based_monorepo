import TextInputConfig from "~/src/ui/TextInput/config";
import PhoneInputConfig from "~/src/ui/PhoneInput/config";
import TextAreaConfig from "~/src/ui/TextArea/config";
import SelectConfig from "~/src/ui/Select/config";
import MultiSelectConfig from "~/src/ui/MultiSelect/config";
import CurrencyConfig from "~/src/ui/CurrencyInput/config";
import NumberConfig from "~/src/ui/NumberInput/config";
import DateSelectConfig from "~/src/ui/DateSelect/config";
import CheckboxFieldConfig from "~/src/ui/CheckboxField/config";
import CheckboxInputConfig from "~/src/ui/CheckboxInput/config";
import RadioFieldConfig from "~/src/ui/RadioField/config";
import RadioInputConfig from "~/src/ui/RadioInput/config";

/**
 * Array of all form component configurations to be exposed to service-builder
 * Add new component configs here to make them available in the form builder
 */
const exposeFormComponents = [
  TextInputConfig,
  PhoneInputConfig,
  TextAreaConfig,
  SelectConfig,
  MultiSelectConfig,
  CurrencyConfig,
  NumberConfig,
  DateSelectConfig,
  CheckboxFieldConfig,
  CheckboxInputConfig,
  RadioFieldConfig,
  RadioInputConfig,
];

export default exposeFormComponents;
