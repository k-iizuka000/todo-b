import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
  Popconfirm,
} from 'antd';
import axios from 'axios';
import { UserOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // ユーザー一覧を取得
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      message.error('ユーザー情報の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ユーザー情報を更新
  const handleUpdateUser = async (values: any) => {
    try {
      if (!selectedUser) return;
      await axios.put(`/api/admin/users/${selectedUser.id}`, values);
      message.success('ユーザー情報を更新しました');
      setEditModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error('ユーザー情報の更新に失敗しました');
    }
  };

  // ユーザーを削除
  const handleDeleteUser = async (userId: string) => {
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      message.success('ユーザーを削除しました');
      fetchUsers();
    } catch (error) {
      message.error('ユーザーの削除に失敗しました');
    }
  };

  const columns = [
    {
      title: 'ユーザー名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'メールアドレス',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '権限',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'ステータス',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '登録日',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedUser(record);
              form.setFieldsValue(record);
              setEditModalVisible(true);
            }}
          >
            編集
          </Button>
          <Popconfirm
            title="このユーザーを削除しますか？"
            onConfirm={() => handleDeleteUser(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger>
              削除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>ユーザー管理</h1>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title="ユーザー情報の編集"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          onFinish={handleUpdateUser}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="ユーザー名"
            rules={[{ required: true }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="role"
            label="権限"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="user">一般ユーザー</Select.Option>
              <Select.Option value="admin">管理者</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="ステータス"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="active">有効</Select.Option>
              <Select.Option value="suspended">一時停止</Select.Option>
              <Select.Option value="banned">永久停止</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;