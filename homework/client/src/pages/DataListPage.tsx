import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Tag,
  Pagination,
  Popconfirm,
  message,
  Form,
  Input,
  Modal,
  Select,
  Tooltip,
  Row,
  Col,
  DatePicker,
} from "antd";
import { UndoOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";

interface DataItem {
  id: string;
  name: string;
  description: string;
  tags: string[];
  time: number;
  createdAt: string;
  index?: number; // 添加index属性用于存储编号
}

const DataListPage: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [tags, setTags] = useState<string[]>([]);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<DataItem | null>(null);

  const [searchName, setSearchName] = useState("");
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [searchStartDate, setSearchStartDate] = useState<Date | null>(null);
  const [searchEndDate, setSearchEndDate] = useState<Date | null>(null);

  const handleSearchNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value);
  };
  const handleSearchTagsChange = (value: string[]) => {
    setSearchTags(value);
  };
  const handleSearchStartDateChange = (date: Date | null) => {
    setSearchStartDate(date);
  };
  const handleSearchEndDateChange = (date: Date | null) => {
    setSearchEndDate(date);
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get("/api/tags");
      const tagsData = response.data.data || [];
      setTags(tagsData.map((tag: { name: string }) => tag.name));
      setTagIds(tagsData.map((tag: { id: string }) => tag.id)); // 存储标签的ID
    } catch (error) {
      console.error("Error fetching tags:", error);
      setTags([]); // 遇到错误时设置为空数组
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchData = useCallback(
    async (current: number, pageSize: number) => {
      setLoading(true);
      try {
        const params = {
          pageNo: current,
          pageSize: pageSize,
          ...(searchName && { name: searchName }),
          ...(searchTags.length > 0 && { tags: searchTags.join(",") }),
          ...(searchStartDate && { startDate: searchStartDate.toISOString() }),
          ...(searchEndDate && { endDate: searchEndDate.toISOString() }),
        };
        const response = await axios.get("/api/data", {
          params: { pageNo: current, pageSize: pageSize },
        });
        const { dataInfo, pageInfo } = response.data.data || {
          dataInfo: [],
          pageInfo: {},
        };
        // Convert time to readable date string and calculate index
        const formattedData = dataInfo.map((item: DataItem, index: number) => ({
          ...item,
          createdAt: new Date(item.time).toLocaleString(),
          index: (current - 1) * pageSize + index + 1, // 计算编号
        }));

        setDataSource(formattedData);
        setPagination((prev) => ({ ...prev, total: pageInfo.total || 0 }));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setDataSource([]); // 遇到错误时设置为空数组
        setLoading(false);
      }
    },
    [searchName, searchTags, searchStartDate, searchEndDate]
  );

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [fetchData, pagination.current, pagination.pageSize]);

  const handleEdit = (record: DataItem) => {
    setEditingItemId(record.id); // 设置正在编辑的数据项的ID
    setEditingItem(record); // 设置正在编辑的数据项
    setIsModalVisible(true); // 打开编辑对话框
    form.setFieldsValue({
      // 设置表单字段的初始值为正在编辑的数据项的值
      name: record.name,
      description: record.description,
      tags: record.tags,
    });
  };

  const handleSubmit = async (values: any) => {
    const { name, description, tags } = values;
    try {
      if (editingItemId) {
        // 编辑操作
        await axios.put(`/api/data/${editingItemId}`, {
          id: editingItemId,
          name,
          description,
          tags,
        }); 
        message.success("数据更新成功");
      } else {
        // 添加操作
        await axios.post("/api/data", { name, description, tags });
        message.success("数据添加成功");
      }
      form.resetFields();
      fetchData(pagination.current, pagination.pageSize);
      setIsModalVisible(false);
    } catch (error: any) {
      console.error("错误:", error);
      const errorMessage = error.response?.data?.message || "保存数据失败";
      message.error(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await axios.delete(`/api/data`, { params: { id } });
      setDataSource((prevDataSource) =>
        prevDataSource.filter((item) => item.id !== id)
      );
      setLoading(false);
      message.success("Data deleted successfully");
    } catch (error) {
      console.error("Error deleting data:", error);
      setLoading(false);
      message.error("Failed to delete data");
    }
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize || prev.pageSize,
    }));
    fetchData(page, pageSize || pagination.pageSize);
  };


  const search = () => {
    setIsModalVisible(false);
    fetchData(1, pagination.pageSize);
  };

  const columns = [
    { title: "编号", dataIndex: "index", key: "index" },
    { title: "名称", dataIndex: "name", key: "name" },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text?.length > 30 ? `${text.slice(0, 30)}...` : text}</span>
        </Tooltip>
      ),
    },
    { title: "创建时间", dataIndex: "createdAt", key: "createdAt" },
    {
      title: "标签",
      key: "tags",
      dataIndex: "tags",
      render: (tags: string[] = []) => (
        <>
          {tags &&
            tags.length > 0 &&
            tags.map((tag) => {
              let color = tag.length > 5 ? "geekblue" : "green";
              if (tag === "loser") {
                color = "volcano";
              }
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
        </>
      ),
    },

    {
      title: "操作",
      key: "action",
      render: (_: any, record: DataItem) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record)}>
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
      <div style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Input
              placeholder="输入名称搜索"
              value={searchName}
              onChange={handleSearchNameChange}
              style={{ width: 300 }}
            />
          </Col>
          <Col span={6}>
            <Select
              mode="tags"
              style={{
                width: 300,
              }}
              placeholder="Select tags"
            >
              {tags.map((tag, index) => (
                <Select.Option key={tagIds[index]} value={tagIds[index]}>
                  {tag}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <DatePicker
              placeholder="开始日期"
              onChange={handleSearchStartDateChange}
              value={searchStartDate}
            />
            <DatePicker
              placeholder="结束日期"
              onChange={handleSearchEndDateChange}
              value={searchEndDate}
              style={{ marginLeft: 8 }}
            />
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={() => search()}>
              <SearchOutlined />
              搜索
            </Button>
            <Button
              type="primary"
              style={{
                backgroundColor: "white",
                borderColor: "white",
                color: "black",
              }}
              onClick={() => setIsModalVisible(true)}
            >
              <UndoOutlined />
              重置
            </Button>
          </Col>
        </Row>
      </div>
      <Row justify="end">
        <Col>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            +添加数据
          </Button>
        </Col>
      </Row>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
      <Pagination
        style={{ marginTop: 16 }}
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={handlePageChange}
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `共 ${total} 条数据`}
      />
      <Modal
        title={editingItemId ? "编辑数据" : "添加数据"}
        visible={isModalVisible}
        onCancel={() => {
          setEditingItemId(null);
          setIsModalVisible(false);
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: "请输入名称!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="描述"
            name="description"
            rules={[{ required: true, message: "请输入描述!" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="标签"
            name="tags"
            rules={[{ required: true, message: "请选择标签!" }]}
          >
            <Select
              mode="tags"
              style={{
                width: "100%",
              }}
              placeholder="Select tags"
            >
              {tags.map((tag, index) => (
                <Select.Option key={tagIds[index]} value={tagIds[index]}>
                  {tag}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataListPage;
