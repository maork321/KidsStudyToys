
import { Subject, Course, Achievement, ShopItem, QuestionBank } from '../types';

export const subjects: Subject[] = [
  {
    id: 'chinese',
    name: '语文',
    icon: '📚',
    color: 'from-pink-400 to-red-400',
    description: '学习汉字、拼音、古诗',
    enabled: true
  },
  {
    id: 'math',
    name: '数学',
    icon: '🔢',
    color: 'from-blue-400 to-cyan-400',
    description: '认识数字、学习计算',
    enabled: true
  },
  {
    id: 'english',
    name: '英语',
    icon: '🌍',
    color: 'from-green-400 to-teal-400',
    description: '学习单词、简单对话',
    enabled: true
  },
  {
    id: 'science',
    name: '科学',
    icon: '🔬',
    color: 'from-purple-400 to-indigo-400',
    description: '探索自然、认识世界',
    enabled: true
  }
];

// 题库示例
export const questionBanks: QuestionBank[] = [
  {
    id: 'math-bank-l1',
    subjectId: 'math',
    name: '数学入门题库',
    description: '适合4-5岁小朋友的数学题目',
    questions: [
      {
        id: 'q1',
        type: 'calculation',
        difficulty: 1,
        content: '1 + 2 = ?',
        options: ['2', '3', '4'],
        correctAnswer: 3,
        explanation: '1个苹果加2个苹果等于3个苹果'
      },
      {
        id: 'q2',
        type: 'multiple_choice',
        difficulty: 1,
        content: '🐱🐱🐱 有几只小猫？',
        options: ['2只', '3只', '4只'],
        correctAnswer: '3只',
        explanation: '数一数，一共有3只小猫'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'chinese-bank-l1',
    subjectId: 'chinese',
    name: '语文入门题库',
    description: '适合4-5岁小朋友的语文题目',
    questions: [
      {
        id: 'q1',
        type: 'character',
        difficulty: 1,
        content: '哪个是"一"？',
        options: ['一', '二', '三'],
        correctAnswer: '一',
        explanation: '这是汉字"一"'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const courses: Course[] = [
  // 语文课程
  {
    id: 'chinese-l1-1',
    subjectId: 'chinese',
    title: '认识数字汉字',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20chinese%20characters%20for%20kids%20numbers%201-10%20colorful%20cartoon&image_size=square',
    level: 1,
    description: '学习一到十的汉字写法',
    points: 10,
    content: [
      { id: '1', type: 'intro', title: '欢迎来到汉字王国！', description: '今天我们来学习一到十的汉字。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=happy%20cartoon%20kids%20learning%20chinese%20characters%20colorful&image_size=square' },
      { id: '2', type: 'quiz', title: '选一选', question: '哪个是"一"？', options: ['一', '二', '三'], correctAnswer: '一' },
      { id: '3', type: 'match', title: '连连看', options: ['一', '二', '三', '四', '五'], correctAnswer: ['一', '二', '三', '四', '五'] },
      { id: '4', type: 'complete', title: '太棒了！', description: '你已经学会了一到五！' }
    ]
  },
  {
    id: 'chinese-l1-2',
    subjectId: 'chinese',
    title: '学习拼音a o e',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20pinyin%20a%20o%20e%20for%20kids%20colorful%20cartoon&image_size=square',
    level: 1,
    description: '认识基础拼音韵母',
    points: 10,
    content: [
      { id: '1', type: 'intro', title: '拼音乐园', description: '让我们一起认识a、o、e！', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=colorful%20pinyin%20alphabet%20for%20children%20cartoon%20style&image_size=square' },
      { id: '2', type: 'quiz', title: '找一找', question: '哪个是"a"？', options: ['a', 'o', 'e'], correctAnswer: 'a' },
      { id: '3', type: 'complete', title: '完成啦！', description: '你认识了a、o、e！' }
    ]
  },
  // 数学课程
  {
    id: 'math-l1-1',
    subjectId: 'math',
    title: '认识1-5',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20numbers%201-5%20for%20kids%20with%20animals%20colorful%20cartoon&image_size=square',
    level: 1,
    description: '数数1到5',
    points: 10,
    content: [
      { id: '1', type: 'intro', title: '数字小火车', description: '让我们数一数有多少个小动物！', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20animals%20counting%201%20to%205%20cartoon%20style%20for%20kids&image_size=square' },
      { id: '2', type: 'quiz', title: '数一数', question: '有几只小猫？🐱🐱🐱', options: ['2只', '3只', '4只'], correctAnswer: '3只' },
      { id: '3', type: 'complete', title: '数学小达人！', description: '你会数1-5啦！' }
    ]
  },
  {
    id: 'math-l1-2',
    subjectId: 'math',
    title: '简单加法',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=addition%20for%20kids%20colorful%20fruits%20cartoon&image_size=square',
    level: 1,
    description: '学习10以内的加法',
    points: 15,
    content: [
      { id: '1', type: 'intro', title: '水果加法', description: '用水果来学习加法吧！', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=colorful%20fruits%20addition%20learning%20cartoon&image_size=square' },
      { id: '2', type: 'quiz', title: '算一算', question: '1 + 2 = ?', options: ['2', '3', '4'], correctAnswer: '3' },
      { id: '3', type: 'complete', title: '计算小能手！', description: '你学会加法啦！' }
    ]
  },
  // 英语课程
  {
    id: 'english-l1-1',
    subjectId: 'english',
    title: '认识ABC',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=english%20alphabet%20ABC%20for%20kids%20colorful%20cartoon&image_size=square',
    level: 1,
    description: '学习英文字母A-G',
    points: 10,
    content: [
      { id: '1', type: 'intro', title: '字母歌', description: '让我们一起唱字母歌！', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=happy%20cartoon%20animals%20with%20english%20alphabet%20letters&image_size=square' },
      { id: '2', type: 'quiz', title: '找字母', question: '哪个是"A"？', options: ['A', 'B', 'C'], correctAnswer: 'A' },
      { id: '3', type: 'complete', title: '英语小能手！', description: '你认识A-G啦！' }
    ]
  },
  {
    id: 'english-l1-2',
    subjectId: 'english',
    title: '学习颜色',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=colors%20for%20kids%20rainbow%20colorful%20cartoon&image_size=square',
    level: 1,
    description: '认识颜色单词',
    points: 10,
    content: [
      { id: '1', type: 'intro', title: '彩虹世界', description: '让我们认识颜色吧！', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=rainbow%20colors%20learning%20for%20children%20cartoon&image_size=square' },
      { id: '2', type: 'quiz', title: '这是什么颜色？', question: '🔴 是？', options: ['blue', 'red', 'yellow'], correctAnswer: 'red' },
      { id: '3', type: 'complete', title: '颜色小达人！', description: '你认识了颜色单词！' }
    ]
  },
  // 科学课程
  {
    id: 'science-l1-1',
    subjectId: 'science',
    title: '认识动物',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20animals%20for%20kids%20farm%20and%20zoo%20colorful%20cartoon&image_size=square',
    level: 1,
    description: '认识常见的小动物',
    points: 10,
    content: [
      { id: '1', type: 'intro', title: '动物园之旅', description: '让我们认识可爱的动物！', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=happy%20zoo%20animals%20cartoon%20for%20children&image_size=square' },
      { id: '2', type: 'quiz', title: '这是什么动物？', question: '🐶', options: ['猫', '狗', '兔子'], correctAnswer: '狗' },
      { id: '3', type: 'complete', title: '动物小博士！', description: '你认识了很多动物！' }
    ]
  },
  {
    id: 'science-l1-2',
    subjectId: 'science',
    title: '认识天气',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=weather%20for%20kids%20sun%20rain%20cloud%20colorful%20cartoon&image_size=square',
    level: 1,
    description: '了解不同天气现象',
    points: 10,
    content: [
      { id: '1', type: 'intro', title: '气象台', description: '今天天气怎么样？', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20weather%20icons%20for%20children%20cartoon&image_size=square' },
      { id: '2', type: 'quiz', title: '这是什么天气？', question: '☀️', options: ['下雨', '晴天', '多云'], correctAnswer: '晴天' },
      { id: '3', type: 'complete', title: '气象小专家！', description: '你认识了天气！' }
    ]
  },
  // 更多课程...
  {
    id: 'chinese-l2-1',
    subjectId: 'chinese',
    title: '学习古诗《咏鹅》',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20poetry%20goose%20for%20kids%20traditional%20painting%20cartoon&image_size=square',
    level: 2,
    description: '学习经典古诗',
    points: 20,
    content: [
      { id: '1', type: 'intro', title: '古诗学堂', description: '让我们学习《咏鹅》！', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20goose%20swimming%20cartoon%20style%20for%20kids&image_size=square' },
      { id: '2', type: 'complete', title: '小诗人！', description: '你学会了《咏鹅》！' }
    ]
  },
  {
    id: 'math-l2-1',
    subjectId: 'math',
    title: '认识形状',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=geometric%20shapes%20for%20kids%20colorful%20cartoon&image_size=square',
    level: 2,
    description: '认识圆形、三角形、方形',
    points: 15,
    content: [
      { id: '1', type: 'intro', title: '形状乐园', description: '找找身边的形状！', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=colorful%20shapes%20circle%20triangle%20square%20for%20children&image_size=square' },
      { id: '2', type: 'complete', title: '形状达人！', description: '你认识了很多形状！' }
    ]
  }
];

export const achievements: Achievement[] = [
  { id: 'first-course', name: '小学者', description: '完成第一个课程', icon: '🎓', requirement: 1, type: 'courses' },
  { id: 'five-courses', name: '学习能手', description: '完成5个课程', icon: '📖', requirement: 5, type: 'courses' },
  { id: 'ten-courses', name: '小博士', description: '完成10个课程', icon: '🏆', requirement: 10, type: 'courses' },
  { id: 'hundred-points', name: '积分达人', description: '获得100积分', icon: '⭐', requirement: 100, type: 'points' },
  { id: 'five-hundred-points', name: '大富翁', description: '获得500积分', icon: '💰', requirement: 500, type: 'points' }
];

export const shopItems: ShopItem[] = [
  { id: 'avatar-cat', name: '小猫咪头像', description: '可爱的小猫咪', icon: '🐱', price: 50, type: 'avatar' },
  { id: 'avatar-dog', name: '小狗狗头像', description: '忠诚的小狗狗', icon: '🐶', price: 50, type: 'avatar' },
  { id: 'avatar-rabbit', name: '小兔子头像', description: '萌萌的小兔子', icon: '🐰', price: 50, type: 'avatar' },
  { id: 'decoration-star', name: '星星装饰', description: '闪耀的星星', icon: '✨', price: 30, type: 'decoration' },
  { id: 'decoration-rainbow', name: '彩虹边框', description: '美丽的彩虹', icon: '🌈', price: 80, type: 'decoration' },
  { id: 'badge-champion', name: '冠军徽章', description: '专属荣誉徽章', icon: '🏅', price: 100, type: 'badge' }
];
