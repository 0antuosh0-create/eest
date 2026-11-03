export type Output = { v: string; unit: string; note: string };

export type Station = {
  id: string;
  no: string;
  lat: string;
  fa: string;
  deck: string;
  xp: number;
  level: number; // 1..5 difficulty
  minutes: number;
  body: string;
  rules: { k: string; v: string }[];
  codeTitle: string;
  code: string;
  console: string[];
  outputs: Output[];
  pitfall: { title: string; body: string };
};

export const STATIONS: Station[] = [
  {
    id: "s1",
    no: "01",
    lat: "SYNTAX & SETUP",
    fa: "زبان EES را یاد بگیر، نه فقط دکمه‌هایش را",
    deck: "پیش از هر محاسبه‌ای، باید بدانی EES چطور می‌نویسد، کجا اشتباه می‌گیرد و سیستم واحدش را از کجا تنظیم می‌کنی.",
    xp: 120,
    level: 1,
    minutes: 25,
    body:
      "پنجره‌ی Equations یک ویرایشگر متن ساده است، اما موتور زیر آن یک حل‌کننده‌ی هم‌زمان غیرخطی است. یعنی ترتیب معادلات هیچ اهمیتی ندارد، مجهول و معلوم جای مشخصی ندارند، و EES خودش مجموعه‌ی معادلات را به‌صورت یک‌جا حل می‌کند. اولین کار همیشه تنظیم Unit System از منوی Options است: SI با دمای سانتی‌گراد، فشار بر حسب kPa و انرژی بر حسب kJ.",
    rules: [
      { k: "بزرگی و کوچکی حروف", v: "تفاوتی ندارد؛ T_1 و t_1 یک متغیرند." },
      { k: "خط خالی و فاصله", v: "نادیده گرفته می‌شوند؛ کد را تمیز بنویس." },
      { k: "توضیح (Comment)", v: "بین { } یا \" \" — داخل { } می‌تواند تودرتو باشد." },
      { k: "واحدها", v: "بلافاصله بعد از مقدار، داخل [ ] مثل g = 9.81 [m/s^2]" },
      { k: "توان", v: "^ یا ** — هر دو یکسان‌اند." },
      { k: "جداکننده‌ی معادلات", v: "خط جدید، یا ; برای چند معادله در یک خط." },
      { k: "نام متغیر", v: "باید با حرف شروع شود؛ _ برای زیرنویس و نام‌های یونانی خودکار ترجمه می‌شوند." },
      { k: "آرایه‌ها", v: "با اندیس داخل کروش: T[1] ، T[2] ، ..." },
    ],
    codeTitle: "افت فشار در لوله‌ی انتقال آب",
    code: `{ افت فشار اصطکاکی در لوله‌ی دایره‌ای — سیستم واحد SI }
"هندسه و شرایط جریان"
D = 0.05 [m]        "قطر داخلی"
L = 120 [m]         "طول لوله"
Vel = 2.4 [m/s]     "سرعت متوسط"
rho = 998 [kg/m^3]  "چگالی آب در 20 C"
mu = 0.001 [kg/m*s] "ویسکوزیته‌ی دینامیکی"

Re = rho*Vel*D/mu                 "عدد رینولدز"
f = 0.316/Re^0.25                 "ضریب اصطکاک بلاسیوس برای لوله‌ی صاف"
dP = f*(L/D)*(rho*Vel^2/2) [Pa]   "افت فشار"
dP_kPa = convert(Pa, kPa)`,
    console: [
      "EES  —  Engineering Equation Solver  v10.4",
      "> Check/Format ...  OK  |  0 syntax error",
      "> Check Units ...   0 unit problems",
      "> Solve  (Newton-Raphson)  converged in 4 iterations",
    ],
    outputs: [
      { v: "119760", unit: "—", note: "Re" },
      { v: "0.01699", unit: "—", note: "f" },
      { v: "117178", unit: "Pa", note: "dP" },
      { v: "117.2", unit: "kPa", note: "dP_kPa" },
    ],
    pitfall: {
      title: "دام شماره‌ی ۱: واحدهایی که EES نمی‌داند",
      body:
        "اگر واحد یک متغیر را تعریف نکنی، EES هشدار Unit Problem می‌دهد و هیچ خطایی هم نمی‌بینی. راه‌حل: روی نام متغیر در Solution Window کلیک راست کن و واحد را وارد کن، یا در همان خط معادله با [ ] مشخص کن. تابع convert(a, b) هم برای تبدیل صریح واحدها ساخته شده است.",
    },
  },
  {
    id: "s2",
    no: "02",
    lat: "SIMULTANEOUS SOLVE",
    fa: "سیستم معادلات، حدس اولیه و پنجره‌ی هشدارها",
    deck: "EES معادلات را یکی‌یکی حل نمی‌کند؛ آن‌ها را هم‌زمان حل می‌کند. این یعنی باید به تعداد معادلات و مجهول‌ها فکر کنی، نه به ترتیبشان.",
    xp: 180,
    level: 2,
    minutes: 35,
    body:
      "هر معادله‌ی مستقل، یک درجه آزادی را می‌بندد. اگر معادله‌ای کم داشته باشی، EES می‌گوید «The number of equations is less than the number of variables» و اگر زیاد داشته باشی، مازاد را دور می‌ریزد. برای مسائل غیرخطی، مقدار حدس (Guess) و کران (Lower/Upper Bound) از پنجره‌ی Variable Information تعیین می‌شود و می‌تواند تفاوت بین همگرایی و شکست حل باشد.",
    rules: [
      { k: "تعادل جرم", v: "Σ m_dot_in = Σ m_dot_out" },
      { k: "تعادل انرژی", v: "Q_dot - W_dot = Σ m_dot·(h_out − h_in)" },
      { k: "حدس اولیه", v: "Guess value نزدیک به جواب، تعداد تکرار را کم می‌کند." },
      { k: "کران‌ها", v: "Lower/Upper Bound از واگرایی جلوگیری می‌کند." },
      { k: "همگرایی", v: "Residual هر معادله باید به صفر برسد؛ نه فقط مجموعشان." },
    ],
    codeTitle: "مخلوط‌سازی دو جریان آب",
    code: `{ تلاقی دو جریان آب در یک مخزن عایق — تعادل انرژی }
m_dot_1 = 2.5 [kg/s]     "جریان داغ"
T_1 = 80 [C]
m_dot_2 = 4.0 [kg/s]     "جریان سرد"
T_2 = 20 [C]
C_p = 4.18 [kJ/kg*K]     "ظرفیت گرمایی ویژه‌ی آب"

m_dot_3 = m_dot_1 + m_dot_2
m_dot_1*C_p*(T_1 - T_3) = m_dot_2*C_p*(T_3 - T_2)

Q_hot = m_dot_1*C_p*(T_1 - T_3)  [kW]   "گرمای داده‌شده"
Q_cold = m_dot_2*C_p*(T_3 - T_2) [kW]   "گرمای گرفته‌شده"
Balance = Q_hot - Q_cold                "باید صفر شود"`,
    console: [
      "> Solve  (Newton-Raphson)  converged in 2 iterations",
      "> Warning: 1 variable has no units assigned — T_3 [C]",
      "> Check Units ...  balance closed,  residual < 1E-09",
    ],
    outputs: [
      { v: "43.077", unit: "C", note: "T_3" },
      { v: "6.5", unit: "kg/s", note: "m_dot_3" },
      { v: "385.9", unit: "kW", note: "Q_hot" },
      { v: "385.9", unit: "kW", note: "Q_cold" },
      { v: "0.000", unit: "kW", note: "Balance" },
    ],
    pitfall: {
      title: "دام شماره‌ی ۲: معادله‌ی تکراری",
      body:
        "اگر دو معادله‌ی تو وابسته بنویسی (مثلاً هر دو شکل یک تعادل انرژی)، EES ماتریس ژاکوبین را تکین می‌کند و حل‌کننده می‌ایستد. نشانه‌اش پیام «singular matrix» است. معادله‌ی Balance در کد بالا عمداً حذف می‌شود یا در {} قرار می‌گیرد تا به‌عنوان معادله‌ی اصلی شمرده نشود.",
    },
  },
  {
    id: "s3",
    no: "03",
    lat: "PROPERTY LIBRARY",
    fa: "کتابخانه‌ی خواص: جایی که EES واقعاً قدرتمند است",
    deck: "بیش از ۳۰۰۰ ماده، با یک صدا. فقط کافی است نام سیال را به‌صورت رشته بدهی و دو خواص مستقل را مشخص کنی.",
    xp: 240,
    level: 3,
    minutes: 45,
    body:
      "نام سیال یک متغیر رشته‌ای است: Fluid$ = 'R134a'. سپس هر تابع خواص با دو ورودی مستقل کار می‌کند: T و P، یا P و h، یا T و x و غیره. برای آب و بخار، به‌جای نام ماده می‌توانی از Steam استفاده کنی. توابع عمومی مثل enthalpy ،entropy ،temperature ،pressure ،quality ،volume و specVolume همه به همین شکل صدا زده می‌شوند.",
    rules: [
      { k: "رشته‌ها", v: "با ' تک‌یا دوتایی: Fluid$ = 'R134a'" },
      { k: "دو ورودی مستقل", v: "هر تابع خواص دقیقاً دو خواص مستقل می‌خواهد." },
      { k: "بخار آب", v: "Steam یا Water — هر دو کتابخانه‌ی IAPWS-IF97." },
      { k: "کیفیت بخار", v: "quality(Steam, P=P, h=h) بین 0 تا 1؛ بیرون از دو فاز خطاست." },
      { k: "واحد خروجی", v: "به Unit System بستگی دارد؛ kJ/kg در SI." },
    ],
    codeTitle: "تراکم ایزنتروپیک مبرد R134a",
    code: `{ کمپرسور تبرید — R134a از بخار اشباع تا فشار تخلیه }
Fluid$ = 'R134a'
T_1 = -10 [C]
x_1 = 1.0                "بخار اشباع در ورودی کمپرسور"

P_sat = pressure(Fluid$, T=T_1)      [MPa]
h_1 = enthalpy(Fluid$, T=T_1, x=x_1) [kJ/kg]
s_1 = entropy(Fluid$, T=T_1, x=x_1)  [kJ/kg*K]

P_2 = 0.8 [MPa]
s_2s = s_1
h_2s = enthalpy(Fluid$, P=P_2, s=s_2s)  "حالت ایزنتروپیک"

eta_is = 0.75            "بازده ایزنتروپیک کمپرسور"
h_2 = h_1 + (h_2s - h_1)/eta_is
T_2 = temperature(Fluid$, h=h_2, P=P_2) [C]
w_comp = h_2 - h_1       "کار ویژه‌ی تراکم"`,
    console: [
      "> Fluid$ = 'R134a'   loaded  |  REFPROP-compatible library",
      "> Solve  converged in 3 iterations",
      "> Warning: state 2 is superheated vapor (x undefined)",
    ],
    outputs: [
      { v: "0.2007", unit: "MPa", note: "P_sat" },
      { v: "241.7", unit: "kJ/kg", note: "h_1" },
      { v: "0.9253", unit: "kJ/kg·K", note: "s_1" },
      { v: "269.5", unit: "kJ/kg", note: "h_2s" },
      { v: "278.8", unit: "kJ/kg", note: "h_2" },
      { v: "42.3", unit: "C", note: "T_2" },
      { v: "37.1", unit: "kJ/kg", note: "w_comp" },
    ],
    pitfall: {
      title: "دام شماره‌ی ۳: دو ورودی وابسته",
      body:
        "اگر T و h را با هم بدهی در حالی که h تابعی از T و P است، EES داده‌ی ناسازگار می‌گیرد و یا مقداری خارج از دامنه‌ی دوفاز برمی‌گرداند. قانون سرانگشتی: همیشه دو خواص مستقل انتخاب کن (مثل P و s) و بقیه را محاسبه کن.",
    },
  },
  {
    id: "s4",
    no: "04",
    lat: "PARAMETRIC TABLES",
    fa: "جدول پارامتریک، نمودار و برازش منحنی",
    deck: "یک معادله حل کردن، مهندسی نیست. مهندسی یعنی ببینی وقتی فشار دیگ از ۲ تا ۲۰ مگاپاسکال می‌رود، بازده چطور تغییر می‌کند.",
    xp: 260,
    level: 3,
    minutes: 40,
    body:
      "از منوی Tables یک Parametric Table بساز، متغیرهای ورودی و خروجی را به آن اضافه کن، سپس با Alter Values یک متغیر را به‌صورت گام‌به‌گام تغییر بده. دکمه‌ی Solve Table کل جدول را حل می‌کند. بعد می‌توانی از آن نمودار ساخت (New Plot) یا منحنی برازش کرد (Curve Fit) و رابطه‌ی به‌دست‌آمده را به‌صورت یک معادله‌ی واقعی به پنجره‌ی معادلات برگرداند.",
    rules: [
      { k: "ساخت جدول", v: "Tables ▸ New Parametric Table ▸ انتخاب متغیرها" },
      { k: "تغییر مقدار", v: "Alter Values ▸ First/Last/Step یا مقدارهای دلخواه" },
      { k: "حل دسته‌ای", v: "Ctrl+T برای Solve Table" },
      { k: "نمودار", v: "New Plot ▸ انتخاب محور X و Y از روی جدول" },
      { k: "برازش", v: "Curve Fit ▸ چندجمله‌ای/نمایی/توانی، خروجی به‌صورت معادله" },
      { k: "Lookup Table", v: "برای داده‌ی تجربی و درون‌یابی با interp1 و interp2" },
    ],
    codeTitle: "اثر فشار دیگ بر بازده‌ی سیکل رانکین",
    code: `{ پارامتریک روی فشار دیگ — T_max ثابت در 500 C }
T_max = 500 [C]
P_cond = 10 [kPa]
P_boiler = 8000 [kPa]     "در جدول از 2000 تا 20000 تغییر می‌کند"

h_3 = enthalpy(Steam, P=P_boiler, T=T_max)
s_3 = entropy(Steam, P=P_boiler, T=T_max)
h_1 = enthalpy(Steam, P=P_cond, x=0)
v_1 = volume(Steam, P=P_cond, x=0)

w_p = v_1*(P_boiler - P_cond)
h_2 = h_1 + w_p
h_4 = enthalpy(Steam, P=P_cond, s=s_3)
q_in = h_3 - h_2
eta_th = (h_3 - h_4 - w_p)/q_in
x_4 = quality(Steam, P=P_cond, s=s_3)   "بخار مرطوب خروجی توربین"`,
    console: [
      "> Solve Table  ...  20 rows solved in 0.42 s",
      "> Plot created: eta_th  vs  P_boiler",
      "> Curve Fit  (poly 3)   R^2 = 0.9993   written to Equations Window",
    ],
    outputs: [
      { v: "0.3339", unit: "—", note: "eta_th @ 8 MPa" },
      { v: "0.8102", unit: "—", note: "x_4 @ 8 MPa" },
      { v: "0.3517", unit: "—", note: "eta_th @ 14 MPa" },
      { v: "0.7425", unit: "—", note: "x_4 @ 14 MPa" },
    ],
    pitfall: {
      title: "دام شماره‌ی ۴: جدول، معادله را بازنویسی می‌کند",
      body:
        "وقتی متغیری را وارد Parametric Table می‌کنی، مقدار آن در پنجره‌ی معادلات نادیده گرفته می‌شود و مقدار جدولی جایگزینش می‌شود. اگر معادله‌ای مانند eta_c = 0.8 داری و همان را در جدول می‌خواهی تغییر بدهی، باید آن معادله را حذف یا در { } محصور کنی، وگرنه با پیام «duplicate specification» مواجه می‌شوی.",
    },
  },
  {
    id: "s5",
    no: "05",
    lat: "OPTIMIZE & UNCERTAINTY",
    fa: "بهینه‌سازی، عدم قطعیت و تحلیل حساسیت",
    deck: "وقتی مسئله چند راه‌حل دارد، EES می‌تواند بهترینشان را پیدا کند — و بگوید جوابت چقدر قابل اعتماد است.",
    xp: 320,
    level: 4,
    minutes: 55,
    body:
      "فرمان Min/Max از منوی Calculate یک تابع هدف را با انتخاب چند متغیر طراحی، تحت کران‌ها و قیدهای دلخواه بهینه می‌کند. روش‌های Golden Section و Quadratic Approximation برای تک‌متغیره و BFGS/Gauss برای چندمتغیره موجودند. ابزار Uncertainty هم عدم قطعیت ورودی‌ها را به روش مونت‌کارلو یا انتشار خطای مرتبه‌ی اول به خروجی‌ها منتقل می‌کند.",
    rules: [
      { k: "هدف", v: "Minimize یا Maximize یک متغیر اسکالر" },
      { k: "متغیرهای طراحی", v: "چند متغیر که موتور آزاد است مقدارشان را عوض کند" },
      { k: "قید", v: "معادله‌ی نابرابری با <= یا >=" },
      { k: "مونت‌کارلو", v: "Calculate ▸ Uncertainty ▸ توزیع نرمال/یکنواخت/مثلثی" },
      { k: "گزارش", v: "Uncertainty Results: مقدار نامعین ± بازه‌ی اطمینان ۹۵٪" },
    ],
    codeTitle: "بهینه‌سازی فشار دیگ با قید رطوبت توربین",
    code: `{ حداکثر کردن بازده‌ی خالص با قید کیفیت بخار خروجی }
T_max = 520 [C]
P_cond = 8 [kPa]
P_boiler = 12000 [kPa]    "متغیر طراحی — توسط Min/Max تغییر می‌کند"

h_3 = enthalpy(Steam, P=P_boiler, T=T_max)
s_3 = entropy(Steam, P=P_boiler, T=T_max)
h_1 = enthalpy(Steam, P=P_cond, x=0)
w_p = volume(Steam, P=P_cond, x=0)*(P_boiler - P_cond)

h_4 = enthalpy(Steam, P=P_cond, s=s_3)
x_4 = quality(Steam, P=P_cond, s=s_3)
eta_th = (h_3 - h_4 - w_p)/(h_3 - h_1 - w_p)

"قید: کیفیت بخار خروجی توربین نباید کمتر از 0.86 باشد"
x_4 >= 0.86`,
    console: [
      "> Min/Max  (BFGS)   objective = -eta_th",
      "> 37 iterations  |  gradient norm 2.1E-07",
      "> Optimum found:  P_boiler = 13.42 MPa   eta_th = 0.3721",
      "> Constraint x_4 >= 0.86  active at optimum",
    ],
    outputs: [
      { v: "13.42", unit: "MPa", note: "P_boiler*" },
      { v: "0.3721", unit: "—", note: "eta_th*" },
      { v: "0.860", unit: "—", note: "x_4 (قید فعال)" },
      { v: "±0.0043", unit: "—", note: "دامنه‌ی عدم قطعیت eta_th" },
    ],
    pitfall: {
      title: "دام شماره‌ی ۵: بهینه‌ی محلی",
      body:
        "روش‌های گرادیانی به نقطه‌ی شروع حساس‌اند. اگر جواب غیرفیزیکی گرفتی، چند مقدار حدس مختلف را امتحان کن یا از Golden Section برای مسائل تک‌متغیره استفاده کن. همیشه جواب بهینه را با تحلیل فیزیکی بسنج — عدد درست با استدلال غلط، همچنان عدد درست به نظر می‌رسد.",
    },
  },
  {
    id: "s6",
    no: "06",
    lat: "CYCLE MODELLING",
    fa: "یک سیکل کامل بساز و آن را بفروش",
    deck: "همه‌چیز کنار هم: ساختار مرحله‌به‌مرحله، نام‌گذاری حالت‌ها، بازده‌های ایزنتروپیک، و گزارشی که یک مهندس واقعی امضا می‌کند.",
    xp: 480,
    level: 5,
    minutes: 75,
    body:
      "یک مدل خوب EES سه ویژگی دارد: نام‌گذاری منظم حالت‌ها (h_1، h_2، h_3)، جداسازی ورودی‌ها در بالای فایل، و شاخص‌های عملکرد در پایین. این ساختار باعث می‌شود فایل بعد از شش ماه هم قابل‌فهم باشد، و وقتی از آن در Parametric Table یا Min/Max استفاده می‌کنی، همه‌چیز مرتب بماند.",
    rules: [
      { k: "نام‌گذاری حالت‌ها", v: "h_1 تا h_4 + پسوند s برای حالت ایزنتروپیک: h_4s" },
      { k: "بازده ایزنتروپیک", v: "h_2 = h_1 + (h_2s − h_1)/η_p  ،  h_4 = h_3 − η_t·(h_3 − h_4s)" },
      { k: "شاخص‌ها", v: "w_net ، q_in ، eta_th ، bwr ، W_net" },
      { k: "گزارش", v: "Copy با نگه‌داشتن Ctrl، ستون نام و واحد را هم کپی می‌کند." },
      { k: "قالب‌بندی", v: "Formatted Equations — معادلات به‌صورت ریاضی چاپ می‌شوند." },
    ],
    codeTitle: "سیکل رانکین ساده با بازده‌های واقعی",
    code: `{ سیکل رانکین — بخار اشباع خشک ورودی توربین نیست }
P_boiler = 8000 [kPa]      "فشار دیگ"
T_max = 500 [C]           "دمای بخار داغ"
P_cond = 10 [kPa]         "فشار کندانسور"
eta_t = 0.85              "بازده ایزنتروپیک توربین"
eta_p = 0.80              "بازده ایزنتروپیک پمپ"
m_dot = 50 [kg/s]         "دبی جرمی بخار"

"وضعیت ۱ — خروجی کندانسور، مایع اشباع"
h_1 = enthalpy(Steam, P=P_cond, x=0)
v_1 = volume(Steam, P=P_cond, x=0)

"پمپ"
w_p = v_1*(P_boiler - P_cond)/eta_p
h_2 = h_1 + w_p

"دیگ بخار"
h_3 = enthalpy(Steam, P=P_boiler, T=T_max)
s_3 = entropy(Steam, P=P_boiler, T=T_max)

"توربین"
h_4s = enthalpy(Steam, P=P_cond, s=s_3)
h_4 = h_3 - eta_t*(h_3 - h_4s)
x_4 = quality(Steam, P=P_cond, h=h_4)

"شاخص‌های عملکرد"
w_turb = h_3 - h_4
w_net = w_turb - w_p
q_in = h_3 - h_2
eta_th = w_net/q_in
bwr = w_p/w_turb
W_net = m_dot*w_net`,
    console: [
      "> Check/Format ...  OK",
      "> Solve  converged in 5 iterations  |  0 unit problems",
      "> 22 variables solved  |  elapsed 0.03 s",
    ],
    outputs: [
      { v: "3398.3", unit: "kJ/kg", note: "h_3" },
      { v: "2320.7", unit: "kJ/kg", note: "h_4" },
      { v: "0.8897", unit: "—", note: "x_4" },
      { v: "1067.5", unit: "kJ/kg", note: "w_net" },
      { v: "3196.4", unit: "kJ/kg", note: "q_in" },
      { v: "0.3339", unit: "—", note: "eta_th" },
      { v: "0.0094", unit: "—", note: "bwr" },
      { v: "53.38", unit: "MW", note: "W_net" },
    ],
    pitfall: {
      title: "دام شماره‌ی ۶: رطوبت توربین",
      body:
        "وقتی x_4 پایین‌تر از ۰٫۸۸ می‌رسد، قطرات آب به پره‌های توربین آسیب می‌زنند. در مدل واقعی باید یا فشار دیگ را بالا ببری، یا دمای بخار را افزایش دهی، یا از بازگرمایش (Reheat) استفاده کنی. این دقیقاً همان جایی است که مدل EES تو را از محاسبه‌ی صرف به طراحی مهندسی می‌رساند.",
    },
  },
];

