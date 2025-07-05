// CustomForm.jsx
import React from "react";
import { Form, Input, Select } from "antd";

const { Option } = Select;

const CustomForm = ({
  form,
  fields = [],
  layout = "vertical",
  initialValues = {},
  onFinish,
  columns = 1, // số cột của lưới
}) => {
  return (
    <div>
      <Form
        layout={layout}
        form={form}
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
          {fields.map((field) => {
            const commonProps = {
              name: field.name,
              label: field.label,
              rules: field.rules || [],
            };

            let inputElement = null;

            switch (field.type) {
              case "input":
                inputElement = (
                  <Input
                    placeholder={field.placeholder}
                    {...field.inputProps}
                  />
                );
                break;
              case "select":
                inputElement = (
                  <Select
                    showSearch
                    placeholder={field.placeholder}
                    onChange={field.onChange}
                    disabled={field.disabled}
                    filterOption={(input, option) =>
                      (option.label || option.children || "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={field.options}
                  >
                    {field.children}
                  </Select>
                );
                break;
              default:
                inputElement = <Input />;
            }

            return (
              <div
                key={field.name}
                className={`col-span-${field.colSpan || 1}`}
              >
                <Form.Item {...commonProps}>{inputElement}</Form.Item>
              </div>
            );
          })}
        </div>
      </Form>
    </div>
  );
};

export default CustomForm;