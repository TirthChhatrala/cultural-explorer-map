
export interface NewsVersion {
  id: number;
  title: string;
  content: string;
  category: string;
  state: string;
  date: string;
  createdAt: string;
}

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  category: string;
  state: string;
  date: string;
  author: string;
  image: string;
  versions: NewsVersion[];
}

export const newsItems: NewsItem[] = [
  { 
    id: 1, 
    title: 'Kerala Tourism Wins Award', 
    content: 'Kerala tourism department received international recognition for its sustainable tourism initiatives and innovative marketing campaigns. The state has been promoting eco-friendly tourism practices across its popular destinations.',
    category: 'tourism',
    state: 'kerala',
    date: new Date().toISOString().split('T')[0],
    author: 'Rahul Sharma',
    image: '/lovable-uploads/87e03e01-1cae-414e-8e9d-f0e1eb9b6b92.png',
    versions: [
      {
        id: 1,
        title: 'Kerala Tourism Wins Award', 
        content: 'Kerala tourism department received international recognition.',
        category: 'tourism',
        state: 'kerala',
        date: new Date().toISOString().split('T')[0],
        createdAt: '2024-04-25T10:30:00Z'
      }
    ]
  },
  { 
    id: 2, 
    title: 'Maharashtra Celebrates Cultural Festival', 
    content: 'Maharashtra hosted its annual cultural festival showcasing traditional art forms, music, and dance from across the state. The event attracted thousands of visitors and highlighted the rich cultural heritage of the region.',
    category: 'culture',
    state: 'maharashtra',
    date: new Date().toISOString().split('T')[0],
    author: 'Priya Patel',
    image: '/lovable-uploads/87e03e01-1cae-414e-8e9d-f0e1eb9b6b92.png',
    versions: [
      {
        id: 1,
        title: 'Maharashtra Cultural Festival', 
        content: 'Maharashtra hosted its annual cultural festival.',
        category: 'culture',
        state: 'maharashtra',
        date: new Date().toISOString().split('T')[0],
        createdAt: '2024-04-24T14:15:00Z'
      }
    ]
  },
  { 
    id: 3, 
    title: 'Gujarat Renewable Energy Project Launched', 
    content: 'Gujarat government launched a new renewable energy project focusing on solar power generation. The initiative aims to increase the state\'s clean energy capacity and reduce carbon emissions over the next five years.',
    category: 'technology',
    state: 'gujarat',
    date: new Date().toISOString().split('T')[0],
    author: 'Amit Shah',
    image: '/lovable-uploads/87e03e01-1cae-414e-8e9d-f0e1eb9b6b92.png',
    versions: [
      {
        id: 1,
        title: 'Gujarat Energy Project', 
        content: 'Gujarat government launched a new renewable energy project.',
        category: 'technology',
        state: 'gujarat',
        date: new Date().toISOString().split('T')[0],
        createdAt: '2024-04-23T09:45:00Z'
      }
    ]
  }
];