export const QUIZ = [
  {
    q: "کدام عبارت درباره‌ی ترتیب معادلات در EES درست است؟",
    options: [
      "معادلات باید از بالا به پایین حل شوند",
      "ترتیب معادلات هیچ اهمیتی ندارد",
      "فقط معادله‌های وابسته باید آخر باشند",
      "باید مجهول‌ها در سمت چپ باشند",
    ],
    answer: 1,
    why: "EES مجموعه‌ی معادلات را به‌صورت هم‌زمان حل می‌کند؛ نه ترتیب و نه جای معلوم و مجهول اهمیتی ندارد.",
  },
  {
    q: "برای مشخص کردن واحد یک مقدار ثابت در خط معادله از چه نشانه‌ای استفاده می‌شود؟",
    options: ["{ }", "( )", "[ ]", "< >"],
    answer: 2,
    why: "واحدها بلافاصله بعد از مقدار داخل [ ] می‌آیند، مثل g = 9.81 [m/s^2]. از { } برای توضیح استفاده می‌شود.",
  },
  {
    q: "تابع enthalpy(Fluid$, P=P, s=s) چند ورودی مستقل می‌گیرد؟",
    options: ["یکی", "دو", "سه", "بستگی به سیال دارد"],
    answer: 1,
    why: "همه‌ی توابع خواص EES دقیقاً دو خواص مستقل می‌خواهند. دادن ورودی سوم یا ورودی‌های وابسته باعث خطای ناسازگاری می‌شود.",
  },
  {
    q: "پیام «singular matrix» معمولاً نشانه‌ی چیست؟",
    options: [
      "تقسیم بر صفر در یک معادله",
      "معادلات وابسته یا تکراری در سیستم",
      "نبود کتابخانه‌ی خواص",
      "خطای واحد‌ها",
    ],
    answer: 1,
    why: "ماتریس ژاکوبین تکین می‌شود وقتی دو معادله مستقل نباشند. یکی از آن‌ها را حذف یا محصور کن.",
  },
  {
    q: "در سیکل رانکین، افزایش فشار دیگ (با دمای ثابت) معمولاً چه اثری دارد؟",
    options: [
      "بازده بالا می‌رود و کیفیت بخار خروجی کاهش می‌یابد",
      "بازده پایین می‌آید",
      "هر دو ثابت می‌مانند",
      "کیفیت بخار خروجی افزایش می‌یابد",
    ],
    answer: 0,
    why: "میانگین دمای افزایش گرما بالا می‌رود و بازده بیشتر می‌شود، اما افت کیفیت در خروجی توربین بیشتر می‌شود — همان قید x_4 ≥ ۰٫۸۶.",
  },
];

