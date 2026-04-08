/**
 * Tests for the shared ApplicationMessage component.
 *
 * All platform imports (Container, Text, Buttons, TextInput, RadioInput,
 * CheckboxInput, icons) and SharedLanguageSwitchRenderer are mocked.
 * Tests cover: status styles (success/error/information/action), title
 * and description rendering, renderInput branches (text, checkbox, radio,
 * button, select, none), platform='web' vs 'mobile' icon visibility,
 * language switching, and onInputChange / onClick callbacks.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

// ── Standard language-switch mocks ──────────────────────────────────────────
jest.mock("~/components/shared/SharedLanguageSwitchRenderer", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ value, value_ar, language }: any) =>
      React.createElement(
        Text,
        null,
        language === "ar" && value_ar ? value_ar : value ?? ""
      ),
  };
});
jest.mock("@shared/components/SharedLanguageSwitchRenderer", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ value, value_ar, language }: any) =>
      React.createElement(
        Text,
        null,
        language === "ar" && value_ar ? value_ar : value ?? ""
      ),
  };
});

// ── Platform mocks ────────────────────────────────────────────────────────
jest.mock("@platform/Container", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Container: ({ children, dir, ...props }: any) =>
      React.createElement(View, { ...props, accessibilityLabel: dir }, children),
  };
});

jest.mock("@platform/Text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Text: ({ children, ...props }: any) =>
      React.createElement(Text, props, children),
  };
});

jest.mock("@platform/Buttons", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    Buttons: ({ title, title_ar, language, onClick, disabled }: any) => {
      const label = language === "ar" && title_ar ? title_ar : title;
      return React.createElement(
        TouchableOpacity,
        { testID: `btn-${label}`, onPress: onClick, disabled },
        React.createElement(Text, null, label)
      );
    },
  };
});

// ── TextInput mock ─────────────────────────────────────────────────────────
jest.mock("@platform/TextInput", () => {
  const React = require("react");
  const { TextInput } = require("react-native");
  return {
    TextInput: ({ value, onChange, fieldType, label, placeholder }: any) =>
      React.createElement(TextInput, {
        testID: `text-input-${fieldType || "text"}`,
        value: value ?? "",
        onChangeText: onChange,
        placeholder: placeholder || label || "",
      }),
  };
});

// ── RadioInput mock ────────────────────────────────────────────────────────
jest.mock("@platform/RadioInput", () => {
  const React = require("react");
  const { View, TouchableOpacity, Text } = require("react-native");
  return {
    RadioInput: ({ options, checked, onChange }: any) =>
      React.createElement(
        View,
        { testID: "radio-input" },
        options?.map((opt: any, i: number) =>
          React.createElement(
            TouchableOpacity,
            {
              testID: `radio-option-${opt.value}`,
              key: i,
              onPress: () => onChange?.(opt.value),
            },
            React.createElement(Text, null, opt.label)
          )
        )
      ),
  };
});

// ── CheckboxInput mock ─────────────────────────────────────────────────────
jest.mock("@platform/CheckboxInput", () => {
  const React = require("react");
  const { View, TouchableOpacity, Text } = require("react-native");
  return {
    CheckboxInput: ({ options, value, onChange }: any) =>
      React.createElement(
        View,
        { testID: "checkbox-input" },
        options?.map((opt: any, i: number) =>
          React.createElement(
            TouchableOpacity,
            {
              testID: `checkbox-option-${opt.value}`,
              key: i,
              onPress: () => {
                const selected = Array.isArray(value) ? [...value] : [];
                if (selected.includes(opt.value)) {
                  onChange?.(selected.filter((v: string) => v !== opt.value));
                } else {
                  onChange?.([...selected, opt.value]);
                }
              },
            },
            React.createElement(Text, null, opt.label)
          )
        )
      ),
  };
});

// ── Icons mock ─────────────────────────────────────────────────────────────
jest.mock("@platform/icons", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    AppMessageSuccessIcon: () => React.createElement(View, { testID: "icon-success" }),
    AppMessageErrorIcon: () => React.createElement(View, { testID: "icon-error" }),
    AppMessageInformationIcon: () => React.createElement(View, { testID: "icon-info" }),
    AppMessageActionIcon: () => React.createElement(View, { testID: "icon-action" }),
  };
});

import ApplicationMessage from "@shared/components/ApplicationMessage/ApplicationMessage";

const baseProps = {
  title: "Operation Complete",
  title_ar: "العملية مكتملة",
  description: "Your request was processed.",
  description_ar: "تمت معالجة طلبك.",
};

const radioOptions = [
  { label: "Option A", label_ar: "الخيار أ", value: "a" },
  { label: "Option B", label_ar: "الخيار ب", value: "b" },
];

const checkboxOptions = [
  { label: "Choice 1", label_ar: "الاختيار ١", value: "c1" },
  { label: "Choice 2", label_ar: "الاختيار ٢", value: "c2" },
];

describe("ApplicationMessage", () => {
  // ── Default rendering ───────────────────────────────────────────────────

  it("renders without crashing with minimal props", () => {
    render(<ApplicationMessage {...baseProps} />);
  });

  it("renders title", () => {
    render(<ApplicationMessage {...baseProps} />);
    expect(screen.getByText("Operation Complete")).toBeTruthy();
  });

  it("renders description", () => {
    render(<ApplicationMessage {...baseProps} />);
    expect(screen.getByText("Your request was processed.")).toBeTruthy();
  });

  // ── Language switching ────────────────────────────────────────────────────

  it("renders Arabic title when language='ar'", () => {
    render(<ApplicationMessage {...baseProps} language="ar" />);
    expect(screen.getByText("العملية مكتملة")).toBeTruthy();
  });

  it("renders Arabic description when language='ar'", () => {
    render(<ApplicationMessage {...baseProps} language="ar" />);
    expect(screen.getByText("تمت معالجة طلبك.")).toBeTruthy();
  });

  // ── Status icons (platform='web') ─────────────────────────────────────────

  it("renders success icon when status='success' and platform='web'", () => {
    render(<ApplicationMessage {...baseProps} status="success" platform="web" />);
    expect(screen.getByTestId("icon-success")).toBeTruthy();
  });

  it("renders error icon when status='error' and platform='web'", () => {
    render(<ApplicationMessage {...baseProps} status="error" platform="web" />);
    expect(screen.getByTestId("icon-error")).toBeTruthy();
  });

  it("renders information icon when status='information' and platform='web'", () => {
    render(<ApplicationMessage {...baseProps} status="information" platform="web" />);
    expect(screen.getByTestId("icon-info")).toBeTruthy();
  });

  it("renders action icon when status='action' and platform='web'", () => {
    render(<ApplicationMessage {...baseProps} status="action" platform="web" />);
    expect(screen.getByTestId("icon-action")).toBeTruthy();
  });

  it("does not render icons when platform='mobile'", () => {
    render(<ApplicationMessage {...baseProps} status="success" platform="mobile" />);
    expect(screen.queryByTestId("icon-success")).toBeNull();
  });

  // ── No input rendered ─────────────────────────────────────────────────────

  it("renders no input when type and fieldType are not provided", () => {
    render(<ApplicationMessage {...baseProps} />);
    expect(screen.queryByTestId("text-input-text")).toBeNull();
    expect(screen.queryByTestId("radio-input")).toBeNull();
    expect(screen.queryByTestId("checkbox-input")).toBeNull();
  });

  // ── type='text' ───────────────────────────────────────────────────────────

  it("renders TextInput when type='text'", () => {
    render(<ApplicationMessage {...baseProps} type="text" value="Hello" />);
    expect(screen.getByTestId("text-input-text")).toBeTruthy();
  });

  it("calls onInputChange when text input changes", () => {
    const onInputChange = jest.fn();
    render(
      <ApplicationMessage {...baseProps} type="text" value="" onInputChange={onInputChange} />
    );
    fireEvent.changeText(screen.getByTestId("text-input-text"), "New value");
    expect(onInputChange).toHaveBeenCalledWith("New value");
  });

  it("renders TextInput with custom fieldType", () => {
    render(<ApplicationMessage {...baseProps} type="text" fieldType="date" value="" />);
    expect(screen.getByTestId("text-input-date")).toBeTruthy();
  });

  // ── type='radio' ──────────────────────────────────────────────────────────

  it("renders RadioInput when type='radio' and options provided", () => {
    render(
      <ApplicationMessage {...baseProps} type="radio" options={radioOptions} value="" />
    );
    expect(screen.getByTestId("radio-input")).toBeTruthy();
  });

  it("renders radio option labels", () => {
    render(
      <ApplicationMessage {...baseProps} type="radio" options={radioOptions} value="" />
    );
    expect(screen.getByText("Option A")).toBeTruthy();
    expect(screen.getByText("Option B")).toBeTruthy();
  });

  it("calls onInputChange when radio option selected", () => {
    const onInputChange = jest.fn();
    render(
      <ApplicationMessage
        {...baseProps}
        type="radio"
        options={radioOptions}
        value=""
        onInputChange={onInputChange}
      />
    );
    fireEvent.press(screen.getByTestId("radio-option-a"));
    expect(onInputChange).toHaveBeenCalledWith("a");
  });

  it("does not render RadioInput when type='radio' but options is undefined", () => {
    render(<ApplicationMessage {...baseProps} type="radio" />);
    expect(screen.queryByTestId("radio-input")).toBeNull();
  });

  it("renders Arabic radio option labels when language='ar'", () => {
    render(
      <ApplicationMessage {...baseProps} type="radio" options={radioOptions} language="ar" />
    );
    expect(screen.getByText("الخيار أ")).toBeTruthy();
  });

  // ── type='checkbox' ───────────────────────────────────────────────────────

  it("renders CheckboxInput when type='checkbox' and options provided", () => {
    render(
      <ApplicationMessage {...baseProps} type="checkbox" options={checkboxOptions} value={[]} />
    );
    expect(screen.getByTestId("checkbox-input")).toBeTruthy();
  });

  it("renders checkbox option labels", () => {
    render(
      <ApplicationMessage {...baseProps} type="checkbox" options={checkboxOptions} value={[]} />
    );
    expect(screen.getByText("Choice 1")).toBeTruthy();
    expect(screen.getByText("Choice 2")).toBeTruthy();
  });

  it("calls onInputChange with selected values when checkbox clicked", () => {
    const onInputChange = jest.fn();
    render(
      <ApplicationMessage
        {...baseProps}
        type="checkbox"
        options={checkboxOptions}
        value={[]}
        onInputChange={onInputChange}
      />
    );
    fireEvent.press(screen.getByTestId("checkbox-option-c1"));
    expect(onInputChange).toHaveBeenCalledWith(["c1"]);
  });

  it("does not render CheckboxInput when type='checkbox' but options is undefined", () => {
    render(<ApplicationMessage {...baseProps} type="checkbox" />);
    expect(screen.queryByTestId("checkbox-input")).toBeNull();
  });

  it("renders Arabic checkbox option labels when language='ar'", () => {
    render(
      <ApplicationMessage {...baseProps} type="checkbox" options={checkboxOptions} language="ar" />
    );
    expect(screen.getByText("الاختيار ١")).toBeTruthy();
  });

  // ── type='button' ─────────────────────────────────────────────────────────

  it("renders Buttons when type='button'", () => {
    render(<ApplicationMessage {...baseProps} type="button" label="Confirm" />);
    expect(screen.getByTestId("btn-Confirm")).toBeTruthy();
  });

  it("calls onClick when button type pressed", () => {
    const onClick = jest.fn();
    render(
      <ApplicationMessage {...baseProps} type="button" label="Confirm" onClick={onClick} />
    );
    fireEvent.press(screen.getByTestId("btn-Confirm"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // ── fieldType='select' ────────────────────────────────────────────────────

  it("renders TextInput with select fieldType when fieldType='select'", () => {
    render(
      <ApplicationMessage
        {...baseProps}
        fieldType="select"
        value="option1"
        options={[{ label: "Option 1", value: "option1" }]}
      />
    );
    expect(screen.getByTestId("text-input-select")).toBeTruthy();
  });

  it("calls onInputChange for single select", () => {
    const onInputChange = jest.fn();
    render(
      <ApplicationMessage
        {...baseProps}
        fieldType="select"
        selectType="single"
        value=""
        options={[{ label: "Option 1", value: "option1" }]}
        onInputChange={onInputChange}
      />
    );
    fireEvent.changeText(screen.getByTestId("text-input-select"), "option1");
    expect(onInputChange).toHaveBeenCalledWith("option1");
  });

  it("calls onInputChange with array for multi select", () => {
    const onInputChange = jest.fn();
    render(
      <ApplicationMessage
        {...baseProps}
        fieldType="select"
        selectType="multi"
        value=""
        options={[{ label: "Option 1", value: "option1" }]}
        onInputChange={onInputChange}
      />
    );
    fireEvent.changeText(screen.getByTestId("text-input-select"), "opt1, opt2");
    expect(onInputChange).toHaveBeenCalledWith(["opt1", "opt2"]);
  });

  // ── Default status ────────────────────────────────────────────────────────

  it("defaults to status='success' when status prop omitted", () => {
    render(<ApplicationMessage {...baseProps} platform="web" />);
    expect(screen.getByTestId("icon-success")).toBeTruthy();
  });
});
