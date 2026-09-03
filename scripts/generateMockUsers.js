import fs from 'fs';

const firstNamesMale = [
  'Jasur', 'Sardor', 'Bekzod', 'Farrux', 'Bobur', 'Alisher', 'Otabek', 'Shavkat',
  'Ulugbek', 'Rustam', 'Jamshid', 'Aziz', 'Sherzod', 'Dilshod', 'Timur', 'Sanjar',
  'Shohruh', 'Nodir', 'Eldor', 'Javohir', 'Shahboz', 'Doston', 'Murod', 'Kamron',
  'Asilbek', 'Ilhom', 'Mirabbos', 'Botir', 'Doniyor', 'Ravshan', 'Anvar', 'Umid',
  'Xurshid', 'Fayzulloh', 'Zafar', 'Qobil', 'Akbar', 'Bunyod', 'Tohir', 'Mansur',
  'Shoislom', 'Sirojiddin', 'Suhrob', 'Baxtiyor', 'Jahongir'
];

const firstNamesFemale = [
  'Madina', 'Nilufar', 'Dilnoza', 'Shahlo', 'Gulnora', 'Sevara', 'Lola', 'Mohira',
  'Kamola', 'Feruza', 'Nargiza', 'Malika', 'Sabina', 'Zarina', 'Rayhona', 'Diyora',
  'Munisa', 'Nozima', 'Aziza', 'Durdona', 'Zilola', 'Yulduz', 'Shahzoda', 'Gulbahor',
  'Barno', 'Umida', 'Laylo', 'Dilrabo', 'Parizoda', 'Zuhra', 'Fotima', 'Hadicha',
  'Asila', 'Muslima', 'Saodat', 'Robiya', 'Gulasal', 'Mohinur', 'Iroda', 'Nigora',
  'Zebiniso', 'Oysha', 'Gulchehra', 'Guzal', 'Hilola'
];

const lastNamesMale = [
  'Rahimov', 'Aliyev', 'Rustamov', 'Mahmudov', 'Yusupov', 'Ahmedov', 'Halilov',
  'Mirzayev', 'Toxtayev', 'Tursunov', 'Ergashev', 'Nazarov', 'Jorayev', 'Vohidov',
  'Bozorov', 'Sobirov', 'Yoldoshev', 'Normatov', 'Ganiyev', 'Qosimov', 'Karimov',
  'Abdullayev', 'Mamatov', 'Oripov', 'Hasanov', 'Zokirov', 'Latipov', 'Polatov',
  'Boboyev', 'Eshonqulov', 'Sharipov', 'Nurmatov', 'Hamroyev', 'Ismoilov', 'Saidov',
  'Ortiqov', 'Kimsanov', 'Nabiyev', 'Fayziyev', 'Davronov', 'Botirov', 'Sultonov',
  'Rasulov', 'Matyoqubov', 'Xudoyberdiyev'
];

const lastNamesFemale = [
  'Karimova', 'Usmanova', 'Shodiyeva', 'Ismoilova', 'Saidova', 'Qodirova', 'Holiqova',
  'Sodiqova', 'Holmatova', 'Davlatova', 'Rahimova', 'Aliyeva', 'Rustamova', 'Mahmudova',
  'Yusupova', 'Ahmedova', 'Halilova', 'Mirzayeva', 'Toxtayeva', 'Tursunova', 'Ergasheva',
  'Nazarova', 'Jorayeva', 'Vohidova', 'Bozorova', 'Sobirova', 'Yoldosheva', 'Normatova',
  'Ganiyeva', 'Qosimova', 'Abdullayeva', 'Mamatova', 'Oripova', 'Hasanova', 'Zokirova',
  'Latipova', 'Polatova', 'Boboyeva', 'Sharipova', 'Nurmatova', 'Hamroyeva', 'Ortiqova',
  'Nabiyeva', 'Fayziyeva', 'Davronova'
];

const domains = ['gmail.com', 'mail.ru', 'yandex.ru', 'icloud.com'];

const users = [
  {
    id: 'usr-creator',
    name: 'Sprint383',
    phone: 'asd10101010qwerty@gmail.com',
    registeredAt: '2026-01-10T10:00:00.000Z',
    role: 'creator',
    ordersCount: 0,
    totalSpent: 0
  }
];

// Generate exactly 90 diverse demo clients
for (let i = 1; i <= 90; i++) {
  const isFemale = i % 2 === 0;
  const firstName = isFemale 
    ? firstNamesFemale[(i * 3) % firstNamesFemale.length] 
    : firstNamesMale[(i * 3) % firstNamesMale.length];
  const lastName = isFemale 
    ? lastNamesFemale[(i * 5) % lastNamesFemale.length] 
    : lastNamesMale[(i * 5) % lastNamesMale.length];
  const domain = domains[i % domains.length];
  const cleanFirst = firstName.toLowerCase().replace(/[^a-z]/g, '');
  const cleanLast = lastName.toLowerCase().replace(/[^a-z]/g, '');
  const emailSuffix = (i % 7 === 0) ? `${i}` : '';
  const email = `${cleanFirst}.${cleanLast}${emailSuffix}@${domain}`;
  
  const day = (i % 28) + 1;
  const month = (i % 8) + 1;
  const dayStr = day < 10 ? '0' + day : day;
  const monthStr = month < 10 ? '0' + month : month;
  const hour = (i * 7) % 24;
  const min = (i * 11) % 60;
  const hourStr = hour < 10 ? '0' + hour : hour;
  const minStr = min < 10 ? '0' + min : min;
  const dateStr = `2026-${monthStr}-${dayStr}T${hourStr}:${minStr}:00.000Z`;

  const ordersCount = (i % 12) + 1;
  const avgOrderPrice = 450000 + (i * 135000) % 2500000;
  const totalSpent = ordersCount * avgOrderPrice;

  users.push({
    id: `usr-demo-${i}`,
    name: `${firstName} ${lastName}`,
    phone: email,
    registeredAt: dateStr,
    role: 'customer',
    ordersCount,
    totalSpent
  });
}

const content = '/**\n * Realistic Demo / Mock Customers for Sprint Marketplace Admin Panel (90 Users)\n */\n\nexport const mockUsers = ' + JSON.stringify(users, null, 2) + ';\n';
fs.writeFileSync('./src/data/mockUsers.js', content, 'utf8');
console.log('Successfully generated mockUsers.js with ' + users.length + ' users (1 creator + 90 demo clients)!');
