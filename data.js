const menuData = {
  categories: [
    {
      id: 'doner',
      name: 'Donerlar va Donar Miks',
      items: [
        { id: 'd1', name: 'Xaggi', price: 41000, desc: 'Klassik doner', img: 'https://images.unsplash.com/photo-1529124445831-50e50ae8bbfa?auto=format&fit=crop&w=300&q=80' },
        { id: 'd2', name: 'Shaurma', price: 31000, desc: 'Klassik shaurma', img: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=300&q=80' },
        { id: 'd3', name: 'Pita doneri', price: 35000, desc: 'Klassik pita', img: 'https://images.unsplash.com/photo-1529124445831-50e50ae8bbfa?auto=format&fit=crop&w=300&q=80' },
        { id: 'd4', name: 'Super pita', price: 37000, desc: 'Katta pita doner', img: 'https://images.unsplash.com/photo-1529124445831-50e50ae8bbfa?auto=format&fit=crop&w=300&q=80' },
        { id: 'd5', name: 'Katta doner', price: 41000, desc: 'Klassik', img: 'https://images.unsplash.com/photo-1529124445831-50e50ae8bbfa?auto=format&fit=crop&w=300&q=80' },
        { id: 'd6', name: 'Tovuqli tombik-doner', price: 34000, desc: 'Tovuqli', img: 'https://images.unsplash.com/photo-1632224856001-c85202685de7?auto=format&fit=crop&w=300&q=80' },
        { id: 'd7', name: 'Tovuqli pita doneri', price: 33000, desc: 'Tovuqli', img: 'https://images.unsplash.com/photo-1632224856001-c85202685de7?auto=format&fit=crop&w=300&q=80' },
        { id: 'd8', name: 'Tovuqli shaurma', price: 29000, desc: 'Tovuqli', img: 'https://images.unsplash.com/photo-1632224856001-c85202685de7?auto=format&fit=crop&w=300&q=80' },
        { id: 'd9', name: 'Tovuqli xaggi', price: 39000, desc: 'Tovuqli', img: 'https://images.unsplash.com/photo-1632224856001-c85202685de7?auto=format&fit=crop&w=300&q=80' },
        { id: 'd10', name: 'Tovuqli donar miks', price: 53000, desc: 'Miks', img: 'https://images.unsplash.com/photo-1605333555543-057bfdf8b8ba?auto=format&fit=crop&w=300&q=80' },
        { id: 'd11', name: 'Mol go\'shtli doner miks', price: 56000, desc: 'Miks', img: 'https://images.unsplash.com/photo-1605333555543-057bfdf8b8ba?auto=format&fit=crop&w=300&q=80' }
      ]
    },
    {
      id: 'lavash',
      name: 'Lavashlar',
      items: [
        { id: 'l1', name: 'Katta lavash', price: 37000, desc: 'Standart', img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=300&q=80' },
        { id: 'l2', name: 'Mini lavash', price: 32000, desc: 'Standart', img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=300&q=80' },
        { id: 'l3', name: 'Pishloqli katta', price: 40000, desc: 'Standart', img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=300&q=80' },
        { id: 'l4', name: 'Tandir lavash', price: 39000, desc: 'Tandir', img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=300&q=80' },
        { id: 'l5', name: 'Tovuqli katta lavash', price: 35000, desc: 'Tovuqli', img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=300&q=80' },
        { id: 'l6', name: 'Tovuqli mini lavash', price: 29000, desc: 'Tovuqli', img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=300&q=80' }
      ]
    },
    {
      id: 'burger',
      name: 'Burgerlar va Xot-doglar',
      items: [
        { id: 'b1', name: 'Gamburger', price: 34000, desc: 'Klassik', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80' },
        { id: 'b2', name: 'Chizburger', price: 36000, desc: 'Pishloqli', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80' },
        { id: 'b3', name: 'Big Burger', price: 50000, desc: 'Katta', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80' },
        { id: 'h1', name: 'Xot-dog', price: 19000, desc: 'Klassik', img: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=300&q=80' },
        { id: 'h2', name: 'Qirollik Xot-dog\'i', price: 28000, desc: 'Katta', img: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=300&q=80' }
      ]
    },
    {
      id: 'chicken',
      name: 'Tovuqli Taomlar va Sneklar',
      items: [
        { id: 'c1', name: 'Klab sendvich', price: 42000, desc: 'Fri bilan', img: 'https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?auto=format&fit=crop&w=300&q=80' },
        { id: 'c2', name: 'Fri katta', price: 25000, desc: 'Sneklar', img: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=300&q=80' },
        { id: 'c3', name: 'Stripslar (5 dona)', price: 34000, desc: 'Tovuqli', img: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=300&q=80' },
        { id: 'c4', name: 'Nuggetslar (8 dona)', price: 24000, desc: 'Tovuqli', img: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=300&q=80' }
      ]
    },
    {
      id: 'pizza',
      name: 'Pitsalar va Salatlar',
      items: [
        { id: 'p1', name: 'Assorti Pitsa', price: 110000, desc: 'Katta', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80' },
        { id: 'p2', name: 'Pepperoni', price: 95000, desc: 'Katta', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80' },
        { id: 's1', name: 'Tsezar', price: 30000, desc: 'Salat', img: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=300&q=80' }
      ]
    },
    {
      id: 'drinks',
      name: 'Ichimliklar',
      items: [
        { id: 'dr1', name: 'Moxito klassik', price: 18000, desc: 'Salqin', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=300&q=80' },
        { id: 'dr2', name: 'Pepsi 0.5L', price: 10000, desc: 'Gazli', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80' }
      ]
    },
    {
      id: 'combo',
      name: 'Setlar va Aksiyalar',
      items: [
        { id: 'cb1', name: 'Talaba to\'plami 1', price: 39000, desc: 'Aksiya', img: 'https://images.unsplash.com/photo-1594212691516-436f54c25fb8?auto=format&fit=crop&w=300&q=80' },
        { id: 'cb2', name: 'Pishloqli xot-dog to\'plami', price: 39000, desc: 'Aksiya', img: 'https://images.unsplash.com/photo-1594212691516-436f54c25fb8?auto=format&fit=crop&w=300&q=80' },
        { id: 'cb3', name: 'Lavashlar juftligi', price: 105000, desc: 'Aksiya', img: 'https://images.unsplash.com/photo-1594212691516-436f54c25fb8?auto=format&fit=crop&w=300&q=80' }
      ]
    }
  ]
};
