import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update Map Coordinates
html = html.replace('41.311081, 69.240562', '40.2144, 68.8387')
html = html.replace('41.3200', '40.2144').replace('69.2500', '68.8387')
html = html.replace('41.3000', '40.2080').replace('69.2300', '68.8450')
html = html.replace('41.3150', '40.2110').replace('69.2450', '68.8410')
html = html.replace('Toshkent', 'Xovos')

# 2. Add Fortune Wheel Modal State
app_state_search = "const [region, setRegion] = useState('Xovos');"
app_state_replacement = "const [region, setRegion] = useState('Xovos');\n      const [isWheelOpen, setIsWheelOpen] = useState(false);\n      const [isAdminOpen, setIsAdminOpen] = useState(false);"

html = html.replace(app_state_search, app_state_replacement)

# 3. Add Fortune Wheel Button
wheel_btn_search = "onClick={() => alert('Tez kunda: Omad g\\'ildiragi moduli ishga tushadi!')}"
wheel_btn_replacement = "onClick={() => setIsWheelOpen(true)}"
html = html.replace(wheel_btn_search, wheel_btn_replacement)

# 4. Add Admin Button in Header
login_btn_search = "<button className=\"bg-brandYellow text-slate-900 px-6 py-2.5 rounded-lg font-bold hover:bg-brandYellowDark transition shadow-sm\">"
login_btn_replacement = '''<button onClick={() => setIsAdminOpen(true)} className="bg-slate-800 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-slate-700 transition shadow-sm text-sm">
                    Admin
                  </button>\n                  ''' + login_btn_search
html = html.replace(login_btn_search, login_btn_replacement)

# 5. Inject Modals (Wheel + Admin) at the bottom of App return
modals_code = '''
          {/* FORTUNE WHEEL MODAL */}
          {isWheelOpen && <FortuneWheel onClose={() => setIsWheelOpen(false)} menu={menuData} addToCart={addToCart} />}
          
          {/* ADMIN MODAL */}
          {isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} cart={cart} />}
'''
cart_modal_end = "        </div>\n      );\n    };"
html = html.replace(cart_modal_end, modals_code + "\n" + cart_modal_end)

