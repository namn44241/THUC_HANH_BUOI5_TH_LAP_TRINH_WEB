import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Divider } from 'antd';
import { destinations as destinationData } from '../../models/destinationData';
import { Itinerary } from '../../models/itinerary';

interface StatisticData {
  month: string;
  itineraryCount: number;
}

interface DestinationStat {
  name: string;
  count: number;
  type: string;
}

interface ExpenseStat {
  category: string;
  amount: number;
  percentage: number;
}

const Statistics: React.FC = () => {
  const [itineraryStats, setItineraryStats] = useState<StatisticData[]>([]);
  const [popularDestinations, setPopularDestinations] = useState<DestinationStat[]>([]);
  const [expenseStats, setExpenseStats] = useState<ExpenseStat[]>([]);
  const [totalDestinations, setTotalDestinations] = useState<number>(0);
  const [totalItineraries, setTotalItineraries] = useState<number>(0);
  const [averageDuration, setAverageDuration] = useState<number>(0);
  const [averageBudget, setAverageBudget] = useState<number>(0);

  useEffect(() => {
    // Sample itineraries data (in a real app, this would come from an API or database)
    const sampleItineraries: Itinerary[] = [
      {
        id: '1',
        name: 'Du lịch Hà Nội',
        startDate: '2025-04-01',
        endDate: '2025-04-05',
        days: [
          {
            id: 'd1',
            day: 1,
            date: '2025-04-01',
            destinations: [destinationData[0], destinationData[1]],
            notes: 'Khám phá Hà Nội cổ kính'
          },
          {
            id: 'd2',
            day: 2,
            date: '2025-04-02',
            destinations: [destinationData[0]],
            notes: 'Thăm Văn Miếu'
          }
        ],
        budget: 5000000,
        expenses: {
          accommodation: 2000000,
          food: 1000000,
          transportation: 1000000,
          activities: 800000,
          other: 200000
        }
      },
      {
        id: '2',
        name: 'Du lịch Đà Nẵng',
        startDate: '2025-03-10',
        endDate: '2025-03-15',
        days: [
          {
            id: 'd3',
            day: 1,
            date: '2025-03-10',
            destinations: [destinationData[2]],
            notes: 'Thăm Bà Nà Hills'
          },
          {
            id: 'd4',
            day: 2,
            date: '2025-03-11',
            destinations: [destinationData[3], destinationData[2]],
            notes: 'Thăm Hội An'
          },
          {
            id: 'd5',
            day: 3,
            date: '2025-03-12',
            destinations: [destinationData[4]],
            notes: 'Thăm Ngũ Hành Sơn'
          }
        ],
        budget: 7500000,
        expenses: {
          accommodation: 3000000,
          food: 1500000,
          transportation: 1500000,
          activities: 1200000,
          other: 300000
        }
      },
      {
        id: '3',
        name: 'Du lịch Phú Quốc',
        startDate: '2025-02-05',
        endDate: '2025-02-10',
        days: [
          {
            id: 'd6',
            day: 1,
            date: '2025-02-05',
            destinations: [destinationData[5]],
            notes: 'Thăm Vinpearl Safari'
          },
          {
            id: 'd7',
            day: 2,
            date: '2025-02-06',
            destinations: [destinationData[6]],
            notes: 'Lặn biển ngắm san hô'
          }
        ],
        budget: 9000000,
        expenses: {
          accommodation: 4000000,
          food: 2000000,
          transportation: 1500000,
          activities: 1200000,
          other: 300000
        }
      }
    ];

    // Calculate statistics
    calculateStats(sampleItineraries);
  }, []);

  const calculateStats = (itineraries: Itinerary[]) => {
    // 1. Calculate monthly itinerary count
    const statsMap: { [key: string]: number } = {};
    itineraries.forEach(itinerary => {
      const month = itinerary.startDate.substring(0, 7);  // Format "YYYY-MM"
      statsMap[month] = (statsMap[month] || 0) + 1;
    });

    const monthlyStats = Object.keys(statsMap).map(month => ({
      month,
      itineraryCount: statsMap[month],
    }));
    setItineraryStats(monthlyStats);

    // 2. Calculate popular destinations
    const destCount: { [key: string]: { count: number; type: string; name: string } } = {};
    itineraries.forEach(itinerary => {
      itinerary.days.forEach(day => {
        day.destinations.forEach(destination => {
          if (!destCount[destination.id]) {
            destCount[destination.id] = {
              count: 0,
              type: destination.type,
              name: destination.name
            };
          }
          destCount[destination.id].count += 1;
        });
      });
    });

    const sortedDestinations = Object.values(destCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);  // Top 5 destinations
    
    setPopularDestinations(sortedDestinations);

    // 3. Calculate expense statistics
    const totalBudget = itineraries.reduce((sum, itinerary) => sum + itinerary.budget, 0);
    const totalExpensesByCategory = {
      accommodation: 0,
      food: 0,
      transportation: 0,
      activities: 0,
      other: 0
    };

    itineraries.forEach(itinerary => {
      totalExpensesByCategory.accommodation += itinerary.expenses.accommodation;
      totalExpensesByCategory.food += itinerary.expenses.food;
      totalExpensesByCategory.transportation += itinerary.expenses.transportation;
      totalExpensesByCategory.activities += itinerary.expenses.activities;
      totalExpensesByCategory.other += itinerary.expenses.other;
    });

    const totalExpenses = Object.values(totalExpensesByCategory).reduce((sum, value) => sum + value, 0);

    const expenseStats = [
      { 
        category: 'Chỗ ở', 
        amount: totalExpensesByCategory.accommodation,
        percentage: (totalExpensesByCategory.accommodation / totalExpenses) * 100
      },
      { 
        category: 'Ăn uống', 
        amount: totalExpensesByCategory.food,
        percentage: (totalExpensesByCategory.food / totalExpenses) * 100
      },
      { 
        category: 'Di chuyển', 
        amount: totalExpensesByCategory.transportation,
        percentage: (totalExpensesByCategory.transportation / totalExpenses) * 100
      },
      { 
        category: 'Hoạt động', 
        amount: totalExpensesByCategory.activities,
        percentage: (totalExpensesByCategory.activities / totalExpenses) * 100
      },
      { 
        category: 'Khác', 
        amount: totalExpensesByCategory.other,
        percentage: (totalExpensesByCategory.other / totalExpenses) * 100
      }
    ];
    
    setExpenseStats(expenseStats);

    // 4. Calculate overall stats
    setTotalItineraries(itineraries.length);
    
    const allDestinations = new Set<string>();
    itineraries.forEach(itinerary => {
      itinerary.days.forEach(day => {
        day.destinations.forEach(dest => allDestinations.add(dest.id));
      });
    });
    setTotalDestinations(allDestinations.size);

    // Calculate average duration
    const avgDuration = itineraries.reduce((sum, itinerary) => {
      const start = new Date(itinerary.startDate);
      const end = new Date(itinerary.endDate);
      const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return sum + duration;
    }, 0) / itineraries.length;
    
    setAverageDuration(Math.round(avgDuration * 10) / 10); // Round to 1 decimal place
    
    // Calculate average budget
    setAverageBudget(totalBudget / itineraries.length);
  };

  return (
    <div className="statistics">
      <h1>Thống kê</h1>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Tổng số lịch trình" 
              value={totalItineraries} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Tổng số điểm đến" 
              value={totalDestinations} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Thời gian trung bình (ngày)" 
              value={averageDuration} 
              precision={1}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Ngân sách trung bình" 
              value={averageBudget} 
              precision={0} 
              formatter={(value) => `${value.toLocaleString()} VND`}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Số lượng lịch trình theo tháng">
            <Table
              dataSource={itineraryStats}
              columns={[
                { 
                  title: 'Tháng', 
                  dataIndex: 'month', 
                  key: 'month',
                  render: (month) => {
                    const [year, monthNum] = month.split('-');
                    return `Tháng ${monthNum}/${year}`;
                  }
                },
                { 
                  title: 'Số lượng', 
                  dataIndex: 'itineraryCount', 
                  key: 'itineraryCount',
                  render: (count) => <Tag color="blue">{count}</Tag>
                },
              ]}
              rowKey="month"
              pagination={false}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Điểm đến phổ biến">
            <Table
              dataSource={popularDestinations}
              columns={[
                { title: 'Tên điểm đến', dataIndex: 'name', key: 'name' },
                { 
                  title: 'Loại', 
                  dataIndex: 'type', 
                  key: 'type',
                  render: (type) => <Tag color="green">{type}</Tag>
                },
                { 
                  title: 'Số lượt', 
                  dataIndex: 'count', 
                  key: 'count',
                  render: (count) => <Tag color="blue">{count}</Tag>
                },
              ]}
              rowKey="name"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={16}>
        <Col span={24}>
          <Card title="Thống kê chi phí">
            <Table
              dataSource={expenseStats}
              columns={[
                { title: 'Danh mục', dataIndex: 'category', key: 'category' },
                { 
                  title: 'Tổng chi phí', 
                  dataIndex: 'amount', 
                  key: 'amount',
                  render: (amount) => `${amount.toLocaleString()} VND`
                },
                { 
                  title: 'Tỷ lệ', 
                  dataIndex: 'percentage', 
                  key: 'percentage',
                  render: (percentage) => {
                    let color = 'green';
                    if (percentage > 30) {
                      color = 'red';
                    } else if (percentage > 15) {
                      color = 'orange';
                    }
                    return <Tag color={color}>{percentage.toFixed(1)}%</Tag>;
                  }
                },
              ]}
              rowKey="category"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;