export const CHEATS: { cat: string; rows: { sym: string; name: string; note: string }[] }[] = [
  {
    cat: "توابع خواص",
    rows: [
      { sym: "enthalpy(Fluid$, T=t, P=p)", name: "آنتالپی ویژه", note: "kJ/kg — هر دو ورودی باید مستقل باشند" },
      { sym: "entropy(Fluid$, P=p, x=x)", name: "آنتروپی ویژه", note: "kJ/kg·K" },
      { sym: "temperature(Fluid$, h=h, P=p)", name: "دما از روی دو خواص", note: "برگرداندن خواص ناشناخته" },
      { sym: "pressure(Fluid$, T=t, x=x)", name: "فشار (اشباع)", note: "برای x=0 یا 1 فشار اشباع" },
      { sym: "quality(Fluid$, P=p, h=h)", name: "کیفیت بخار x", note: "فقط در دامنه‌ی دوفاز معتبر است" },
      { sym: "volume(Fluid$, T=t, P=p)", name: "حجم ویژه", note: "m³/kg" },
    ],
  },
  {
    cat: "توابع عمومی و ریاضی",
    rows: [
      { sym: "convert(kJ, J)", name: "تبدیل واحد", note: "در هر معادله قابل استفاده است" },
      { sym: "sum(A[1..10])", name: "جمع آرایه", note: "روی اندیس‌های یک آرایه" },
      { sym: "interp1(x[], y[], x=x0)", name: "درون‌یابی خطی", note: "از Lookup Table" },
      { sym: "min(a, b, c) / max(...)", name: "کمینه و بیشینه", note: "قابل استفاده در قیدها" },
      { sym: "abs(x) · sqrt(x) · ln(x)", name: "توابع ریاضی پایه", note: "log پایه‌ی 10 و ln طبیعی" },
    ],
  },
  {
    cat: "فرمان‌ها و میان‌برها",
    rows: [
      { sym: "Ctrl + T", name: "Solve Table", note: "حل کل جدول پارامتریک" },
      { sym: "Ctrl + E", name: "Formatted Equations", note: "نمایش ریاضی معادلات" },
      { sym: "F2 / Ctrl + I", name: "Variable Information", note: "حدس، کران و واحد متغیر" },
      { sym: "$INCLUDE file.EES", name: "دستورالعمل دلار", note: "فراخوانی فایل یا تنظیمات" },
      { sym: "{ }  ·  \" \"  ·  ;", name: "توضیح و جداکننده", note: "ساختار پایه‌ی نحو" },
    ],
  },
];

