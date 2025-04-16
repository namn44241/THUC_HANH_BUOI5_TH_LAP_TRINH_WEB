import { useState, useEffect } from 'react';
import { Card, Typography, Progress, Space, Row, Col, InputNumber, Button, notification } from 'antd';
import { SaveOutlined, WarningOutlined } from '@ant-design/icons';
import { Budget, BudgetCategory, defaultBudgetCategories } from '../models';
import { tienVietNam } from '@/utils/utils';
import DonutChart from '@/components/Chart/DonutChart';

const { Title, Text } = Typography;

interface BudgetManagerProps {
  expenses: Record<string, number>;
}

const BudgetManager: React.FC<BudgetManagerProps> = ({ expenses }) => {
  const [budget, setBudget] = useState<Budget>({
    total: 0,
    spent: 0,
    categories: defaultBudgetCategories,
  });
  
  const [customBudget, setCustomBudget] = useState<number | null>(null);
  
  // Cập nhật chi phí khi expenses thay đổi
  useEffect(() => {
    const totalExpense = Object.values(expenses).reduce((sum, value) => sum + value, 0);
    
    const updatedCategories: BudgetCategory[] = [
      { name: 'Lưu trú', amount: expenses.accommodation || 0, color: '#1890ff' },
      { name: 'Ăn uống', amount: expenses.food || 0, color: '#52c41a' },
      { name: 'Di chuyển', amount: expenses.transportation || 0, color: '#faad14' },
      { name: 'Hoạt động', amount: expenses.activities || 0, color: '#722ed1' },
      { name: 'Khác', amount: expenses.other || 0, color: '#f5222d' },
    ];
    
    setBudget(prev => ({
      ...prev,
      spent: totalExpense,
      categories: updatedCategories,
    }));
    
    // Nếu chưa đặt ngân sách tùy chỉnh, sử dụng tổng chi phí
    if (customBudget === null) {
      setBudget(prev => ({
        ...prev,
        total: totalExpense,
      }));
    }
    
    // Kiểm tra vượt ngân sách
    if (customBudget !== null && totalExpense > customBudget) {
      notification.warning({
        message: 'Cảnh báo vượt ngân sách',
        description: `Chi phí hiện tại (${tienVietNam(totalExpense)}) đã vượt quá ngân sách đã đặt (${tienVietNam(customBudget)})`,
        icon: <WarningOutlined style={{ color: '#ff4d4f' }} />,
        duration: 4,
      });
    }
  }, [expenses, customBudget]);
  
  // Lưu ngân sách tùy chỉnh
  const handleSaveBudget = () => {
    if (customBudget !== null) {
      setBudget(prev => ({
        ...prev,
        total: customBudget,
      }));
      
      notification.success({
        message: 'Đã cập nhật ngân sách',
        description: `Ngân sách đã được đặt thành ${tienVietNam(customBudget)}`,
        duration: 3,
      });
    }
  };
  
  // Dữ liệu cho biểu đồ
  const chartData = {
    xAxis: budget.categories.map(cat => cat.name),
    yAxis: [budget.categories.map(cat => cat.amount)],
    colors: budget.categories.map(cat => cat.color),
    showTotal: true,
  };
  
  // Tính phần trăm sử dụng ngân sách
  const budgetPercentage = budget.total > 0 ? Math.round((budget.spent / budget.total) * 100) : 0;
  
  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={3}>Quản lý ngân sách</Title>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Đặt ngân sách của bạn:</Text>
              <Space>
                <InputNumber
                  style={{ width: 200 }}
                  value={customBudget === null ? budget.total : customBudget}
                  onChange={value => setCustomBudget(value)}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                  step={100000}
                  min={0}
                />
                <Button 
                  type="primary" 
                  icon={<SaveOutlined />} 
                  onClick={handleSaveBudget}
                >
                  Lưu
                </Button>
              </Space>
              
              <div style={{ marginTop: 16 }}>
                <Text>Sử dụng ngân sách:</Text>
                <Progress 
                  percent={budgetPercentage} 
                  status={budgetPercentage > 100 ? 'exception' : 'normal'}
                  format={percent => `${percent}%`}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>{tienVietNam(budget.spent)}</Text>
                  <Text>{tienVietNam(budget.total)}</Text>
                </div>
              </div>
              
              <div style={{ marginTop: 16 }}>
                <Text strong>Chi tiết chi phí:</Text>
                {budget.categories.map((category, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                    <Space>
                      <div 
                        style={{ 
                          width: 12, 
                          height: 12, 
                          backgroundColor: category.color, 
                          borderRadius: '50%' 
                        }} 
                      />
                      <Text>{category.name}</Text>
                    </Space>
                    <Text>{tienVietNam(category.amount)}</Text>
                  </div>
                ))}
              </div>
            </Space>
          </Col>
          
          <Col xs={24} md={12}>
            <DonutChart {...chartData} height={300} />
          </Col>
        </Row>
      </Space>
    </Card>
  );
};

export default BudgetManager; 