# 6. Append Components before App
components_code = '''
    const FortuneWheel = ({ onClose, menu, addToCart }) => {
      const [spinning, setSpinning] = useState(false);
      const [result, setResult] = useState(null);
      const [budget, setBudget] = useState('all'); // all, 30k
      
      const allItems = menu.categories.flatMap(c => c.items);
      const filteredItems = budget === '30k' ? allItems.filter(i => i.price <= 30000) : allItems;

      const spin = () => {
        if(spinning) return;
        setSpinning(true);
        setResult(null);
        
        let counter = 0;
        const interval = setInterval(() => {
           setResult(filteredItems[Math.floor(Math.random() * filteredItems.length)]);
           counter++;
           if(counter > 20) {
             clearInterval(interval);
             setSpinning(false);
           }
        }, 100);
      };

      return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-[fadeIn_0.3s_ease-out]">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><i data-lucide="x" className="w-6 h-6"></i></button>
            <div className="text-center">
              <div className="w-20 h-20 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-4">
                <i data-lucide="dices" className="w-10 h-10"></i>
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-2">Omad G'ildiragi</h2>
              <p className="text-slate-500 font-medium mb-6">Tanlovni tasodifga qo'yib bering!</p>
              
              <div className="flex justify-center gap-3 mb-8">
                <button onClick={() => setBudget('all')} className={px-4 py-2 rounded-xl font-bold text-sm transition }>Barcha taomlar</button>
                <button onClick={() => setBudget('30k')} className={px-4 py-2 rounded-xl font-bold text-sm transition }>30 000 gacha</button>
              </div>

              <div className="h-48 border-4 border-slate-100 rounded-3xl bg-slate-50 flex items-center justify-center overflow-hidden mb-8 relative p-4 shadow-inner">
                {result ? (
                  <div className={	ext-center transition-all }>
                    <img src={result.img} className="w-20 h-20 object-cover rounded-full mx-auto mb-3 shadow-md" alt={result.name} />
                    <h3 className="text-xl font-bold text-slate-800">{result.name}</h3>
                    <p className="text-brand font-black text-lg">{result.price.toLocaleString()} so'm</p>
                  </div>
                ) : (
                  <div className="text-slate-400 font-medium text-lg">Aylantirish tugmasini bosing</div>
                )}
              </div>

              {!spinning && result ? (
                 <button onClick={() => { addToCart(result); onClose(); }} className="w-full bg-brand text-white py-4 rounded-xl font-bold text-lg hover:bg-brandDark transition shadow-lg hover:shadow-brand/30">
                   Savatga qo'shish
                 </button>
              ) : (
                 <button onClick={spin} disabled={spinning} className="w-full bg-brandYellow text-slate-900 py-4 rounded-xl font-bold text-lg hover:bg-brandYellowDark transition shadow-lg disabled:opacity-50">
                   {spinning ? "Aylanmoqda..." : "Omadni sinash"}
                 </button>
              )}
            </div>
          </div>
        </div>
      );
    };

    const AdminPanel = ({ onClose, cart }) => {
      const printReceipt = () => {
         const receiptContent = document.getElementById('receipt-area').innerHTML;
         const printWindow = window.open('', '', 'width=400,height=600');
         printWindow.document.write('<html><head><title>Chek Chop Etish</title>');
         printWindow.document.write('<style>body{font-family:monospace;padding:20px;width:300px;margin:0 auto;color:#000;} .text-center{text-align:center;} .font-bold{font-weight:bold;} .border-b{border-bottom:1px dashed #000;margin-bottom:10px;padding-bottom:10px;} .flex{display:flex;justify-content:space-between;} .mt-4{margin-top:16px;} .mb-2{margin-bottom:8px;} .text-sm{font-size:12px;}</style>');
         printWindow.document.write('</head><body>');
         printWindow.document.write(receiptContent);
         printWindow.document.write('</body></html>');
         printWindow.document.close();
         setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
      };

      const total = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);

      return (
        <div className="fixed inset-0 z-[80] bg-slate-100 flex flex-col animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
            <div className="font-bold text-xl flex items-center gap-2"><i data-lucide="layout-dashboard" className="w-6 h-6"></i> Kassir va Admin paneli</div>
            <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition"><i data-lucide="x" className="w-6 h-6"></i></button>
          </div>
          
          <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-y-auto">
            <div className="lg:col-span-2 space-y-6">
               <h2 className="text-2xl font-bold text-slate-800">Jonli Buyurtmalar</h2>
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                 <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                   <div>
                     <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">Yangi</span>
                     <h3 className="font-bold text-lg mt-2">Buyurtma #DO-8472</h3>
                     <p className="text-slate-500 text-sm">Mijoz: +998 90 123 45 67 (Xovos tumani, Markaziy ko'cha)</p>
                   </div>
                   <div className="text-right">
                     <div className="font-black text-xl text-slate-800">{(total || 45000).toLocaleString()} so'm</div>
                     <p className="text-slate-400 text-sm">12:30, Bugun</p>
                   </div>
                 </div>
                 <div className="text-sm text-slate-600 space-y-2 mb-6">
                   {cart.length > 0 ? cart.map(c => (
                     <div key={c.id} className="flex justify-between"><span>{c.qty}x {c.name}</span><span>{(c.price * c.qty).toLocaleString()}</span></div>
                   )) : (
                     <div className="flex justify-between"><span>1x Gamburger</span><span>34,000</span></div>
                   )}
                 </div>
                 <div className="flex gap-3">
                   <button className="bg-brand text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brandDark transition flex-1">Qabul qilish</button>
                   <button onClick={printReceipt} className="bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-700 transition flex items-center justify-center gap-2"><i data-lucide="printer" className="w-5 h-5"></i> Chek</button>
                 </div>
               </div>
            </div>

            <div className="lg:col-span-1">
               <h2 className="text-2xl font-bold text-slate-800 mb-6">Chekni oldindan ko'rish</h2>
               <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex justify-center">
                 <div id="receipt-area" className="w-full max-w-[300px] bg-white text-black text-sm p-4 border border-dashed border-slate-300">
                    <div className="text-center border-b mb-4 pb-4">
                      <h2 className="font-bold text-xl mb-1">DONERCI XOVOS</h2>
                      <p className="text-xs">Sirdaryo vil, Xovos tumani</p>
                      <p className="text-xs">Tel: +998 71 200 00 00</p>
                    </div>
                    <div className="mb-4">
                      <div className="flex"><span className="font-bold">Sana:</span> <span>{new Date().toLocaleDateString()}</span></div>
                      <div className="flex"><span className="font-bold">Chek:</span> <span>#DO-8472</span></div>
                      <div className="flex"><span className="font-bold">Kassir:</span> <span>Admin</span></div>
                    </div>
                    <div className="border-b mb-4 pb-4 space-y-2">
                       {cart.length > 0 ? cart.map(c => (
                         <div key={c.id} className="flex"><span className="flex-1">{c.qty}x {c.name}</span><span className="font-bold">{(c.price * c.qty).toLocaleString()}</span></div>
                       )) : (
                         <div className="flex"><span className="flex-1">1x Gamburger</span><span className="font-bold">34,000</span></div>
                       )}
                    </div>
                    <div className="flex font-bold text-lg mb-6">
                      <span>JAMI:</span>
                      <span>{(total || 45000).toLocaleString()} UZS</span>
                    </div>
                    <div className="text-center text-xs">
                      <p>Xarid uchun tashakkur!</p>
                      <p>Yana kelib turing 😊</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      );
    };
'''

html = html.replace("const App = () => {", components_code + "\n    const App = () => {")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated successfully")
