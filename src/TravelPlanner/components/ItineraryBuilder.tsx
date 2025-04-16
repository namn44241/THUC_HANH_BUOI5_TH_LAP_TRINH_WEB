import { useState, useEffect } from 'react';
import { 
  Card, Typography, Button, DatePicker, Input, List, 
  Collapse, Space, Tag, Empty, Divider, notification, 
  Row, Col, Tooltip, Modal
} from 'antd';
import { 
  PlusOutlined, DeleteOutlined, EditOutlined, 
  SaveOutlined, CalendarOutlined, DollarOutlined,
  ClockCircleOutlined, EnvironmentOutlined
} from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import moment from 'moment';
import { Destination, Itinerary, ItineraryDay } from '../models';
import { tienVietNam } from '@/utils/utils';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;

interface ItineraryBuilderProps {
  selectedDestinations: Destination[];
  onRemoveDestination: (dayId: string, destinationId: string) => void;
  onUpdateBudget: (expenses: Record<string, number>) => void;
}

const ItineraryBuilder: React.FC<ItineraryBuilderProps> = ({ 
  selectedDestinations, 
  onRemoveDestination,
  onUpdateBudget
}) => {
  const [itinerary, setItinerary] = useState<Itinerary>({
    id: '1',
    name: 'Chuyến đi mới',
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().add(3, 'days').format('YYYY-MM-DD'),
    days: [],
    budget: 0,
    expenses: {
      accommodation: 0,
      food: 0,
      transportation: 0,
      activities: 0,
      other: 0
    }
  });
  
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(itinerary.name);

  // Tạo các ngày trong lịch trình dựa trên ngày bắt đầu và kết thúc
  useEffect(() => {
    const start = moment(itinerary.startDate);
    const end = moment(itinerary.endDate);
    const dayCount = end.diff(start, 'days') + 1;
    
    if (dayCount > 0) {
      const newDays: ItineraryDay[] = [];
      
      for (let i = 0; i < dayCount; i++) {
        const currentDate = moment(start).add(i, 'days');
        const existingDay = itinerary.days.find(d => d.day === i + 1);
        
        newDays.push({
          id: existingDay?.id || `day-${i + 1}`,
          day: i + 1,
          date: currentDate.format('YYYY-MM-DD'),
          destinations: existingDay?.destinations || [],
          notes: existingDay?.notes || ''
        });
      }
      
      setItinerary(prev => ({
        ...prev,
        days: newDays
      }));
    }
  }, [itinerary.startDate, itinerary.endDate]);

  // Thêm điểm đến vào ngày đầu tiên khi có điểm đến mới được chọn
  useEffect(() => {
    if (selectedDestinations.length > 0 && itinerary.days.length > 0) {
      const allDestinationsInItinerary = itinerary.days.flatMap(day => day.destinations);
      const newDestinations = selectedDestinations.filter(
        dest => !allDestinationsInItinerary.some(d => d.id === dest.id)
      );
      
      if (newDestinations.length > 0) {
        const updatedDays = [...itinerary.days];
        updatedDays[0] = {
          ...updatedDays[0],
          destinations: [...updatedDays[0].destinations, ...newDestinations]
        };
        
        setItinerary(prev => ({
          ...prev,
          days: updatedDays
        }));
        
        // Cập nhật chi phí
        calculateExpenses(updatedDays);
      }
    }
  }, [selectedDestinations]);

  // Tính toán chi phí
  const calculateExpenses = (days: ItineraryDay[]) => {
    const allDestinations = days.flatMap(day => day.destinations);
    const totalPrice = allDestinations.reduce((sum, dest) => sum + dest.price, 0);
    
    // Phân bổ chi phí theo các hạng mục
    const expenses = {
      accommodation: Math.round(totalPrice * 0.4),
      food: Math.round(totalPrice * 0.25),
      transportation: Math.round(totalPrice * 0.2),
      activities: Math.round(totalPrice * 0.1),
      other: Math.round(totalPrice * 0.05)
    };
    
    setItinerary(prev => ({
      ...prev,
      budget: totalPrice,
      expenses
    }));
    
    onUpdateBudget(expenses);
  };

  // Xử lý kéo thả điểm đến giữa các ngày
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    const sourceDay = source.droppableId;
    const destDay = destination.droppableId;
    
    if (sourceDay === destDay) {
      // Di chuyển trong cùng một ngày
      const dayIndex = itinerary.days.findIndex(day => day.id === sourceDay);
      const newDestinations = [...itinerary.days[dayIndex].destinations];
      const [moved] = newDestinations.splice(source.index, 1);
      newDestinations.splice(destination.index, 0, moved);
      
      const newDays = [...itinerary.days];
      newDays[dayIndex] = {
        ...newDays[dayIndex],
        destinations: newDestinations
      };
      
      setItinerary(prev => ({
        ...prev,
        days: newDays
      }));
    } else {
      // Di chuyển giữa các ngày khác nhau
      const sourceDayIndex = itinerary.days.findIndex(day => day.id === sourceDay);
      const destDayIndex = itinerary.days.findIndex(day => day.id === destDay);
      
      const newDays = [...itinerary.days];
      const [moved] = newDays[sourceDayIndex].destinations.splice(source.index, 1);
      newDays[destDayIndex].destinations.splice(destination.index, 0, moved);
      
      setItinerary(prev => ({
        ...prev,
        days: newDays
      }));
    }
  };

  // Xóa điểm đến khỏi lịch trình
  const handleRemoveDestination = (dayId: string, destinationId: string) => {
    const dayIndex = itinerary.days.findIndex(day => day.id === dayId);
    if (dayIndex === -1) return;
    
    const newDays = [...itinerary.days];
    newDays[dayIndex] = {
      ...newDays[dayIndex],
      destinations: newDays[dayIndex].destinations.filter(dest => dest.id !== destinationId)
    };
    
    setItinerary(prev => ({
      ...prev,
      days: newDays
    }));
    
    calculateExpenses(newDays);
    onRemoveDestination(dayId, destinationId);
  };

  // Cập nhật ghi chú cho ngày
  const handleUpdateNotes = (dayId: string, notes: string) => {
    const dayIndex = itinerary.days.findIndex(day => day.id === dayId);
    if (dayIndex === -1) return;
    
    const newDays = [...itinerary.days];
    newDays[dayIndex] = {
      ...newDays[dayIndex],
      notes
    };
    
    setItinerary(prev => ({
      ...prev,
      days: newDays
    }));
  };

  // Tính tổng thời gian tham quan trong ngày
  const calculateDayDuration = (destinations: Destination[]) => {
    return destinations.reduce((sum, dest) => sum + dest.duration, 0);
  };

  // Hiển thị cảnh báo nếu thời gian tham quan trong ngày quá dài
  useEffect(() => {
    itinerary.days.forEach(day => {
      const duration = calculateDayDuration(day.destinations);
      if (duration > 10) {
        notification.warning({
          message: `Cảnh báo: Ngày ${day.day} quá tải`,
          description: `Tổng thời gian tham quan là ${duration} giờ, có thể quá nhiều cho một ngày.`,
          duration: 5,
        });
      }
    });
  }, [itinerary.days]);

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editingName ? (
            <Input
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              onBlur={() => {
                setItinerary(prev => ({ ...prev, name: tempName }));
                setEditingName(false);
              }}
              onPressEnter={() => {
                setItinerary(prev => ({ ...prev, name: tempName }));
                setEditingName(false);
              }}
              style={{ width: 300 }}
            />
          ) : (
            <Title level={3} onClick={() => {
              setEditingName(true);
              setTempName(itinerary.name);
            }} style={{ cursor: 'pointer' }}>
              {itinerary.name} <EditOutlined style={{ fontSize: 16 }} />
            </Title>
          )}
          
          <Space>
            <Text>Tổng chi phí: </Text>
            <Text strong type="danger">{tienVietNam(itinerary.budget)}</Text>
          </Space>
        </div>
        
        <Row gutter={16}>
          <Col span={24}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text>Chọn ngày đi:</Text>
              <MyDateRangePicker
                value={[itinerary.startDate, itinerary.endDate]}
                onChange={(dates) => {
                  if (dates) {
                    setItinerary(prev => ({
                      ...prev,
                      startDate: dates[0],
                      endDate: dates[1]
                    }));
                  }
                }}
                disabledDate={(current) => {
                  return current && current < moment().startOf('day');
                }}
              />
            </Space>
          </Col>
        </Row>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          {itinerary.days.length > 0 ? (
            <Collapse defaultActiveKey={['day-1']}>
              {itinerary.days.map((day) => (
                <Panel
                  key={day.id}
                  header={
                    <Space>
                      <CalendarOutlined />
                      <span>Ngày {day.day}: {moment(day.date).format('DD/MM/YYYY')}</span>
                      <Tag color={calculateDayDuration(day.destinations) > 10 ? 'red' : 'green'}>
                        <ClockCircleOutlined /> {calculateDayDuration(day.destinations)} giờ
                      </Tag>
                    </Space>
                  }
                >
                  <Droppable droppableId={day.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{ minHeight: 50 }}
                      >
                        {day.destinations.length > 0 ? (
                          <List
                            itemLayout="horizontal"
                            dataSource={day.destinations}
                            renderItem={(destination, index) => (
                              <Draggable
                                key={destination.id}
                                draggableId={destination.id}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <List.Item
                                      actions={[
                                        <Button
                                          type="text"
                                          danger
                                          icon={<DeleteOutlined />}
                                          onClick={() => handleRemoveDestination(day.id, destination.id)}
                                        />
                                      ]}
                                    >
                                      <List.Item.Meta
                                        avatar={
                                          <img 
                                            src={destination.image} 
                                            alt={destination.name} 
                                            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                                          />
                                        }
                                        title={destination.name}
                                        description={
                                          <Space direction="vertical">
                                            <Space>
                                              <EnvironmentOutlined /> {destination.location}
                                              <Divider type="vertical" />
                                              <ClockCircleOutlined /> {destination.duration} giờ
                                              <Divider type="vertical" />
                                              <DollarOutlined /> {tienVietNam(destination.price)}/người
                                            </Space>
                                          </Space>
                                        }
                                      />
                                    </List.Item>
                                  </div>
                                )}
                              </Draggable>
                            )}
                          />
                        ) : (
                          <Empty description="Chưa có điểm đến nào trong ngày này" />
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  
                  <Divider />
                  
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text strong>Ghi chú:</Text>
                    <TextArea
                      value={day.notes}
                      onChange={(e) => handleUpdateNotes(day.id, e.target.value)}
                      placeholder="Thêm ghi chú cho ngày này..."
                      autoSize={{ minRows: 2, maxRows: 6 }}
                    />
                  </Space>
                </Panel>
              ))}
            </Collapse>
          ) : (
            <Empty description="Chưa có ngày nào trong lịch trình" />
          )}
        </DragDropContext>
      </Space>
    </Card>
  );
};

export default ItineraryBuilder;