/* ---- Rankine lab: superheated steam at 500 C (IAPWS-IF97) ---- */
export const STEAM_500: { p: number; h: number; s: number }[] = [
  { p: 1, h: 3478.5, s: 7.7622 },
  { p: 2, h: 3467.6, s: 7.4317 },
  { p: 4, h: 3445.3, s: 7.0901 },
  { p: 6, h: 3422.2, s: 6.8803 },
  { p: 8, h: 3398.3, s: 6.7266 },
  { p: 10, h: 3373.6, s: 6.5966 },
  { p: 12, h: 3348.0, s: 6.4836 },
  { p: 14, h: 3321.4, s: 6.3821 },
  { p: 16, h: 3294.1, s: 6.2885 },
  { p: 18, h: 3265.9, s: 6.2011 },
  { p: 20, h: 3236.6, s: 6.1184 },
];

export const COND = { hf: 191.83, hfg: 2392.8, sf: 0.6493, sfg: 7.5009, vf: 0.00101 };

export function rankine(pMPa: number, etaT: number, pCondKPa = 10, pMax = 8000) {
  const t = STEAM_500;
  let i = 0;
  while (i < t.length - 2 && t[i + 1].p < pMPa) i++;
  const a = t[i];
  const b = t[i + 1];
  const f = (pMPa - a.p) / (b.p - a.p);
  const h3 = a.h + f * (b.h - a.h);
  const s3 = a.s + f * (b.s - a.s);
  const x4s = (s3 - COND.sf) / COND.sfg;
  const h4s = COND.hf + x4s * COND.hfg;
  const h4 = h3 - etaT * (h3 - h4s);
  const x4 = (h4 - COND.hf) / COND.hfg;
  const wp = COND.vf * (pMPa * 1000 - pCondKPa);
  const h1 = COND.hf;
  const h2 = h1 + wp;
  const wTurb = h3 - h4;
  const wNet = wTurb - wp;
  const qIn = h3 - h2;
  return {
    h3,
    h4,
    x4,
    x4s,
    wp,
    wTurb,
    wNet,
    qIn,
    eta: wNet / qIn,
    bwr: wp / wTurb,
    p: pMPa,
    pMax,
  };
}
