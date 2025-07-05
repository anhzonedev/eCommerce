// CustomForm.jsx
import React from "react";
import { Form, Input, Select, Upload } from "antd";
import CustomButton from "../Button/CustomButton";

const { Option } = Select;

const CustomForm = ({
  form,
  fields = [],
  layout = "vertical",
  initialValues = {},
  onFinish,
  columns = 1,
  submitText = "Submit",
  submitProps = {},
  buttons = [],
}) => {
  return (
    <div>
      <Form
        layout={layout}
        form={form}
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <div
          className={`grid gap-4`}
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          }}
        >
          {fields.map((field) => {
            const commonProps = {
              name: field.name,
              label: field.label,
              rules: field.rules || [],
            };

            let inputElement = null;

            switch (field.type) {
              case "input":
                inputElement = field.textarea ? (
                  <Input.TextArea
                    placeholder={field.placeholder}
                    rows={4}
                    {...field.inputProps}
                  />
                ) : (
                  <Input
                    placeholder={field.placeholder}
                    {...field.inputProps}
                  />
                );
                break;
              case "password":
                inputElement = (
                  <Input.Password
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
                      (option?.label ?? option?.children ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={field.options}
                  >
                    {field.children}
                  </Select>
                );
                break;
              case "upload":
                inputElement = (
                  <Upload
                    listType="picture-card"
                    fileList={field.fileList}
                    onChange={field.onChange}
                    beforeUpload={field.beforeUpload}
                    customRequest={field.customRequest}
                    accept={field.accept}
                    maxCount={field.maxCount}
                    multiple={field.multiple}
                  >
                    {field.fileList?.length >= (field.maxCount || 1)
                      ? null
                      : field.uploadButton}
                  </Upload>
                );
                break;
              case "custom":
                inputElement = field.render;
                break;
              default:
                inputElement = <Input />;
            }

            return (
              <div
                key={field.name}
                style={{
                  gridColumn: `span ${field.colSpan || 1} / span ${
                    field.colSpan || 1
                  }`,
                }}
              >
                <Form.Item {...commonProps}>{inputElement}</Form.Item>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <CustomButton type="primary" htmlType="submit" {...submitProps}>
            {submitText}
          </CustomButton>
        </div>
      </Form>
    </div>
  );
};

export default CustomForm;
