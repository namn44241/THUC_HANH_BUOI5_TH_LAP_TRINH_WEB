import { Destination } from './destination';

export const destinations: Destination[] = [
  {
    id: '1',
    name: 'Hạ Long',
    location: 'Quảng Ninh',
    description: 'Vịnh Hạ Long là một trong những kỳ quan thiên nhiên của thế giới với hàng nghìn hòn đảo đá vôi.',
    image: 'https://images.unsplash.com/photo-1573270689103-d7a4e42b609a',
    rating: 4.8,
    price: 1200000,
    type: 'beach',
    activities: ['Tham quan vịnh', 'Khám phá hang động', 'Chèo thuyền kayak'],
    duration: 6
  },
  {
    id: '2',
    name: 'Sapa',
    location: 'Lào Cai',
    description: 'Thị trấn miền núi với những ruộng bậc thang tuyệt đẹp và văn hóa dân tộc đa dạng.',
    image: 'https://images.unsplash.com/photo-1666160416071-f760a7af9ea6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.7,
    price: 800000,
    type: 'mountain',
    activities: ['Trekking', 'Thăm bản làng', 'Chinh phục Fansipan'],
    duration: 8
  },
  {
    id: '3',
    name: 'Hội An',
    location: 'Quảng Nam',
    description: 'Phố cổ Hội An với kiến trúc cổ kính và những chiếc đèn lồng đầy màu sắc.',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b',
    rating: 4.9,
    price: 500000,
    type: 'city',
    activities: ['Tham quan phố cổ', 'Thả đèn hoa đăng', 'Học nấu ăn'],
    duration: 4
  },
  {
    id: '4',
    name: 'Đà Lạt',
    location: 'Lâm Đồng',
    description: 'Thành phố ngàn hoa với khí hậu mát mẻ quanh năm và cảnh quan thiên nhiên tuyệt đẹp.',
    image: 'https://images.unsplash.com/photo-1578747356633-5d4ce16ae571?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.6,
    price: 600000,
    type: 'mountain',
    activities: ['Tham quan vườn hoa', 'Chèo thuyền hồ Tuyền Lâm', 'Cắm trại'],
    duration: 5
  },
  {
    id: '5',
    name: 'Phú Quốc',
    location: 'Kiên Giang',
    description: 'Hòn đảo thiên đường với những bãi biển cát trắng và nước biển trong xanh.',
    image: 'https://images.unsplash.com/photo-1706158793995-2e04831ee5fa?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.5,
    price: 1500000,
    type: 'beach',
    activities: ['Tắm biển', 'Lặn ngắm san hô', 'Câu cá'],
    duration: 7
  },
  {
    id: '6',
    name: 'Hà Nội',
    location: 'Thủ đô',
    description: 'Thủ đô nghìn năm văn hiến với sự kết hợp hài hòa giữa truyền thống và hiện đại.',
    image: 'https://images.unsplash.com/photo-1555921015-5532091f6026',
    rating: 4.4,
    price: 400000,
    type: 'city',
    activities: ['Tham quan Hồ Gươm', 'Khám phá phố cổ', 'Thưởng thức ẩm thực'],
    duration: 3
  },
  {
    id: '7',
    name: 'Nha Trang',
    location: 'Khánh Hòa',
    description: 'Thành phố biển nổi tiếng với bãi biển đẹp và nhiều hoạt động giải trí.',
    image: 'https://images.unsplash.com/photo-1697985035277-8275cc163332?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.3,
    price: 900000,
    type: 'beach',
    activities: ['Tắm biển', 'Tham quan Vinpearl Land', 'Lặn biển'],
    duration: 5
  },
  {
    id: '8',
    name: 'Huế',
    location: 'Thừa Thiên Huế',
    description: 'Cố đô Huế với hệ thống di tích lịch sử và văn hóa phong phú.',
    image: 'https://images.unsplash.com/photo-1692449452966-661371c6def1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.5,
    price: 450000,
    type: 'city',
    activities: ['Tham quan Đại Nội', 'Du thuyền sông Hương', 'Thưởng thức ẩm thực cung đình'],
    duration: 4
  }
]; 