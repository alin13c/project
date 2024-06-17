import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Select } from "antd";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const { Option } = Select;

const DataAddEditPage: React.FC = () => {
  const [formData, setFormData] = useState<any>({});
  const [tags, setTags] = useState<string[]>([]); 
  const { id }: { id?: string } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/tags")
      .then((response) => {
        setTags(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tags:", error);
        message.error("Failed to load tags");
      });

    if (id) {
      axios
        .get(`/api/data/${id}`)
        .then((response) => {
          const data = response.data;
          setFormData(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          message.error("Failed to load data");
        });
    }
  }, [id]);

  const onFinish = (values: any) => {
    if (id) {
      // 发送 PUT 请求更新数据
      axios
        .put(`/api/data/${id}`, values)
        .then(() => {
          message.success("Data updated successfully");
          navigate("/data");
        })
        .catch((error) => {
          console.error("Error updating data:", error);
          message.error("Failed to update data");
        });
    } else {
      // 发送 POST 请求添加新数据
      axios
        .post("/api/data", values)
        .then(() => {
          message.success("Data added successfully");
          navigate("/data");
        })
        .catch((error) => {
          console.error("Error adding data:", error);
          message.error("Failed to add data");
        });
    }
  };

  return (
    <div>
      <h1>{id ? "Edit" : "Add"} Data</h1>
      <Form layout="vertical" onFinish={onFinish} initialValues={formData}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input the name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Tags" name="tags">
          <Select mode="multiple" placeholder="Select tags">
            {Array.isArray(tags) &&
              tags.map((tag) => (
                <Option key={tag} value={tag}>
                  {tag}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button style={{ marginLeft: 8 }}>
            <Link to="/data">Cancel</Link>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DataAddEditPage;
