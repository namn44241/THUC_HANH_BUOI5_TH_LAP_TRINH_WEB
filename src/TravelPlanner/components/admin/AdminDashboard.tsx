import React from 'react';
import { Layout, Row, Col, Card, Divider } from 'antd';
import DestinationManagement from './DestinationManager';
import Statistics from './Statistics';

const { Content } = Layout;

const AdminDashboard: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '20px' }}>
        <Row gutter={[16, 16]}>
          {/* Destination Management Section */}
          <Col span={24}>
            <Card title="Quản lý điểm đến" bordered={false}>
              <DestinationManagement />
            </Card>
          </Col>

          {/* Statistics Section */}
          <Col span={24}>
            <Card title="Thống kê" bordered={false}>
              <Statistics />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default AdminDashboard;
