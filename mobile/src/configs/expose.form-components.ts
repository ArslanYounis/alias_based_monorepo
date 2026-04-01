import TextInputConfig from "~/src/ui/TextInput/textInput.config";
import PhoneInputConfig from "~/src/ui/PhoneInput/phoneInput.config";
import TextAreaConfig from "~/src/ui/TextArea/textArea.config";
import SelectConfig from "~/src/ui/Select/select.config";
import MultiSelectConfig from "~/src/ui/MultiSelect/multiSelect.config";
import CurrencyConfig from "~/src/ui/CurrencyInput/currency.config";
import NumberConfig from "~/src/ui/NumberInput/number.config";
import DateSelectConfig from "~/src/ui/DateSelect/dateSelect.config";
import CheckboxFieldConfig from "~/src/ui/CheckboxField/checkboxField.config";
import CheckboxInputConfig from "~/src/ui/CheckboxInput/checkboxInput.config";
import RadioFieldConfig from "~/src/ui/RadioField/radioField.config";
import RadioInputConfig from "~/src/ui/RadioInput/radioInput.config";

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
