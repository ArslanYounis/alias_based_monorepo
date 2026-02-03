import ButtonsConfigs from "@/ui/Buttons/buttons.config";
import DummyConfigs from "@/ui/configs/Dummy.config";
import PlotSearchConfigs from "@/ui/configs/PlotSearch.config";

/**
 * Array of all component configurations to be exposed to service-builder
 * Add new component configs here to make them available in the service builder
 */
const exposeComponents = [ButtonsConfigs, DummyConfigs, PlotSearchConfigs];

export default exposeComponents;
