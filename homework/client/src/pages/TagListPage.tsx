import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Tag,
  Popconfirm,
  Row,
  Col,
  Space,
} from "antd";
import axios from "axios";

const { useForm } = Form;

const TagListPage: React.FC = () => {
  const [tags, setTags] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // 新增或编辑的状态
  const [form] = useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTags = async () => {
    try {
      const response = await axios.get("/api/tags");
      setTags(response.data.data);
      //setSelectedRowKeys(response.data.data.map(tag => tag.id));
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      console.log("Form values:", values); 
      let response;
      if (isEditing) {
        if (!values.id) {
          message.error("id不能为空1");
          return;
        }
        response = await axios.put(`/api/tags/${values.id}`, {
          name: values.tagName,
          id: values.id,
        });
      } else {
        response = await axios.post("/api/tags", { name: values.tagName });
      }
      message.success(response.data.msg);
      form.resetFields();
      setIsModalVisible(false);
      fetchTags();
    } catch (error) {
      console.error("Error adding/editing tag:", error);
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.msg || "Failed to add/edit tag");
      } else {
        message.error("Failed to add/edit tag");
      }
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const handleBatchDelete = async () => {
    setLoading(true);
    const stringIds = selectedRowKeys.map((key) => key.toString());
    try {
      for (const id of stringIds) {
        await handleDelete(id);
      }
    } catch (error) {
      console.error("批量删除标签时出错:", error);
      message.error("删除标签失败");
    } finally {
      setSelectedRowKeys([]);
      setLoading(false);
      fetchTags();
    }
  };

  const handleEdit = (tagId: string) => {
    const tagToEdit = tags.find((tag) => tag.id === tagId);
    if (!tagToEdit) {
      message.error("Tag not found");
      return;
    }
    form.setFieldsValue({
      id: tagToEdit.id,
      tagName: tagToEdit.name,
    });
    setIsEditing(true);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete("/api/tags", { params: { id } });
      message.success(response.data.msg);
      fetchTags();
    } catch (error) {
      console.error("Error deleting tag:", error);
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.msg || "Failed to delete tag");
      } else {
        message.error("Failed to delete tag");
      }
    }
  };

  const getTagColor = (tagName: string) => {
    return tagName.length > 5 ? "geekblue" : "green";
  };

  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <Tag color={getTagColor(name)}>{name.toUpperCase()}</Tag>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: any) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record.id)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Row justify="end">
        <Space>
          <Col>
            <Button
              type="primary"
              onClick={() => {
                form.resetFields();
                setIsEditing(false);
                setIsModalVisible(true);
              }}
            >
              +添加标签
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              danger
              onClick={handleBatchDelete}
              disabled={!hasSelected}
              loading={loading}
            >
              -确认删除
            </Button>
          </Col>
        </Space>
      </Row>
      <div>
        <div style={{ marginBottom: 16 }}></div>
        <Table
          dataSource={tags}
          columns={columns}
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
          }}
        />
      </div>

      <Modal
        title={isEditing ? "编辑标签" : "添加标签"}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form}>
          {isEditing && (
            <Form.Item name="id" style={{ display: "none" }}>
              <Input type="hidden" />
            </Form.Item>
          )}
          <Form.Item
            name="tagName"
            label="名称"
            rules={[
              { required: true, message: "请输入名称" },
              { max: 10, message: "名称不能超过10个字符" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TagListPage;
