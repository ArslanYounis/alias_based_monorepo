import TextInputConfigs from "@/ui/TextInput/textInput.config";
import TextAreaConfigs from "@/ui/TextArea/textArea.config";
import SelectConfigs from "@/ui/Select/select.config";
import MultiSelectConfigs from "@/ui/MultiSelect/multiSelect.config";
import CurrencyConfigs from "@/ui/CurrencyInput/currency.config";
import NumberConfigs from "@/ui/NumberInput/number.config";
import CheckboxFieldConfigs from "@/ui/CheckboxField/checkboxField.config";
import CheckboxInputConfigs from "@/ui/CheckboxInput/checkboxInput.config";
import RadioFieldConfigs from "@/ui/RadioField/radioField.config";
import RadioInputConfigs from "@/ui/RadioInput/radioInput.config";
import DateSelectConfigs from "@/ui/DateSelect/dateSelect.config";
import PhoneInputConfigs from "@/ui/PhoneInput/phoneInput.config";
import typographyConfig from "@/ui/Typography/typography.config";

/**
 * Array of all form component configurations to be exposed to service-builder
 * Add new component configs here to make them available in the form builder
 */
const exposeFormComponents = [
  TextInputConfigs,
  PhoneInputConfigs,
  TextAreaConfigs,
  SelectConfigs,
  MultiSelectConfigs,
  CurrencyConfigs,
  NumberConfigs,
  DateSelectConfigs,
  CheckboxFieldConfigs,
  CheckboxInputConfigs,
  RadioFieldConfigs,
  RadioInputConfigs,
  typographyConfig,
];

export default exposeFormComponents;
