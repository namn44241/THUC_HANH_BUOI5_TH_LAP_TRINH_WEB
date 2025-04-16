import React, { useState, useEffect } from 'react';
import { Button, Input, Form, Table, Modal, Upload, message } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { Destination } from '../../models/destination';
import { destinations as destinationData } from '../../models/destinationData';

const DestinationManagement: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentDestination, setCurrentDestination] = useState<Destination | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [form] = Form.useForm();

  // Fetch destinations from imported data (instead of API call)
  useEffect(() => {
    setDestinations(destinationData);
  }, []);

  // Handle Add/Edit Destination
  const handleSaveDestination = (values: any) => {
    if (currentDestination) {
      // Edit destination
      setDestinations(destinations.map(dest => 
        dest.id === currentDestination.id ? { ...currentDestination, ...values, image: imageUrl } : dest
      ));
    } else {
      // Add new destination
      const newDestination: Destination = {
        id: Math.random().toString(36).substring(7), // Random id for now
        name: values.name,
        location: values.location,
        description: values.description,
        image: imageUrl || '',
        rating: values.rating,
        price: values.price,
        type: values.type,
        activities: values.activities,
        duration: values.duration,
      };
      setDestinations([...destinations, newDestination]);
    }

    resetFormAndClose();
    message.success('Điểm đến đã được lưu thành công!');
  };

  // Reset form and close modal
  const resetFormAndClose = () => {
    setIsModalVisible(false);
    setCurrentDestination(null);
    setImageUrl('');
    form.resetFields();
  };

  // Open modal for adding new destination
  const handleAddDestination = () => {
    console.log("Add button clicked"); // Thêm log để debug
    setCurrentDestination(null);
    setImageUrl('');
    form.resetFields();
    setIsModalVisible(true);
  };

  // Handle Edit
  const handleEditDestination = (destination: Destination) => {
    setCurrentDestination(destination);
    setImageUrl(destination.image);
    form.setFieldsValue(destination);
    setIsModalVisible(true);
  };

  // Handle Delete
  const handleDeleteDestination = (id: string) => {
    setDestinations(destinations.filter(destination => destination.id !== id));
    message.success('Điểm đến đã được xóa!');
  };

  // Handle Upload Image
  const handleImageUpload = (info: any) => {
    if (info.file) {
      const isValid = info.file.type?.startsWith('image/');
      if (!isValid) {
        message.error('Chỉ được phép tải lên hình ảnh');
        return false;
      }

      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(info.file);
    }
    return false;
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Vị trí',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toLocaleString()} VND`,
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Destination) => (
        <span>
          <Button onClick={() => handleEditDestination(record)} style={{ marginRight: 10 }}>
            Sửa
          </Button>
          <Button onClick={() => handleDeleteDestination(record.id)} danger>
            Xóa
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div className="destination-management">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Quản lý điểm đến</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddDestination}
          style={{ zIndex: 10 }}
        >
          Thêm điểm đến
        </Button>
      </div>
      
      <Table 
        dataSource={destinations} 
        columns={columns} 
        rowKey="id" 
        pagination={{ pageSize: 10 }}
      />

      {/* Modal for Add/Edit Destination */}
      <Modal
        title={currentDestination ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến'}
        visible={isModalVisible}
        onCancel={resetFormAndClose}
        maskClosable={false}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveDestination}
        >
          <Form.Item label="Tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên điểm đến!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Vị trí" name="location" rules={[{ required: true, message: 'Vui lòng nhập vị trí!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Đánh giá" name="rating" rules={[{ required: true, message: 'Vui lòng nhập đánh giá!' }]}>
            <Input type="number" min={0} max={5} step={0.1} />
          </Form.Item>
          <Form.Item label="Giá" name="price" rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}>
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item label="Loại" name="type" rules={[{ required: true, message: 'Vui lòng chọn loại điểm đến!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Hoạt động" name="activities">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="Thời gian (giờ)" name="duration" rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}>
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item label="Hình ảnh">
            <Upload
              beforeUpload={handleImageUpload}
              maxCount={1}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
            </Upload>
            {imageUrl && (
              <div style={{ marginTop: 10 }}>
                <img src={imageUrl} alt="Hình ảnh điểm đến" style={{ maxWidth: '100%', maxHeight: 200 }} />
              </div>
            )}
          </Form.Item>
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button onClick={resetFormAndClose}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {currentDestination ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DestinationManagement;