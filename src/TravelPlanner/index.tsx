import { useState } from 'react';
import { Layout, Typography, Tabs, Row, Col } from 'antd';
import { CompassOutlined, CalendarOutlined, WalletOutlined } from '@ant-design/icons';
import DestinationExplorer from './components/DestinationExplorer';
import ItineraryBuilder from './components/ItineraryBuilder';
import BudgetManager from './components/BudgetManager';
import { Destination } from './models';
import './style.less';

const { Title } = Typography;
const { TabPane } = Tabs;

const TravelPlanner = () => {
  const [selectedDestinations, setSelectedDestinations] = useState<Destination[]>([]);
  const [expenses, setExpenses] = useState<Record<string, number>>({
    accommodation: 0,
    food: 0,
    transportation: 0,
    activities: 0,
    other: 0
  });
  const [activeTab, setActiveTab] = useState('explore');
  
  const handleAddToItinerary = (destination: Destination, date?: string) => {
    setSelectedDestinations(prev => {
      if (prev.some(d => d.id === destination.id)) {
        return prev;
      }
      return [...prev, destination];
    });
    
    // Nếu có chọn ngày, chuyển sang tab lịch trình
    if (date) {
      setActiveTab('itinerary');
    }
  };
  
  const handleRemoveDestination = (dayId: string, destinationId: string) => {
    // Chỉ cần xử lý trong ItineraryBuilder
  };
  
  const handleUpdateBudget = (newExpenses: Record<string, number>) => {
    setExpenses(newExpenses);
  };
  
  return (
    <Layout className="travel-planner">
      <div className="travel-planner-header">
        <Title level={2}>Lập kế hoạch du lịch</Title>
        <p>Khám phá, lên lịch trình và quản lý ngân sách cho chuyến đi của bạn</p>
      </div>
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        size="large"
      >
        <TabPane 
          tab={<span><CompassOutlined /> Khám phá điểm đến</span>} 
          key="explore"
        >
          <DestinationExplorer onAddToItinerary={handleAddToItinerary} />
        </TabPane>
        
        <TabPane 
          tab={<span><CalendarOutlined /> Lịch trình</span>} 
          key="itinerary"
        >
          <ItineraryBuilder 
            selectedDestinations={selectedDestinations}
            onRemoveDestination={handleRemoveDestination}
            onUpdateBudget={handleUpdateBudget}
          />
        </TabPane>
        
        <TabPane 
          tab={<span><WalletOutlined /> Ngân sách</span>} 
          key="budget"
        >
          <BudgetManager expenses={expenses} />
        </TabPane>
      </Tabs>
    </Layout>
  );
};

export default TravelPlanner; 