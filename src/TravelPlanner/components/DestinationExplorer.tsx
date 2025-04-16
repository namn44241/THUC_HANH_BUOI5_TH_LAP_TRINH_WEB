import { useState, useEffect } from 'react';
import { Row, Col, Select, Slider, Input, Card, Typography, Space, Empty } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { Destination } from '../models';
import DestinationCard from './DestinationCard';
import { destinations } from '../models/destinationData';

const { Title } = Typography;
const { Option } = Select;

interface DestinationExplorerProps {
  onAddToItinerary: (destination: Destination, date?: string) => void;
}

const DestinationExplorer: React.FC<DestinationExplorerProps> = ({ onAddToItinerary }) => {
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>(destinations);
  const [searchText, setSearchText] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  useEffect(() => {
    filterDestinations();
  }, [searchText, selectedTypes, priceRange, ratingFilter]);

  const filterDestinations = () => {
    let filtered = [...destinations];

    // Lọc theo từ khóa tìm kiếm
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        dest => 
          dest.name.toLowerCase().includes(searchLower) || 
          dest.location.toLowerCase().includes(searchLower) ||
          dest.description.toLowerCase().includes(searchLower)
      );
    }

    // Lọc theo loại
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(dest => selectedTypes.includes(dest.type));
    }

    // Lọc theo khoảng giá
    filtered = filtered.filter(
      dest => dest.price >= priceRange[0] && dest.price <= priceRange[1]
    );

    // Lọc theo đánh giá
    if (ratingFilter !== null) {
      filtered = filtered.filter(dest => dest.rating >= ratingFilter);
    }

    setFilteredDestinations(filtered);
  };

  return (
    <Card>
      <Title level={3}>Khám phá điểm đến</Title>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Input
            placeholder="Tìm kiếm điểm đến..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </Col>
        
        <Col xs={24} md={6}>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Loại hình du lịch"
            value={selectedTypes}
            onChange={setSelectedTypes}
          >
            <Option value="beach">Biển</Option>
            <Option value="mountain">Núi</Option>
            <Option value="city">Thành phố</Option>
          </Select>
        </Col>
        
        <Col xs={24} md={5}>
          <Select
            style={{ width: '100%' }}
            placeholder="Đánh giá từ"
            allowClear
            onChange={value => setRatingFilter(value)}
          >
            <Option value={3}>3 sao trở lên</Option>
            <Option value={4}>4 sao trở lên</Option>
            <Option value={4.5}>4.5 sao trở lên</Option>
          </Select>
        </Col>
        
        <Col xs={24} md={5}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <span>Giá (VNĐ): {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}</span>
            <Slider
              range
              min={0}
              max={2000000}
              step={100000}
              value={priceRange}
              onChange={value => setPriceRange(value as [number, number])}
            />
          </Space>
        </Col>
      </Row>
      
      {filteredDestinations.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredDestinations.map(destination => (
            <Col xs={24} sm={12} md={8} lg={6} key={destination.id}>
              <DestinationCard 
                destination={destination} 
                onAddToItinerary={onAddToItinerary} 
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="Không tìm thấy điểm đến phù hợp" />
      )}
    </Card>
  );
};

export default DestinationExplorer; 