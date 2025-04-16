import { Card, Rate, Tag, Button, Typography, Space, Modal, DatePicker, message } from 'antd';
import { PlusOutlined, EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons';
import { useState } from 'react';
import moment from 'moment';
import { Destination } from '../models';
import { tienVietNam } from '@/utils/utils';

const { Meta } = Card;
const { Text } = Typography;

interface DestinationCardProps {
  destination: Destination;
  onAddToItinerary: (destination: Destination, date?: string) => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination, onAddToItinerary }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);

  const typeColorMap = {
    beach: 'blue',
    mountain: 'green',
    city: 'orange',
  };

  const typeTextMap = {
    beach: 'Biển',
    mountain: 'Núi',
    city: 'Thành phố',
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (selectedDate) {
      onAddToItinerary(destination, selectedDate.format('YYYY-MM-DD'));
      message.success(`Đã thêm ${destination.name} vào lịch trình ngày ${selectedDate.format('DD/MM/YYYY')}`);
      setIsModalVisible(false);
      setSelectedDate(null);
    } else {
      message.warning('Vui lòng chọn ngày cho lịch trình');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedDate(null);
  };

  const disabledDate = (current: moment.Moment) => {
    // Không cho phép chọn ngày trong quá khứ
    return current && current < moment().startOf('day');
  };

  return (
    <>
      <Card
        hoverable
        cover={
          <div style={{ height: 200, overflow: 'hidden' }}>
            <img
              alt={destination.name}
              src={destination.image}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        }
        actions={[
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showModal}
          >
            Thêm vào lịch trình
          </Button>
        ]}
      >
        <Meta
          title={destination.name}
          description={
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <div>
                <EnvironmentOutlined /> {destination.location}
              </div>
              <div>
                <Rate disabled defaultValue={destination.rating} allowHalf style={{ fontSize: 14 }} />
                <Text style={{ marginLeft: 8 }}>{destination.rating}</Text>
              </div>
              <div>
                <Tag color={typeColorMap[destination.type]}>{typeTextMap[destination.type]}</Tag>
                <Text type="secondary" style={{ marginLeft: 8 }}>
                  {tienVietNam(destination.price)}/người
                </Text>
              </div>
              <Text type="secondary" ellipsis={{ rows: 2 }}>
                {destination.description}
              </Text>
            </Space>
          }
        />
      </Card>

      <Modal
        title={<><CalendarOutlined /> Chọn ngày cho lịch trình</>}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Thêm vào lịch trình"
        cancelText="Hủy"
      >
        <div style={{ textAlign: 'center' }}>
          <p>Chọn ngày bạn muốn thêm <strong>{destination.name}</strong> vào lịch trình:</p>
          <DatePicker 
            style={{ width: '100%' }} 
            format="DD/MM/YYYY"
            onChange={(date) => setSelectedDate(date)}
            disabledDate={disabledDate}
            placeholder="Chọn ngày"
          />
        </div>
      </Modal>
    </>
  );
};

export default DestinationCard; 